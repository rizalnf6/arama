package services

import (
	"fmt"
	"net/smtp"
	"os"
)

// EmailConfig holds SMTP configuration
type EmailConfig struct {
	Host     string
	Port     string
	Username string
	Password string
}

// SendEnquiryNotification sends an email notification for a new enquiry
func SendEnquiryNotification(name, email, phone, checkIn, checkOut, message string, guests int, totalPrice float64) error {
	config := EmailConfig{
		Host:     os.Getenv("SMTP_HOST"),
		Port:     os.Getenv("SMTP_PORT"),
		Username: os.Getenv("SMTP_USERNAME"),
		Password: os.Getenv("SMTP_PASSWORD"),
	}

	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = config.Username
	}

	// Skip if SMTP not configured
	if config.Host == "" || config.Username == "" {
		fmt.Println("SMTP not configured, skipping email notification")
		return nil
	}

	subject := fmt.Sprintf("New Booking Enquiry from %s", name)
	body := fmt.Sprintf(`
New Booking Enquiry for Villa Arama Riverside

Guest Information:
- Name: %s
- Email: %s
- Phone: %s

Booking Details:
- Check-in: %s
- Check-out: %s
- Guests: %d
- Estimated Total: $%.2f

Message:
%s

---
This is an automated message from Villa Arama Riverside booking system.
`, name, email, phone, checkIn, checkOut, guests, totalPrice, message)

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		config.Username, adminEmail, subject, body)

	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)

	err := smtp.SendMail(addr, auth, config.Username, []string{adminEmail}, []byte(msg))
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
