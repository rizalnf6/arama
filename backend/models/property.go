package models

import "time"

// Property represents a villa property
type Property struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Tagline     string    `json:"tagline"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	ImageURL    string    `json:"image_url"`
	Images      []string  `json:"images"`
	Amenities   []string  `json:"amenities"`
	MaxGuests   int       `json:"max_guests"`
	Bedrooms    int       `json:"bedrooms"`
	Bathrooms   int       `json:"bathrooms"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// PropertyPricing represents dynamic pricing for a property
type PropertyPricing struct {
	PropertyID       string  `json:"property_id"`
	Date             string  `json:"date"`
	SeasonName       string  `json:"season_name"`
	SeasonDailyPrice float64 `json:"season_daily_price"`
	BedroomConfigID  string  `json:"bedroom_config_id,omitempty"`
	BedroomName      string  `json:"bedroom_name,omitempty"`
	BedroomPriceAdd  float64 `json:"bedroom_price_add"`
	TotalPrice       float64 `json:"total_price"`
}
