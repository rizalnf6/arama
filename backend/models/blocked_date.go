package models

import "time"

// BlockedDate represents a date blocked for booking (from iCal sync)
type BlockedDate struct {
	ID         string    `json:"id"`
	PropertyID string    `json:"property_id"`
	Date       string    `json:"date"`
	Source     string    `json:"source"` // airbnb, booking, manual
	EventUID   string    `json:"event_uid"`
	CreatedAt  time.Time `json:"created_at"`
}

// ICalURL represents an iCal feed URL for a property
type ICalURL struct {
	ID         string    `json:"id"`
	PropertyID string    `json:"property_id"`
	URL        string    `json:"url"`
	Source     string    `json:"source"` // airbnb, booking, other
	LastSync   time.Time `json:"last_sync"`
	Status     string    `json:"status"` // active, failed
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// CreateICalURLRequest represents the request for adding an iCal URL
type CreateICalURLRequest struct {
	PropertyID string `json:"property_id"`
	URL        string `json:"url"`
	Source     string `json:"source"`
}
