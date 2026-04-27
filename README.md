# 🎓 Smart Campus Operations Hub

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive campus management system for SLIIT that streamlines facility bookings, incident ticketing, and resource management with role-based access control.

![CampusFlow Banner](./frontend/public/weblogo2.png)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with Spring Security
- Google OAuth2 sign-in
- Role-based access control (Admin, Technician, User)
- Secure endpoints with token validation

### 🏢 Resource Booking System
- Browse and search available facilities (halls, labs, equipment)
- Real-time availability checking
- Conflict detection for overlapping bookings
- Booking workflow: PENDING → APPROVED/REJECTED → CANCELLED
- Admin dashboard for managing all bookings
- PDF export for booking reports

### 🎫 Incident Ticketing
- Create tickets with category, priority, and attachments (up to 3 images)
- SLA tracking with response/resolution timers
- Technician assignment and status updates
- Comment system with edit/delete permissions
- Activity timeline for full ticket history

### 📦 Resource Management
- Complete CRUD operations for campus resources
- Image upload with Cloudinary integration
- Filter by type, location, capacity, and status
- Role-based permissions (Admin: full access, Technician: view-only)

### 📊 Advanced Analytics
- Real-time dashboard with key metrics
- Resource usage analytics with visual charts
- PDF report generation for bookings, tickets, resources, and users

### 🔔 Notification System
- Real-time notifications for booking/ticket updates
- Notification preferences per user
- Mark as read/unread
- Email notification support

### 👥 User Management
- View all registered users with role distribution
- Active/inactive status tracking
- PDF export of user directory
- Provider tracking (Email/Google)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.2.5, Java 17 |
| **Security** | Spring Security, JWT, Bcrypt |
| **Database** | MongoDB Atlas |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **State Management** | React Context API, TanStack Query |
| **Image Storage** | Cloudinary |
| **PDF Generation** | jsPDF |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |

---

## 🚀 Run Locally

### Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Node.js | 22+ |
| MongoDB Atlas | Cloud account |
| Cloudinary | Cloud account |

### Clone the Project

```bash
git clone https://github.com/janidumadawa/Smart-Campus-Operations-Hub.git
cd Smart-Campus-Operations-Hub
```

### Backend Setup

```bash
cd backend
```

Create `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

Start backend:

```bash
# Windows
mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8081`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
Smart-Campus-Operations-Hub/
├── backend/
│   ├── src/main/java/backend/
│   │   ├── config/          # Security & CORS config
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # MongoDB entities
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # JWT utilities
│   │   └── service/         # Business logic
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios & API calls
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth & state management
│   │   └── pages/           # Application pages
│   └── package.json
│
└── README.md
```

---


**By PAF Group Y3S2-WE-49**
