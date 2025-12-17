package database

import (
	"log"
)

// RunMigrations creates all necessary database tables
func RunMigrations() error {
	migrations := []string{
		// Properties table
		`CREATE TABLE IF NOT EXISTS properties (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			tagline VARCHAR(500),
			description TEXT,
			location VARCHAR(255),
			image_url TEXT,
			images TEXT[],
			amenities TEXT[],
			max_guests INTEGER DEFAULT 6,
			bedrooms INTEGER DEFAULT 3,
			bathrooms INTEGER DEFAULT 2,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Seasons table
		`CREATE TABLE IF NOT EXISTS seasons (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(100) NOT NULL,
			start_date VARCHAR(5) NOT NULL,
			end_date VARCHAR(5) NOT NULL,
			daily_price DECIMAL(10,2) NOT NULL,
			is_default BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Bedroom configs table
		`CREATE TABLE IF NOT EXISTS bedroom_configs (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(100) NOT NULL,
			description TEXT,
			price_add DECIMAL(10,2) DEFAULT 0,
			max_guests INTEGER DEFAULT 2,
			is_default BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Enquiries table
		`CREATE TABLE IF NOT EXISTS enquiries (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			property_id UUID REFERENCES properties(id),
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			phone VARCHAR(50),
			check_in DATE NOT NULL,
			check_out DATE NOT NULL,
			guests INTEGER DEFAULT 1,
			bedroom_config_id UUID REFERENCES bedroom_configs(id),
			message TEXT,
			total_price DECIMAL(10,2),
			status VARCHAR(20) DEFAULT 'pending',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Blocked dates table
		`CREATE TABLE IF NOT EXISTS blocked_dates (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			property_id UUID REFERENCES properties(id),
			date DATE NOT NULL,
			source VARCHAR(50),
			event_uid VARCHAR(255),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(property_id, date)
		)`,

		// iCal URLs table
		`CREATE TABLE IF NOT EXISTS ical_urls (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			property_id UUID REFERENCES properties(id),
			url TEXT NOT NULL,
			source VARCHAR(50),
			last_sync TIMESTAMP,
			status VARCHAR(20) DEFAULT 'active',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, migration := range migrations {
		_, err := DB.Exec(migration)
		if err != nil {
			log.Printf("Migration error: %v\nQuery: %s", err, migration)
			return err
		}
	}

	log.Println("Database migrations completed successfully")
	return nil
}

// SeedData seeds the database with initial data
func SeedData() error {
	// Check if property exists
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM properties").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Println("Data already seeded, skipping...")
		return nil
	}

	// Insert default property
	_, err = DB.Exec(`
		INSERT INTO properties (name, tagline, description, location, image_url, images, amenities, max_guests, bedrooms, bathrooms)
		VALUES (
			'Villa Arama Riverside',
			'Luxury Riverside Retreat in Bali',
			'Experience tranquility at Villa Arama Riverside, a stunning luxury villa nestled along the banks of a pristine river in Bali. This exclusive retreat offers an unparalleled blend of traditional Balinese architecture and modern luxury amenities. Wake up to the gentle sounds of flowing water, enjoy breathtaking views from your private terrace, and immerse yourself in the natural beauty that surrounds this exceptional property.',
			'Ubud, Bali, Indonesia',
			'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
			ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
			ARRAY['Private Pool', 'River View', 'Air Conditioning', 'Free WiFi', 'Full Kitchen', 'Daily Housekeeping', 'Garden', 'BBQ Area', 'Yoga Deck', 'Parking'],
			8,
			3,
			3
		)
	`)
	if err != nil {
		return err
	}

	// Insert default seasons
	seasons := []struct {
		name       string
		startDate  string
		endDate    string
		dailyPrice float64
		isDefault  bool
	}{
		{"Peak Season", "12-15", "01-10", 350, false},
		{"High Season", "07-01", "08-31", 280, false},
		{"Regular Season", "01-01", "12-31", 200, true},
	}

	for _, s := range seasons {
		_, err = DB.Exec(`
			INSERT INTO seasons (name, start_date, end_date, daily_price, is_default)
			VALUES ($1, $2, $3, $4, $5)
		`, s.name, s.startDate, s.endDate, s.dailyPrice, s.isDefault)
		if err != nil {
			return err
		}
	}

	// Insert default bedroom configs
	configs := []struct {
		name        string
		description string
		priceAdd    float64
		maxGuests   int
		isDefault   bool
	}{
		{"1 Bedroom Suite", "Cozy suite with one master bedroom", 0, 2, true},
		{"2 Bedroom Villa", "Spacious villa with two bedrooms", 75, 4, false},
		{"3 Bedroom Estate", "Full estate with three bedrooms", 150, 8, false},
	}

	for _, c := range configs {
		_, err = DB.Exec(`
			INSERT INTO bedroom_configs (name, description, price_add, max_guests, is_default)
			VALUES ($1, $2, $3, $4, $5)
		`, c.name, c.description, c.priceAdd, c.maxGuests, c.isDefault)
		if err != nil {
			return err
		}
	}

	log.Println("Data seeded successfully")
	return nil
}
