# 🏡 Villa Rental Platform Template

A modern, production-ready **daily rental platform** for villas and vacation properties. Features dynamic seasonal pricing, iCal calendar sync, enquiry management, and a full admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Go](https://img.shields.io/badge/Go-1.21-00ADD8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)

---

## ✨ Features

| Feature                      | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| 🎯 **Single Property Focus** | Optimized for showcasing one premium property      |
| 💰 **Dynamic Pricing**       | Seasonal rates + bedroom configuration pricing     |
| 📅 **iCal Sync**             | Import availability from Airbnb, Booking.com, VRBO |
| 📧 **Enquiry System**        | Booking requests with Gmail SMTP forwarding        |
| 🔧 **Admin Dashboard**       | Manage pricing, seasons, calendar, and enquiries   |
| 📱 **Responsive Design**     | Beautiful on desktop, tablet, and mobile           |
| 🎨 **Modern UI**             | Tailwind CSS + Framer Motion animations            |

---

## 🏗️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND                                               │
│  Next.js 14 (App Router) • TypeScript • Tailwind CSS   │
│  Framer Motion • React Hook Form                        │
├─────────────────────────────────────────────────────────┤
│  BACKEND                                                │
│  Go 1.21 • Fiber Framework • PostgreSQL                 │
│  Gmail SMTP • iCal Parser                               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
villa-template-tuju/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   │   ├── admin/        # Admin Dashboard Pages
│   │   │   └── page.tsx      # Public Homepage
│   │   ├── components/       # Reusable React Components
│   │   └── lib/              # API Client & Utilities
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                  # Go API Server
│   ├── handlers/             # HTTP Route Handlers
│   ├── services/             # Business Logic Layer
│   ├── repository/           # Database Access Layer
│   ├── models/               # Data Models & Types
│   ├── database/             # SQL Migrations
│   └── main.go               # Application Entry Point
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Go** 1.21+
- **PostgreSQL** 14+

### 1. Clone & Setup Database

```bash
# Clone the repository
git clone https://github.com/your-username/villa-template-tuju.git
cd villa-template-tuju

# Create PostgreSQL database
createdb villa_rental
```

### 2. Backend Setup

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies and run
go mod download
go run main.go
```

✅ Backend runs at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend runs at `http://localhost:3000`

---

## 💰 Pricing Model

The platform uses a **dynamic seasonal pricing** formula:

```
Total Price = (Season Daily Price + Bedroom Add-on) × Number of Nights
```

### Example Configuration

| Season     | Date Range      | Daily Price |
| ---------- | --------------- | ----------- |
| 🔥 Peak    | Dec 15 - Jan 15 | $350        |
| 📈 High    | Jul 1 - Aug 31  | $280        |
| 📊 Regular | All other dates | $200        |

| Bedroom Config | Price Addition |
| -------------- | -------------- |
| 1 Bedroom      | +$0            |
| 2 Bedrooms     | +$75           |
| 3 Bedrooms     | +$150          |

**Example**: Peak Season + 3 Bedrooms = $350 + $150 = **$500/night**

---

## 🔌 API Reference

### Public Endpoints

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| `GET`  | `/api/properties`                  | List all properties    |
| `GET`  | `/api/properties/:id/pricing`      | Get dynamic pricing    |
| `GET`  | `/api/properties/:id/availability` | Get blocked dates      |
| `POST` | `/api/enquiries`                   | Submit booking enquiry |

### Admin Endpoints

| Method   | Endpoint                      | Description    |
| -------- | ----------------------------- | -------------- |
| `GET`    | `/api/admin/seasons`          | List seasons   |
| `POST`   | `/api/admin/seasons`          | Create season  |
| `PUT`    | `/api/admin/seasons/:id`      | Update season  |
| `DELETE` | `/api/admin/seasons/:id`      | Delete season  |
| `GET`    | `/api/admin/enquiries`        | List enquiries |
| `GET`    | `/api/admin/enquiries/export` | Export CSV     |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/villa_rental?sslmode=disable
PORT=3001

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin notification
ADMIN_EMAIL=admin@yourdomain.com
```

> 💡 **Tip**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

---

## 📱 Pages & Routes

### Public Pages

- `/` — Homepage with property details, pricing, and booking form

### Admin Dashboard

- `/admin` — Dashboard overview
- `/admin/seasons` — Manage seasonal pricing
- `/admin/bedroom-configs` — Manage bedroom options
- `/admin/calendar` — iCal sync management
- `/admin/enquiries` — View & export booking enquiries

---

## 🛠️ Development Commands

```bash
# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Lint code

# Backend
cd backend
go run main.go       # Development server
go build -o api      # Production build
go test ./...        # Run tests
```

---

## � Push to GitHub

Follow these steps to push **both frontend and backend** to GitHub:

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `villa-rental-platform`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)

### Step 2: Initialize & Push

Run these commands from the **project root** (`villa-template-tuju/`):

```bash
# Navigate to project root
cd villa-template-tuju

# Initialize git repository (skip if already initialized)
git init

# Add ALL files (frontend + backend + root files)
git add .

# Verify what will be committed (should show both frontend/ and backend/)
git status

# Commit all files
git commit -m "Initial commit: Villa rental platform with frontend and backend"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/villa-rental-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### What Gets Pushed

```
villa-template-tuju/           ✅ Pushed
├── frontend/                  ✅ Pushed (Next.js app)
│   ├── src/                   ✅
│   ├── package.json           ✅
│   └── node_modules/          ❌ Ignored by .gitignore
├── backend/                   ✅ Pushed (Go API)
│   ├── handlers/              ✅
│   ├── main.go                ✅
│   └── .env                   ❌ Ignored by .gitignore
├── .gitignore                 ✅ Pushed
└── README.md                  ✅ Pushed
```

### Updating After Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: seasonal pricing admin"

# Push to GitHub
git push
```

> ⚠️ **Important**: The `.gitignore` file excludes `node_modules/`, `.env`, and build artifacts. Your sensitive credentials stay local!

---

## �🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

### Backend (Docker)

```dockerfile
FROM golang:1.21-alpine
WORKDIR /app
COPY . .
RUN go build -o api main.go
EXPOSE 3001
CMD ["./api"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — Free to use for personal and commercial projects.

---

<p align="center">
  Made with ❤️ for villa owners and property managers
</p>
