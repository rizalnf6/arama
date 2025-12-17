package handlers

import (
	"villa-arama-riverside/models"
	"villa-arama-riverside/repository"

	"github.com/gofiber/fiber/v2"
)

// GetSeasons returns all seasons
func GetSeasons(c *fiber.Ctx) error {
	seasons, err := repository.GetAllSeasons()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch seasons"})
	}

	return c.JSON(seasons)
}

// CreateSeason creates a new season
func CreateSeason(c *fiber.Ctx) error {
	var req models.CreateSeasonRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" || req.StartDate == "" || req.EndDate == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Name, start_date, and end_date are required"})
	}

	season, err := repository.CreateSeason(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create season"})
	}

	return c.Status(201).JSON(season)
}

// UpdateSeason updates an existing season
func UpdateSeason(c *fiber.Ctx) error {
	id := c.Params("id")

	var req models.UpdateSeasonRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	season, err := repository.UpdateSeason(id, req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update season"})
	}

	if season == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Season not found"})
	}

	return c.JSON(season)
}

// DeleteSeason deletes a season
func DeleteSeason(c *fiber.Ctx) error {
	id := c.Params("id")

	if err := repository.DeleteSeason(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete season"})
	}

	return c.JSON(fiber.Map{"message": "Season deleted successfully"})
}
