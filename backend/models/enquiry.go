package models

import "time"

// Enquiry represents a booking enquiry from a customer
type Enquiry struct {
	ID              string    `json:"id"`
	PropertyID      string    `json:"property_id"`
	Name            string    `json:"name"`
	Email           string    `json:"email"`
	Phone           string    `json:"phone"`
	CheckIn         string    `json:"check_in"`
	CheckOut        string    `json:"check_out"`
	Guests          int       `json:"guests"`
	BedroomConfigID string    `json:"bedroom_config_id"`
	Message         string    `json:"message"`
	TotalPrice      float64   `json:"total_price"`
	Status          string    `json:"status"` // pending, confirmed, cancelled
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// CreateEnquiryRequest represents the request body for creating an enquiry
type CreateEnquiryRequest struct {
	PropertyID      string `json:"property_id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	CheckIn         string `json:"check_in"`
	CheckOut        string `json:"check_out"`
	Guests          int    `json:"guests"`
	BedroomConfigID string `json:"bedroom_config_id"`
	Message         string `json:"message"`
}

// UpdateEnquiryStatusRequest represents the request for updating enquiry status
type UpdateEnquiryStatusRequest struct {
	Status string `json:"status"`
}
