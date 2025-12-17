package handlers

import (
	"villa-arama-riverside/models"
	"villa-arama-riverside/repository"

	"github.com/gofiber/fiber/v2"
)

// GetBedroomConfigs returns all bedroom configurations
func GetBedroomConfigs(c *fiber.Ctx) error {
	configs, err := repository.GetAllBedroomConfigs()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch bedroom configs"})
	}

	return c.JSON(configs)
}

// CreateBedroomConfig creates a new bedroom configuration
func CreateBedroomConfig(c *fiber.Ctx) error {
	var req models.CreateBedroomConfigRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Name is required"})
	}

	config, err := repository.CreateBedroomConfig(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create bedroom config"})
	}

	return c.Status(201).JSON(config)
}

// UpdateBedroomConfig updates an existing bedroom configuration
func UpdateBedroomConfig(c *fiber.Ctx) error {
	id := c.Params("id")

	var req models.UpdateBedroomConfigRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	config, err := repository.UpdateBedroomConfig(id, req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update bedroom config"})
	}

	if config == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Bedroom config not found"})
	}

	return c.JSON(config)
}

// DeleteBedroomConfig deletes a bedroom configuration
func DeleteBedroomConfig(c *fiber.Ctx) error {
	id := c.Params("id")

	if err := repository.DeleteBedroomConfig(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete bedroom config"})
	}

	return c.JSON(fiber.Map{"message": "Bedroom config deleted successfully"})
}
