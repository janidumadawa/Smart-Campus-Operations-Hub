# 🎓 Smart Campus Operations Hub

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive campus management system for SLIIT that streamlines facility bookings, incident ticketing, and resource management with role-based access control.

![CampusFlow Banner](./frontend/public/weblogo2.png)

---

## Features

### Authentication & Authorization
- **JWT-based authentication** with Spring Security
- **OAuth2 ready** (Google sign-in)
- **Role-based access control** (Admin, Technician, User)
- Secure endpoints with token validation

### Resource Booking System
- Browse and search available facilities (halls, labs, equipment)
- **Real-time availability checking**
- **Conflict detection** for overlapping bookings
- Booking workflow: PENDING → APPROVED/REJECTED → CANCELLED
- Admin dashboard for managing all bookings
- **PDF export** for booking reports

### Incident Ticketing
- Create tickets with category, priority, and attachments (up to 3 images)
- **SLA tracking** with response/resolution timers
- Technician assignment and status updates
- Comment system with edit/delete permissions
- Activity timeline for full ticket history

### Resource Management
- Complete CRUD operations for campus resources
- Image upload with **Cloudinary integration**
- Filter by type, location, capacity, and status
- Role-based permissions (Admin: full access, Technician: view-only)

### Advanced Analytics
- Real-time dashboard with key metrics
- Resource usage analytics with visual charts
- **PDF report generation** for:
  - Booking reports
  - Ticket reports
  - Resource inventory
  - User management reports

### Notification System
- Real-time notifications for booking/ticket updates
- Notification preferences per user
- Mark as read/unread
- Email notification support

### User Management
- View all registered users with role distribution
- Active/inactive status tracking
- **PDF export** of user directory
- Provider tracking (Email/Google)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.2.5, Java 17 |
| **Security** | Spring Security, JWT |
| **Database** | MongoDB Atlas |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **State Management** | React Context API, TanStack Query |
| **Image Storage** | Cloudinary |
| **PDF Generation** | jsPDF |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
