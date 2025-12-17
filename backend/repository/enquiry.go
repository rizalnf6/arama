package repository

import (
	"database/sql"
	"time"
	"villa-arama-riverside/database"
	"villa-arama-riverside/models"

	"github.com/google/uuid"
)

// GetAllEnquiries returns all enquiries
func GetAllEnquiries() ([]models.Enquiry, error) {
	rows, err := database.DB.Query(`
		SELECT id, property_id, name, email, phone, check_in, check_out, guests, bedroom_config_id, message, total_price, status, created_at, updated_at
		FROM enquiries
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var enquiries []models.Enquiry
	for rows.Next() {
		var e models.Enquiry
		var bedroomConfigID sql.NullString
		err := rows.Scan(&e.ID, &e.PropertyID, &e.Name, &e.Email, &e.Phone, &e.CheckIn, &e.CheckOut, &e.Guests, &bedroomConfigID, &e.Message, &e.TotalPrice, &e.Status, &e.CreatedAt, &e.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if bedroomConfigID.Valid {
			e.BedroomConfigID = bedroomConfigID.String
		}
		enquiries = append(enquiries, e)
	}

	return enquiries, nil
}

// GetEnquiryByID returns an enquiry by ID
func GetEnquiryByID(id string) (*models.Enquiry, error) {
	var e models.Enquiry
	var bedroomConfigID sql.NullString
	err := database.DB.QueryRow(`
		SELECT id, property_id, name, email, phone, check_in, check_out, guests, bedroom_config_id, message, total_price, status, created_at, updated_at
		FROM enquiries
		WHERE id = $1
	`, id).Scan(&e.ID, &e.PropertyID, &e.Name, &e.Email, &e.Phone, &e.CheckIn, &e.CheckOut, &e.Guests, &bedroomConfigID, &e.Message, &e.TotalPrice, &e.Status, &e.CreatedAt, &e.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if bedroomConfigID.Valid {
		e.BedroomConfigID = bedroomConfigID.String
	}

	return &e, nil
}

// CreateEnquiry creates a new enquiry
func CreateEnquiry(req models.CreateEnquiryRequest, totalPrice float64) (*models.Enquiry, error) {
	id := uuid.New().String()
	now := time.Now()

	var bedroomConfigID interface{}
	if req.BedroomConfigID != "" {
		bedroomConfigID = req.BedroomConfigID
	} else {
		bedroomConfigID = nil
	}

	_, err := database.DB.Exec(`
		INSERT INTO enquiries (id, property_id, name, email, phone, check_in, check_out, guests, bedroom_config_id, message, total_price, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', $12, $13)
	`, id, req.PropertyID, req.Name, req.Email, req.Phone, req.CheckIn, req.CheckOut, req.Guests, bedroomConfigID, req.Message, totalPrice, now, now)

	if err != nil {
		return nil, err
	}

	return GetEnquiryByID(id)
}

// UpdateEnquiryStatus updates an enquiry's status
func UpdateEnquiryStatus(id string, status string) (*models.Enquiry, error) {
	_, err := database.DB.Exec(`
		UPDATE enquiries
		SET status = $1, updated_at = $2
		WHERE id = $3
	`, status, time.Now(), id)

	if err != nil {
		return nil, err
	}

	return GetEnquiryByID(id)
}
