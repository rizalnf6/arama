package models

import "time"

// BedroomConfig represents a bedroom configuration option
type BedroomConfig struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	PriceAdd    float64   `json:"price_add"`
	MaxGuests   int       `json:"max_guests"`
	IsDefault   bool      `json:"is_default"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateBedroomConfigRequest represents the request body for creating a bedroom config
type CreateBedroomConfigRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	PriceAdd    float64 `json:"price_add"`
	MaxGuests   int     `json:"max_guests"`
	IsDefault   bool    `json:"is_default"`
}

// UpdateBedroomConfigRequest represents the request body for updating a bedroom config
type UpdateBedroomConfigRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	PriceAdd    float64 `json:"price_add"`
	MaxGuests   int     `json:"max_guests"`
	IsDefault   bool    `json:"is_default"`
}
