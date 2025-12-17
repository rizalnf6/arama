package repository

import (
	"database/sql"
	"time"
	"villa-arama-riverside/database"
	"villa-arama-riverside/models"

	"github.com/google/uuid"
)

// GetBlockedDates returns all blocked dates for a property
func GetBlockedDates(propertyID string) ([]models.BlockedDate, error) {
	rows, err := database.DB.Query(`
		SELECT id, property_id, date, source, event_uid, created_at
		FROM blocked_dates
		WHERE property_id = $1
		ORDER BY date ASC
	`, propertyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dates []models.BlockedDate
	for rows.Next() {
		var d models.BlockedDate
		var source, eventUID sql.NullString
		err := rows.Scan(&d.ID, &d.PropertyID, &d.Date, &source, &eventUID, &d.CreatedAt)
		if err != nil {
			return nil, err
		}
		if source.Valid {
			d.Source = source.String
		}
		if eventUID.Valid {
			d.EventUID = eventUID.String
		}
		dates = append(dates, d)
	}

	return dates, nil
}

// AddBlockedDate adds a blocked date
func AddBlockedDate(propertyID, date, source, eventUID string) error {
	id := uuid.New().String()
	_, err := database.DB.Exec(`
		INSERT INTO blocked_dates (id, property_id, date, source, event_uid, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (property_id, date) DO NOTHING
	`, id, propertyID, date, source, eventUID, time.Now())
	return err
}

// ClearBlockedDatesBySource clears blocked dates from a specific source
func ClearBlockedDatesBySource(propertyID, source string) error {
	_, err := database.DB.Exec(`
		DELETE FROM blocked_dates
		WHERE property_id = $1 AND source = $2
	`, propertyID, source)
	return err
}

// GetAllICalURLs returns all iCal URLs
func GetAllICalURLs() ([]models.ICalURL, error) {
	rows, err := database.DB.Query(`
		SELECT id, property_id, url, source, last_sync, status, created_at, updated_at
		FROM ical_urls
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var urls []models.ICalURL
	for rows.Next() {
		var u models.ICalURL
		var source sql.NullString
		var lastSync sql.NullTime
		err := rows.Scan(&u.ID, &u.PropertyID, &u.URL, &source, &lastSync, &u.Status, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if source.Valid {
			u.Source = source.String
		}
		if lastSync.Valid {
			u.LastSync = lastSync.Time
		}
		urls = append(urls, u)
	}

	return urls, nil
}

// GetICalURLsByPropertyID returns iCal URLs for a property
func GetICalURLsByPropertyID(propertyID string) ([]models.ICalURL, error) {
	rows, err := database.DB.Query(`
		SELECT id, property_id, url, source, last_sync, status, created_at, updated_at
		FROM ical_urls
		WHERE property_id = $1
		ORDER BY created_at DESC
	`, propertyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var urls []models.ICalURL
	for rows.Next() {
		var u models.ICalURL
		var source sql.NullString
		var lastSync sql.NullTime
		err := rows.Scan(&u.ID, &u.PropertyID, &u.URL, &source, &lastSync, &u.Status, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if source.Valid {
			u.Source = source.String
		}
		if lastSync.Valid {
			u.LastSync = lastSync.Time
		}
		urls = append(urls, u)
	}

	return urls, nil
}

// CreateICalURL creates a new iCal URL
func CreateICalURL(req models.CreateICalURLRequest) (*models.ICalURL, error) {
	id := uuid.New().String()
	now := time.Now()

	_, err := database.DB.Exec(`
		INSERT INTO ical_urls (id, property_id, url, source, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, 'active', $5, $6)
	`, id, req.PropertyID, req.URL, req.Source, now, now)

	if err != nil {
		return nil, err
	}

	return GetICalURLByID(id)
}

// GetICalURLByID returns an iCal URL by ID
func GetICalURLByID(id string) (*models.ICalURL, error) {
	var u models.ICalURL
	var source sql.NullString
	var lastSync sql.NullTime
	err := database.DB.QueryRow(`
		SELECT id, property_id, url, source, last_sync, status, created_at, updated_at
		FROM ical_urls
		WHERE id = $1
	`, id).Scan(&u.ID, &u.PropertyID, &u.URL, &source, &lastSync, &u.Status, &u.CreatedAt, &u.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if source.Valid {
		u.Source = source.String
	}
	if lastSync.Valid {
		u.LastSync = lastSync.Time
	}

	return &u, nil
}

// UpdateICalURLStatus updates the status and last sync time of an iCal URL
func UpdateICalURLStatus(id string, status string) error {
	_, err := database.DB.Exec(`
		UPDATE ical_urls
		SET status = $1, last_sync = $2, updated_at = $3
		WHERE id = $4
	`, status, time.Now(), time.Now(), id)
	return err
}

// DeleteICalURL deletes an iCal URL
func DeleteICalURL(id string) error {
	_, err := database.DB.Exec("DELETE FROM ical_urls WHERE id = $1", id)
	return err
}
