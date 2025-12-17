package services

import (
	"time"
	"villa-arama-riverside/models"
	"villa-arama-riverside/repository"
)

// CalculatePricing calculates the total price for a date range
func CalculatePricing(propertyID string, checkIn, checkOut time.Time, bedroomConfigID string) (float64, []models.PropertyPricing, error) {
	var totalPrice float64
	var pricingBreakdown []models.PropertyPricing

	// Get bedroom config
	var bedroomConfig *models.BedroomConfig
	var err error
	if bedroomConfigID != "" {
		bedroomConfig, err = repository.GetBedroomConfigByID(bedroomConfigID)
	} else {
		bedroomConfig, err = repository.GetDefaultBedroomConfig()
	}
	if err != nil {
		return 0, nil, err
	}

	bedroomPriceAdd := float64(0)
	bedroomName := ""
	if bedroomConfig != nil {
		bedroomPriceAdd = bedroomConfig.PriceAdd
		bedroomName = bedroomConfig.Name
	}

	// Calculate price for each night
	current := checkIn
	for current.Before(checkOut) {
		season, err := repository.GetSeasonForDate(current)
		if err != nil {
			return 0, nil, err
		}

		dailyPrice := float64(200) // Default price
		seasonName := "Regular Season"
		if season != nil {
			dailyPrice = season.DailyPrice
			seasonName = season.Name
		}

		nightTotal := dailyPrice + bedroomPriceAdd
		totalPrice += nightTotal

		pricingBreakdown = append(pricingBreakdown, models.PropertyPricing{
			PropertyID:       propertyID,
			Date:             current.Format("2006-01-02"),
			SeasonName:       seasonName,
			SeasonDailyPrice: dailyPrice,
			BedroomConfigID:  bedroomConfigID,
			BedroomName:      bedroomName,
			BedroomPriceAdd:  bedroomPriceAdd,
			TotalPrice:       nightTotal,
		})

		current = current.AddDate(0, 0, 1)
	}

	return totalPrice, pricingBreakdown, nil
}

// GetPricingForDate returns the pricing for a specific date
func GetPricingForDate(propertyID string, date time.Time, bedroomConfigID string) (*models.PropertyPricing, error) {
	season, err := repository.GetSeasonForDate(date)
	if err != nil {
		return nil, err
	}

	dailyPrice := float64(200)
	seasonName := "Regular Season"
	if season != nil {
		dailyPrice = season.DailyPrice
		seasonName = season.Name
	}

	var bedroomConfig *models.BedroomConfig
	if bedroomConfigID != "" {
		bedroomConfig, err = repository.GetBedroomConfigByID(bedroomConfigID)
	} else {
		bedroomConfig, err = repository.GetDefaultBedroomConfig()
	}
	if err != nil {
		return nil, err
	}

	bedroomPriceAdd := float64(0)
	bedroomName := ""
	if bedroomConfig != nil {
		bedroomPriceAdd = bedroomConfig.PriceAdd
		bedroomName = bedroomConfig.Name
		bedroomConfigID = bedroomConfig.ID
	}

	return &models.PropertyPricing{
		PropertyID:       propertyID,
		Date:             date.Format("2006-01-02"),
		SeasonName:       seasonName,
		SeasonDailyPrice: dailyPrice,
		BedroomConfigID:  bedroomConfigID,
		BedroomName:      bedroomName,
		BedroomPriceAdd:  bedroomPriceAdd,
		TotalPrice:       dailyPrice + bedroomPriceAdd,
	}, nil
}
