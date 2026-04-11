# 🔔 Notification Module - Smart Campus Operations Hub

## JANIDU's Contribution to Module D

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Implementation Details](#implementation-details)
4. [API Reference](#api-reference)
5. [File Guide](#file-guide)
6. [Testing](#testing)
7. [Integration](#integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The **Notification Module** provides a complete notification system for the Smart Campus Operations Hub. It enables real-time notifications for:

- 📅 **Booking Events**: Approval, rejection, cancellation
- 🔧 **Ticket Updates**: Creation, assignment, status changes, resolution
- 💬 **Comments**: New comments and replies
- ⚙️ **System Events**: General hub notifications

### Key Features

✅ **Real-time Notifications** - Updates every 30 seconds  
✅ **User Preferences** - Enable/disable by category  
✅ **Email Support** - Optional email delivery  
✅ **Notification History** - View all past notifications  
✅ **Mark as Read** - Track notification status  
✅ **Responsive UI** - Works on all devices  
✅ **11 REST Endpoints** - Full API coverage  

---

## Quick Start

### 1. Prerequisites

- Java 17+
- Node.js 18+
- MongoDB (local or remote)
- Maven 3.8+

### 2. Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

✓ Backend runs on `http://localhost:8081`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

✓ Frontend runs on `http://localhost:5173`

### 4. Verify Installation

1. Open `http://localhost:5173` in browser
2. Login with your credentials
3. Look for the bell 🔔 icon in navbar
4. Click to see notifications panel

---

## Implementation Details

### Backend Architecture

```
NotificationController (REST API)
    ↓
NotificationService (Business Logic)
    ↓
[Notification | NotificationPreference] ← MongoDB
    ↓
[NotificationRepository | NotificationPreferenceRepository]
```

### Key Components

#### 1. Models
- `Notification.java` - Main notification entity
- `NotificationPreference.java` - User settings

#### 2. Service Layer
- `NotificationService.java` - Interface
- `NotificationServiceImpl.java` - Implementation
- `NotificationHelper.java` - Trigger helper

#### 3. REST Controller
- `NotificationController.java` - 11 endpoints

#### 4. Repositories
- `NotificationRepository.java` - Notification queries
- `NotificationPreferenceRepository.java` - Preference queries

### Frontend Architecture

```
Navbar (with bell icon)
├── NotificationPanel (side panel)
│   └── Shows unread notifications
├── NotificationHistoryPage (/notifications)
│   └── Full history with filters
└── NotificationPreferencesPage (/notification-preferences)
    └── Customization settings
```

---

## API Reference

### Base URL
```
http://localhost:8081/api/notifications
```

### Notification Endpoints

#### Get Notifications
```bash
GET /api/notifications/{userId}?page=0&size=10
GET /api/notifications/{userId}/count
GET /api/notifications/{userId}/unread
GET /api/notifications/{userId}/category/{category}
GET /api/notifications/detail/{notificationId}
```

#### Update Notifications
```bash
PUT /api/notifications/{notificationId}/mark-as-read
PUT /api/notifications/{notificationId}/mark-as-unread
PUT /api/notifications/{userId}/mark-all-as-read
```

#### Delete Notifications
```bash
DELETE /api/notifications/{notificationId}
```

### Preference Endpoints

```bash
GET /api/notifications/preferences/{userId}
POST /api/notifications/preferences/{userId}
```

**See `NOTIFICATION_API_DOCUMENTATION.md` for complete reference with examples**

---

## File Guide

### 📁 Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `NotificationType.java` | Defines 11 notification types | 20 |
| `NotificationCategory.java` | Defines 3 categories | 10 |
| `Notification.java` | Main model | 180 |
| `NotificationPreference.java` | Preferences model | 100 |
| `NotificationRepository.java` | Notification repository | 50 |
| `NotificationPreferenceRepository.java` | Preference repository | 20 |
| `NotificationService.java` | Service interface | 60 |
| `NotificationServiceImpl.java` | Service implementation | 260 |
| `NotificationHelper.java` | Trigger helper | 150 |
| `NotificationController.java` | REST endpoints | 350 |
| `NotificationServiceTests.java` | Unit tests | 200 |
| `IntegrationExamples.java` | Integration patterns | 150 |

### 📁 Frontend Files

| File | Purpose | Lines |
|------|---------|-------|
| `NotificationPanel.jsx` | Side notification panel | 250 |
| `NotificationHistoryPage.jsx` | History page | 320 |
| `NotificationPreferencesPage.jsx` | Preferences page | 280 |
| `Navbar.jsx` | Updated navbar | +50 |
| `App.jsx` | Updated routes | +5 |

### 📁 Documentation Files

| File | Purpose |
|------|---------|
| `NOTIFICATION_API_DOCUMENTATION.md` | Complete API reference |
| `JANIDU_NOTIFICATION_MODULE_GUIDE.md` | Implementation guide |
| `NOTIFICATION_ARCHITECTURE_DIAGRAM.md` | Architecture & flows |
| `QUICK_START_NOTIFICATIONS.sh` | Quick start script |
| `TESTING_CHECKLIST.md` | Testing checklist |
| `IMPLEMENTATION_SUMMARY.md` | Summary & statistics |
| `COMPLETE_FILE_INVENTORY.md` | File inventory |

---

## Testing

### Unit Tests
```bash
./mvnw test -Dtest=NotificationServiceTests
```

### Manual Testing
1. **Create Booking** → See notification approval
2. **Create Ticket** → See notification creation
3. **Mark as Read** → Badge count updates
4. **Visit History** → All notifications displayed
5. **Change Preferences** → Settings persist

### API Testing with cURL

```bash
# Get unread count
curl http://localhost:8081/api/notifications/{userId}/count

# Mark as read
curl -X PUT http://localhost:8081/api/notifications/{notificationId}/mark-as-read

# Get preferences
curl http://localhost:8081/api/notifications/preferences/{userId}

# Save preferences
curl -X POST http://localhost:8081/api/notifications/preferences/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "bookingAlerts": true,
    "ticketUpdates": false,
    "emailNotifications": true,
    "commentNotifications": true
  }'
```

**See `TESTING_CHECKLIST.md` for comprehensive testing guide**

---

## Integration

### From BookingService

```java
@Autowired
private NotificationHelper notificationHelper;

// When booking is approved
notificationHelper.triggerBookingApproved(userId, bookingId, resourceName);

// When booking is rejected
notificationHelper.triggerBookingRejected(userId, bookingId, resourceName, reason);
```

### From TicketService

```java
// When ticket is created
notificationHelper.triggerTicketCreated(userId, ticketId, category);

// When ticket status changes
notificationHelper.triggerTicketInProgress(userId, ticketId);
notificationHelper.triggerTicketResolved(userId, ticketId, notes);
```

### From CommentService

```java
// When comment is added
notificationHelper.triggerCommentAdded(userId, ticketId, commenterName, "TICKET");
```

**See `IntegrationExamples.java` for detailed code examples**

---

## Configuration

### Environment Variables (Optional - for email)

```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### For Gmail:
1. Enable 2-Factor Authentication
2. Go to https://myaccount.google.com/apppasswords
3. Create App Password
4. Use this password in MAIL_PASSWORD

---

## Database Schema

### notifications Collection
```javascript
{
  "_id": ObjectId,
  "recipientId": String,      // User receiving notification
  "type": String,             // BOOKING_APPROVED, etc.
  "category": String,         // BOOKING, TICKET, SYSTEM
  "title": String,            // "Booking Approved"
  "message": String,          // Full message
  "relatedResourceId": String, // booking_123, ticket_456
  "relatedResourceType": String, // BOOKING, TICKET
  "createdAt": ISODate,
  "isRead": Boolean,
  "emailSent": Boolean
}
```

### notification_preferences Collection
```javascript
{
  "_id": ObjectId,
  "userId": String,
  "bookingAlerts": Boolean,
  "ticketUpdates": Boolean,
  "emailNotifications": Boolean,
  "commentNotifications": Boolean
}
```

---

## Troubleshooting

### Issue: Notifications not showing

**Solution:**
1. Check if user is logged in
2. Verify userId is in localStorage
3. Check browser console for errors
4. Verify MongoDB is connected

### Issue: API returns 404

**Solution:**
1. Check MongoDB connection string
2. Verify collections exist in database
3. Check userId is correct format
4. Restart backend

### Issue: Frontend displays "No Notifications"

**Solution:**
1. Create a booking or ticket event
2. Admin approves/updates it
3. Check notification panel
4. Clear browser cache

### Issue: Email not sending

**Solution:**
1. Verify email credentials in environment
2. Check SMTP settings correct
3. Verify recipient email in User entity
4. Check application logs for errors

---

## Performance Tips

1. **Use Pagination** - Always limit results
2. **Index Queries** - MongoDB indexes on recipientId, userId
3. **Async Email** - Email sent in background
4. **Cache Preferences** - Don't fetch every time
5. **Clean Old Notifications** - Delete older than 90 days

---

## Security

✅ User sees only own notifications  
✅ Preferences stored per user  
✅ Email credentials secured  
✅ Input validation on all endpoints  
✅ XSS protection via React  
✅ CSRF tokens (implement if needed)  

---

## Statistics

- **14 Backend Java files**
- **6 Frontend React files**
- **11 REST endpoints**
- **13 service methods**
- **8+ unit tests**
- **~2000 lines backend code**
- **~850 lines frontend code**
- **~3000 lines documentation**

---

## Next Steps

1. **Integrate with Booking Module**
   - Add notification triggers to BookingService
   - Test booking approval notifications

2. **Integrate with Ticket Module**
   - Add notification triggers to TicketService
   - Test ticket status notifications

3. **Configure Email** (Optional)
   - Set environment variables
   - Test email delivery

4. **Deploy to Production**
   - Build Docker container
   - Set up database
   - Configure email service

---

## Support & Resources

- **API Docs**: [NOTIFICATION_API_DOCUMENTATION.md](NOTIFICATION_API_DOCUMENTATION.md)
- **Implementation Guide**: [JANIDU_NOTIFICATION_MODULE_GUIDE.md](JANIDU_NOTIFICATION_MODULE_GUIDE.md)
- **Architecture Diagrams**: [NOTIFICATION_ARCHITECTURE_DIAGRAM.md](NOTIFICATION_ARCHITECTURE_DIAGRAM.md)
- **Testing Guide**: [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

---

## Version

- **Module**: D - Notifications
- **Implemented**: April 2026
- **Version**: 1.0.0
- **Status**: COMPLETE ✅

---

## Author

**JANIDU**  
Assignment: IT3030 – PAF Assignment 2026 (Semester 1)  
Faculty of Computing – SLIIT

---

**Ready for Demo & Viva! 🎉**
