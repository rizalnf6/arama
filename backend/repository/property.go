package repository

import (
	"database/sql"
	"villa-arama-riverside/database"
	"villa-arama-riverside/models"

	"github.com/lib/pq"
)

// GetAllProperties returns all properties
func GetAllProperties() ([]models.Property, error) {
	rows, err := database.DB.Query(`
		SELECT id, name, tagline, description, location, image_url, images, amenities, max_guests, bedrooms, bathrooms, created_at, updated_at
		FROM properties
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var properties []models.Property
	for rows.Next() {
		var p models.Property
		err := rows.Scan(&p.ID, &p.Name, &p.Tagline, &p.Description, &p.Location, &p.ImageURL, pq.Array(&p.Images), pq.Array(&p.Amenities), &p.MaxGuests, &p.Bedrooms, &p.Bathrooms, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		properties = append(properties, p)
	}

	return properties, nil
}

// GetPropertyByID returns a property by ID
func GetPropertyByID(id string) (*models.Property, error) {
	var p models.Property
	err := database.DB.QueryRow(`
		SELECT id, name, tagline, description, location, image_url, images, amenities, max_guests, bedrooms, bathrooms, created_at, updated_at
		FROM properties
		WHERE id = $1
	`, id).Scan(&p.ID, &p.Name, &p.Tagline, &p.Description, &p.Location, &p.ImageURL, pq.Array(&p.Images), pq.Array(&p.Amenities), &p.MaxGuests, &p.Bedrooms, &p.Bathrooms, &p.CreatedAt, &p.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &p, nil
}
