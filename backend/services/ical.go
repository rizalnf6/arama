package services

import (
	"bufio"
	"fmt"
	"net/http"
	"strings"
	"time"
	"villa-arama-riverside/repository"
)

// SyncICalFeed fetches and parses an iCal feed, blocking dates
func SyncICalFeed(icalURLID, propertyID, url, source string) error {
	// Fetch the iCal feed
	resp, err := http.Get(url)
	if err != nil {
		repository.UpdateICalURLStatus(icalURLID, "failed")
		return fmt.Errorf("failed to fetch iCal feed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		repository.UpdateICalURLStatus(icalURLID, "failed")
		return fmt.Errorf("failed to fetch iCal feed: status %d", resp.StatusCode)
	}

	// Clear existing blocked dates from this source
	if err := repository.ClearBlockedDatesBySource(propertyID, source); err != nil {
		return fmt.Errorf("failed to clear existing blocked dates: %w", err)
	}

	// Parse the iCal feed
	scanner := bufio.NewScanner(resp.Body)
	var inEvent bool
	var eventUID, dtStart, dtEnd string

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		if line == "BEGIN:VEVENT" {
			inEvent = true
			eventUID = ""
			dtStart = ""
			dtEnd = ""
		} else if line == "END:VEVENT" {
			if inEvent && dtStart != "" {
				// Parse and block dates
				startDate, err := parseICalDate(dtStart)
				if err == nil {
					endDate := startDate
					if dtEnd != "" {
						if parsed, err := parseICalDate(dtEnd); err == nil {
							endDate = parsed
						}
					}

					// Block all dates in range
					current := startDate
					for !current.After(endDate) {
						dateStr := current.Format("2006-01-02")
						repository.AddBlockedDate(propertyID, dateStr, source, eventUID)
						current = current.AddDate(0, 0, 1)
					}
				}
			}
			inEvent = false
		} else if inEvent {
			if strings.HasPrefix(line, "UID:") {
				eventUID = strings.TrimPrefix(line, "UID:")
			} else if strings.HasPrefix(line, "DTSTART") {
				dtStart = extractDateValue(line)
			} else if strings.HasPrefix(line, "DTEND") {
				dtEnd = extractDateValue(line)
			}
		}
	}

	// Update status to active
	repository.UpdateICalURLStatus(icalURLID, "active")

	return nil
}

// parseICalDate parses an iCal date string
func parseICalDate(dateStr string) (time.Time, error) {
	// Try different formats
	formats := []string{
		"20060102",
		"20060102T150405",
		"20060102T150405Z",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t, nil
		}
	}

	return time.Time{}, fmt.Errorf("unable to parse date: %s", dateStr)
}

// extractDateValue extracts the date value from an iCal property line
func extractDateValue(line string) string {
	// Handle formats like "DTSTART;VALUE=DATE:20231215" or "DTSTART:20231215T120000Z"
	if idx := strings.LastIndex(line, ":"); idx != -1 {
		return strings.TrimSpace(line[idx+1:])
	}
	return ""
}
