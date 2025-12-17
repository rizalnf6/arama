package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"villa-arama-riverside/database"
	"villa-arama-riverside/handlers"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Seed default data
	if err := database.SeedData(); err != nil {
		log.Printf("Warning: Failed to seed data: %v", err)
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Villa Arama Riverside API",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// API Routes
	api := app.Group("/api")

	// Public routes
	api.Get("/properties", handlers.GetProperties)
	api.Get("/properties/:id", handlers.GetProperty)
	api.Get("/properties/:id/pricing", handlers.GetPropertyPricing)
	api.Get("/properties/:id/availability", handlers.GetPropertyAvailability)
	api.Post("/enquiries", handlers.CreateEnquiry)

	// Admin routes
	admin := api.Group("/admin")

	// Seasons
	admin.Get("/seasons", handlers.GetSeasons)
	admin.Post("/seasons", handlers.CreateSeason)
	admin.Put("/seasons/:id", handlers.UpdateSeason)
	admin.Delete("/seasons/:id", handlers.DeleteSeason)

	// Bedroom Configs
	admin.Get("/bedroom-configs", handlers.GetBedroomConfigs)
	admin.Post("/bedroom-configs", handlers.CreateBedroomConfig)
	admin.Put("/bedroom-configs/:id", handlers.UpdateBedroomConfig)
	admin.Delete("/bedroom-configs/:id", handlers.DeleteBedroomConfig)

	// Enquiries
	admin.Get("/enquiries", handlers.GetEnquiries)
	admin.Get("/enquiries/export", handlers.ExportEnquiries)
	admin.Put("/enquiries/:id/status", handlers.UpdateEnquiryStatus)

	// iCal
	admin.Get("/ical", handlers.GetICalURLs)
	admin.Post("/ical", handlers.AddICalURL)
	admin.Delete("/ical/:id", handlers.DeleteICalURL)
	admin.Post("/ical/sync", handlers.SyncICalFeeds)

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
