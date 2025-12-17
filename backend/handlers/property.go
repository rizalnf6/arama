package handlers

import (
	"time"
	"villa-arama-riverside/repository"
	"villa-arama-riverside/services"

	"github.com/gofiber/fiber/v2"
)

// GetProperties returns all properties
func GetProperties(c *fiber.Ctx) error {
	properties, err := repository.GetAllProperties()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch properties"})
	}

	return c.JSON(properties)
}

// GetProperty returns a single property by ID
func GetProperty(c *fiber.Ctx) error {
	id := c.Params("id")
	property, err := repository.GetPropertyByID(id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch property"})
	}

	if property == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Property not found"})
	}

	return c.JSON(property)
}

// GetPropertyPricing returns pricing for a property
func GetPropertyPricing(c *fiber.Ctx) error {
	id := c.Params("id")
	dateStr := c.Query("date")
	checkInStr := c.Query("check_in")
	checkOutStr := c.Query("check_out")
	bedroomConfigID := c.Query("bedroom_config_id")

	// If date range is provided, calculate total
	if checkInStr != "" && checkOutStr != "" {
		checkIn, err := time.Parse("2006-01-02", checkInStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid check_in date format"})
		}

		checkOut, err := time.Parse("2006-01-02", checkOutStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid check_out date format"})
		}

		totalPrice, breakdown, err := services.CalculatePricing(id, checkIn, checkOut, bedroomConfigID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to calculate pricing"})
		}

		return c.JSON(fiber.Map{
			"property_id": id,
			"check_in":    checkInStr,
			"check_out":   checkOutStr,
			"nights":      len(breakdown),
			"total_price": totalPrice,
			"breakdown":   breakdown,
		})
	}

	// Single date pricing
	date := time.Now()
	if dateStr != "" {
		var err error
		date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid date format"})
		}
	}

	pricing, err := services.GetPricingForDate(id, date, bedroomConfigID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get pricing"})
	}

	return c.JSON(pricing)
}

// GetPropertyAvailability returns blocked dates for a property
func GetPropertyAvailability(c *fiber.Ctx) error {
	id := c.Params("id")

	blockedDates, err := repository.GetBlockedDates(id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch availability"})
	}

	// Extract just the dates
	var dates []string
	for _, bd := range blockedDates {
		dates = append(dates, bd.Date)
	}

	return c.JSON(fiber.Map{
		"property_id":   id,
		"blocked_dates": dates,
	})
}
