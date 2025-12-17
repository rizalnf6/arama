package models

import "time"

// Season represents a pricing season
type Season struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	StartDate  string    `json:"start_date"` // MM-DD format
	EndDate    string    `json:"end_date"`   // MM-DD format
	DailyPrice float64   `json:"daily_price"`
	IsDefault  bool      `json:"is_default"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// CreateSeasonRequest represents the request body for creating a season
type CreateSeasonRequest struct {
	Name       string  `json:"name"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
	DailyPrice float64 `json:"daily_price"`
	IsDefault  bool    `json:"is_default"`
}

// UpdateSeasonRequest represents the request body for updating a season
type UpdateSeasonRequest struct {
	Name       string  `json:"name"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
	DailyPrice float64 `json:"daily_price"`
	IsDefault  bool    `json:"is_default"`
}
