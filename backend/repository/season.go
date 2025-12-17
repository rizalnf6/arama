package repository

import (
	"database/sql"
	"time"
	"villa-arama-riverside/database"
	"villa-arama-riverside/models"

	"github.com/google/uuid"
)

// GetAllSeasons returns all seasons
func GetAllSeasons() ([]models.Season, error) {
	rows, err := database.DB.Query(`
		SELECT id, name, start_date, end_date, daily_price, is_default, created_at, updated_at
		FROM seasons
		ORDER BY is_default DESC, daily_price DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var seasons []models.Season
	for rows.Next() {
		var s models.Season
		err := rows.Scan(&s.ID, &s.Name, &s.StartDate, &s.EndDate, &s.DailyPrice, &s.IsDefault, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return nil, err
		}
		seasons = append(seasons, s)
	}

	return seasons, nil
}

// GetSeasonByID returns a season by ID
func GetSeasonByID(id string) (*models.Season, error) {
	var s models.Season
	err := database.DB.QueryRow(`
		SELECT id, name, start_date, end_date, daily_price, is_default, created_at, updated_at
		FROM seasons
		WHERE id = $1
	`, id).Scan(&s.ID, &s.Name, &s.StartDate, &s.EndDate, &s.DailyPrice, &s.IsDefault, &s.CreatedAt, &s.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &s, nil
}

// GetSeasonForDate returns the season for a specific date
func GetSeasonForDate(date time.Time) (*models.Season, error) {
	monthDay := date.Format("01-02")

	// First try to find a matching non-default season
	var s models.Season
	err := database.DB.QueryRow(`
		SELECT id, name, start_date, end_date, daily_price, is_default, created_at, updated_at
		FROM seasons
		WHERE is_default = false
		AND (
			(start_date <= end_date AND $1 >= start_date AND $1 <= end_date)
			OR
			(start_date > end_date AND ($1 >= start_date OR $1 <= end_date))
		)
		ORDER BY daily_price DESC
		LIMIT 1
	`, monthDay).Scan(&s.ID, &s.Name, &s.StartDate, &s.EndDate, &s.DailyPrice, &s.IsDefault, &s.CreatedAt, &s.UpdatedAt)

	if err == sql.ErrNoRows {
		// Fall back to default season
		err = database.DB.QueryRow(`
			SELECT id, name, start_date, end_date, daily_price, is_default, created_at, updated_at
			FROM seasons
			WHERE is_default = true
			LIMIT 1
		`).Scan(&s.ID, &s.Name, &s.StartDate, &s.EndDate, &s.DailyPrice, &s.IsDefault, &s.CreatedAt, &s.UpdatedAt)
	}

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &s, nil
}

// CreateSeason creates a new season
func CreateSeason(req models.CreateSeasonRequest) (*models.Season, error) {
	id := uuid.New().String()
	now := time.Now()

	_, err := database.DB.Exec(`
		INSERT INTO seasons (id, name, start_date, end_date, daily_price, is_default, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, id, req.Name, req.StartDate, req.EndDate, req.DailyPrice, req.IsDefault, now, now)

	if err != nil {
		return nil, err
	}

	return GetSeasonByID(id)
}

// UpdateSeason updates an existing season
func UpdateSeason(id string, req models.UpdateSeasonRequest) (*models.Season, error) {
	_, err := database.DB.Exec(`
		UPDATE seasons
		SET name = $1, start_date = $2, end_date = $3, daily_price = $4, is_default = $5, updated_at = $6
		WHERE id = $7
	`, req.Name, req.StartDate, req.EndDate, req.DailyPrice, req.IsDefault, time.Now(), id)

	if err != nil {
		return nil, err
	}

	return GetSeasonByID(id)
}

// DeleteSeason deletes a season
func DeleteSeason(id string) error {
	_, err := database.DB.Exec("DELETE FROM seasons WHERE id = $1", id)
	return err
}
