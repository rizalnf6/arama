package handlers

import (
	"villa-arama-riverside/models"
	"villa-arama-riverside/repository"
	"villa-arama-riverside/services"

	"github.com/gofiber/fiber/v2"
)

// GetICalURLs returns all iCal URLs
func GetICalURLs(c *fiber.Ctx) error {
	urls, err := repository.GetAllICalURLs()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch iCal URLs"})
	}

	return c.JSON(urls)
}

// AddICalURL adds a new iCal URL
func AddICalURL(c *fiber.Ctx) error {
	var req models.CreateICalURLRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.URL == "" || req.PropertyID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "URL and property_id are required"})
	}

	icalURL, err := repository.CreateICalURL(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add iCal URL"})
	}

	// Trigger initial sync
	go services.SyncICalFeed(icalURL.ID, req.PropertyID, req.URL, req.Source)

	return c.Status(201).JSON(icalURL)
}

// DeleteICalURL deletes an iCal URL
func DeleteICalURL(c *fiber.Ctx) error {
	id := c.Params("id")

	if err := repository.DeleteICalURL(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete iCal URL"})
	}

	return c.JSON(fiber.Map{"message": "iCal URL deleted successfully"})
}

// SyncICalFeeds triggers a sync of all iCal feeds
func SyncICalFeeds(c *fiber.Ctx) error {
	urls, err := repository.GetAllICalURLs()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch iCal URLs"})
	}

	syncCount := 0
	for _, url := range urls {
		go services.SyncICalFeed(url.ID, url.PropertyID, url.URL, url.Source)
		syncCount++
	}

	return c.JSON(fiber.Map{
		"message": "Sync triggered",
		"count":   syncCount,
	})
}
