package repository

import (
	"database/sql"
	"time"
	"villa-arama-riverside/database"
	"villa-arama-riverside/models"

	"github.com/google/uuid"
)

// GetAllBedroomConfigs returns all bedroom configurations
func GetAllBedroomConfigs() ([]models.BedroomConfig, error) {
	rows, err := database.DB.Query(`
		SELECT id, name, description, price_add, max_guests, is_default, created_at, updated_at
		FROM bedroom_configs
		ORDER BY price_add ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var configs []models.BedroomConfig
	for rows.Next() {
		var c models.BedroomConfig
		err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.PriceAdd, &c.MaxGuests, &c.IsDefault, &c.CreatedAt, &c.UpdatedAt)
		if err != nil {
			return nil, err
		}
		configs = append(configs, c)
	}

	return configs, nil
}

// GetBedroomConfigByID returns a bedroom config by ID
func GetBedroomConfigByID(id string) (*models.BedroomConfig, error) {
	var c models.BedroomConfig
	err := database.DB.QueryRow(`
		SELECT id, name, description, price_add, max_guests, is_default, created_at, updated_at
		FROM bedroom_configs
		WHERE id = $1
	`, id).Scan(&c.ID, &c.Name, &c.Description, &c.PriceAdd, &c.MaxGuests, &c.IsDefault, &c.CreatedAt, &c.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &c, nil
}

// GetDefaultBedroomConfig returns the default bedroom config
func GetDefaultBedroomConfig() (*models.BedroomConfig, error) {
	var c models.BedroomConfig
	err := database.DB.QueryRow(`
		SELECT id, name, description, price_add, max_guests, is_default, created_at, updated_at
		FROM bedroom_configs
		WHERE is_default = true
		LIMIT 1
	`).Scan(&c.ID, &c.Name, &c.Description, &c.PriceAdd, &c.MaxGuests, &c.IsDefault, &c.CreatedAt, &c.UpdatedAt)

	if err == sql.ErrNoRows {
		// Return first config if no default
		err = database.DB.QueryRow(`
			SELECT id, name, description, price_add, max_guests, is_default, created_at, updated_at
			FROM bedroom_configs
			ORDER BY price_add ASC
			LIMIT 1
		`).Scan(&c.ID, &c.Name, &c.Description, &c.PriceAdd, &c.MaxGuests, &c.IsDefault, &c.CreatedAt, &c.UpdatedAt)
	}

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &c, nil
}

// CreateBedroomConfig creates a new bedroom config
func CreateBedroomConfig(req models.CreateBedroomConfigRequest) (*models.BedroomConfig, error) {
	id := uuid.New().String()
	now := time.Now()

	_, err := database.DB.Exec(`
		INSERT INTO bedroom_configs (id, name, description, price_add, max_guests, is_default, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, id, req.Name, req.Description, req.PriceAdd, req.MaxGuests, req.IsDefault, now, now)

	if err != nil {
		return nil, err
	}

	return GetBedroomConfigByID(id)
}

// UpdateBedroomConfig updates an existing bedroom config
func UpdateBedroomConfig(id string, req models.UpdateBedroomConfigRequest) (*models.BedroomConfig, error) {
	_, err := database.DB.Exec(`
		UPDATE bedroom_configs
		SET name = $1, description = $2, price_add = $3, max_guests = $4, is_default = $5, updated_at = $6
		WHERE id = $7
	`, req.Name, req.Description, req.PriceAdd, req.MaxGuests, req.IsDefault, time.Now(), id)

	if err != nil {
		return nil, err
	}

	return GetBedroomConfigByID(id)
}

// DeleteBedroomConfig deletes a bedroom config
func DeleteBedroomConfig(id string) error {
	_, err := database.DB.Exec("DELETE FROM bedroom_configs WHERE id = $1", id)
	return err
}
