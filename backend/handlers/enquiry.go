package handlers

import (
	"encoding/csv"
	"fmt"
	"time"
	"villa-arama-riverside/models"
	"villa-arama-riverside/repository"
	"villa-arama-riverside/services"

	"github.com/gofiber/fiber/v2"
)

// CreateEnquiry creates a new booking enquiry
func CreateEnquiry(c *fiber.Ctx) error {
	var req models.CreateEnquiryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate required fields
	if req.Name == "" || req.Email == "" || req.CheckIn == "" || req.CheckOut == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Name, email, check_in, and check_out are required"})
	}

	// Parse dates
	checkIn, err := time.Parse("2006-01-02", req.CheckIn)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid check_in date format"})
	}

	checkOut, err := time.Parse("2006-01-02", req.CheckOut)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid check_out date format"})
	}

	// Calculate total price
	totalPrice, _, err := services.CalculatePricing(req.PropertyID, checkIn, checkOut, req.BedroomConfigID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to calculate pricing"})
	}

	// Create enquiry
	enquiry, err := repository.CreateEnquiry(req, totalPrice)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create enquiry"})
	}

	// Send email notification (non-blocking)
	go func() {
		if err := services.SendEnquiryNotification(
			req.Name, req.Email, req.Phone,
			req.CheckIn, req.CheckOut, req.Message,
			req.Guests, totalPrice,
		); err != nil {
			fmt.Printf("Failed to send email notification: %v\n", err)
		}
	}()

	return c.Status(201).JSON(enquiry)
}

// GetEnquiries returns all enquiries
func GetEnquiries(c *fiber.Ctx) error {
	enquiries, err := repository.GetAllEnquiries()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch enquiries"})
	}

	return c.JSON(enquiries)
}

// UpdateEnquiryStatus updates the status of an enquiry
func UpdateEnquiryStatus(c *fiber.Ctx) error {
	id := c.Params("id")

	var req models.UpdateEnquiryStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	validStatuses := map[string]bool{"pending": true, "confirmed": true, "cancelled": true}
	if !validStatuses[req.Status] {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid status. Must be pending, confirmed, or cancelled"})
	}

	enquiry, err := repository.UpdateEnquiryStatus(id, req.Status)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update enquiry status"})
	}

	if enquiry == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Enquiry not found"})
	}

	return c.JSON(enquiry)
}

// ExportEnquiries exports enquiries as CSV
func ExportEnquiries(c *fiber.Ctx) error {
	enquiries, err := repository.GetAllEnquiries()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch enquiries"})
	}

	c.Set("Content-Type", "text/csv")
	c.Set("Content-Disposition", "attachment; filename=enquiries.csv")

	writer := csv.NewWriter(c.Response().BodyWriter())

	// Write header
	writer.Write([]string{"ID", "Name", "Email", "Phone", "Check-In", "Check-Out", "Guests", "Total Price", "Status", "Created At"})

	// Write rows
	for _, e := range enquiries {
		writer.Write([]string{
			e.ID,
			e.Name,
			e.Email,
			e.Phone,
			e.CheckIn,
			e.CheckOut,
			fmt.Sprintf("%d", e.Guests),
			fmt.Sprintf("%.2f", e.TotalPrice),
			e.Status,
			e.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	writer.Flush()
	return nil
}
