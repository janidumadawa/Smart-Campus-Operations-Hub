# Notification Module (Module D) - Implementation Guide

**Implemented by:** JANIDU  
**Assignment:** IT3030 – PAF Assignment 2026  
**Date:** April 2026

---

## Overview

This document provides a complete step-by-step implementation of the **Notification Module (Module D)** for the Smart Campus Operations Hub. The module includes:

✅ Booking notifications (approval/rejection/cancellation)  
✅ Ticket notifications (status changes, assignments, resolutions)  
✅ Comment notifications  
✅ Email notifications (optional)  
✅ Notification preferences (enable/disable by category)  
✅ Mark as read/unread functionality  
✅ Notification history page  
✅ Notification preferences settings page  
✅ Real-time notification badge in navbar  

---

## Implementation Summary

### Phase 1: Backend Development

#### 1.1 Enums Created
- **NotificationType.java** - Defines 11 types of notifications
- **NotificationCategory.java** - Defines 3 categories (BOOKING, TICKET, SYSTEM)

#### 1.2 Models Created
- **Notification.java** - Main model with all notification fields
- **NotificationPreference.java** - User preference settings

#### 1.3 Repositories Created
- **NotificationRepository.java** - MongoDB repository with custom queries
- **NotificationPreferenceRepository.java** - Preference repository

#### 1.4 Services Created
- **NotificationService.java** - Interface with 13 methods
- **NotificationServiceImpl.java** - Implementation with email support
- **NotificationHelper.java** - Helper class to trigger notifications from other services

#### 1.5 Controller Created
- **NotificationController.java** - REST API endpoints (11 endpoints covering GET, PUT, DELETE, POST)

#### 1.6 Configuration
- Added Spring Mail dependency to **pom.xml**
- Added email configuration to **application.properties**

#### 1.7 Tests Created
- **NotificationServiceTests.java** - JUnit tests for all service methods

---

### Phase 2: Frontend Development

#### 2.1 Components Created

**NotificationPanel.jsx**
- Side panel that slides in from the right
- Shows paginated notifications (10 per page)
- Mark individual notifications as read
- Delete notifications
- Mark all as read button
- Shows unread badge count
- Auto-refreshes every 30 seconds

**Navbar.jsx (Updated)**
- Added notification bell icon
- Shows unread count badge
- Integrates NotificationPanel
- Auto-fetches unread count every 30 seconds

#### 2.2 Pages Created

**NotificationHistoryPage.jsx**
- Full-screen notification history
- Filter by category (All, Bookings, Tickets, System)
- Paginated display (15 per page)
- Mark as read/unread functionality
- Delete notifications
- Shows notification timestamp and date
- Responsive design with Tailwind CSS

**NotificationPreferencesPage.jsx**
- Settings page for notification preferences
- Toggle switches for:
  - Booking Alerts
  - Ticket Updates
  - Comment Notifications
  - Email Notifications
- Save/Reset buttons
- User-friendly switches with visual feedback

#### 2.3 Routes Added to App.jsx
- `/notifications` - Notification history page
- `/notification-preferences` - Preferences settings page

---

## API Endpoints Summary

### Notification Endpoints (11 total)

#### GET Endpoints (6)
1. `GET /api/notifications/{userId}` - Get paginated notifications
2. `GET /api/notifications/{userId}/count` - Get unread count
3. `GET /api/notifications/{userId}/unread` - Get unread notifications
4. `GET /api/notifications/{userId}/category/{category}` - Filter by category
5. `GET /api/notifications/detail/{notificationId}` - Get single notification
6. `GET /api/notifications/preferences/{userId}` - Get preferences

#### PUT Endpoints (3)
7. `PUT /api/notifications/{notificationId}/mark-as-read` - Mark as read
8. `PUT /api/notifications/{notificationId}/mark-as-unread` - Mark as unread
9. `PUT /api/notifications/{userId}/mark-all-as-read` - Mark all as read

#### DELETE Endpoints (1)
10. `DELETE /api/notifications/{notificationId}` - Delete notification

#### POST Endpoints (1)
11. `POST /api/notifications/preferences/{userId}` - Update preferences

---

## How to Use

### Backend Setup

1. **Build the project:**
   ```bash
   ./mvnw clean install
   ```

2. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Configure email (optional)** - Set environment variables:
   ```
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Triggering Notifications

From any service (Booking, Ticket, Comment):

```java
@Autowired
private NotificationHelper notificationHelper;

// When booking is approved
notificationHelper.triggerBookingApproved(userId, bookingId, resourceName);

// When ticket status changes
notificationHelper.triggerTicketInProgress(userId, ticketId);

// When comment is added
notificationHelper.triggerCommentAdded(userId, ticketId, commenterName, "TICKET");
```

---

## Database Collections

### Notifications Collection
```javascript
{
  "_id": ObjectId,
  "recipientId": String,
  "senderId": String,
  "type": String (enum),
  "category": String (enum),
  "title": String,
  "message": String,
  "relatedResourceId": String,
  "relatedResourceType": String,
  "createdAt": ISODate,
  "isRead": Boolean,
  "emailSent": Boolean
}
```

### Notification Preferences Collection
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

## Testing

### Backend Tests
Run using Maven:
```bash
./mvnw test -Dtest=NotificationServiceTests
```

### Frontend Testing (Manual)
1. Login to the application
2. Click notification bell in navbar
3. Verify notifications panel opens
4. Click on notification to mark as read
5. Visit `/notifications` for full history
6. Visit `/notification-preferences` to customize settings

### API Testing (Postman)
See `NOTIFICATION_API_DOCUMENTATION.md` for complete endpoint documentation with examples.

---

## Features Implemented

### Core Features (Minimum Requirements)

✅ **Notification Creation**
- Automatically created when events occur
- Respects user preferences
- Stores all relevant metadata

✅ **Notification Management**
- Mark as read/unread
- Delete individual notifications
- Mark all as read
- Paginated display

✅ **Integration with Modules**
- Booking: Approved, Rejected, Cancelled
- Tickets: Created, Assigned, In Progress, Resolved, Closed, Rejected
- Comments: Added, Replied

✅ **User Preferences**
- Enable/disable by category
- Email notification toggle
- Centralized settings page

✅ **Notification Panel**
- Real-time display in navbar
- Unread badge count
- Quick actions (mark read, delete)

### Additional Features

✅ **Email Notifications** - Optional email delivery  
✅ **Notification History** - Complete history with filters  
✅ **Auto-refresh** - Updates every 30 seconds  
✅ **Responsive Design** - Works on all devices  
✅ **Category Filtering** - Filter by Booking, Ticket, System  
✅ **Pagination** - Handle large notification lists  

---

## File Structure

```
Backend Files:
├── backend/enums/
│   ├── NotificationType.java
│   └── NotificationCategory.java
├── backend/model/
│   ├── Notification.java
│   └── NotificationPreference.java
├── backend/repository/
│   ├── NotificationRepository.java
│   └── NotificationPreferenceRepository.java
├── backend/service/
│   ├── NotificationService.java
│   ├── NotificationServiceImpl.java
│   └── NotificationHelper.java
├── backend/controller/
│   └── NotificationController.java
└── backend/test/
    └── NotificationServiceTests.java

Frontend Files:
├── src/components/shared/
│   └── NotificationPanel.jsx
├── src/pages/
│   ├── NotificationHistoryPage.jsx
│   └── NotificationPreferencesPage.jsx
└── src/App.jsx (updated)
```

---

## Integration Checklist

- [ ] Backend models and repositories created
- [ ] NotificationService implemented
- [ ] NotificationController endpoints working
- [ ] Email configuration completed (optional)
- [ ] Frontend components created
- [ ] Notification routes added to App.jsx
- [ ] Navbar updated with notification bell
- [ ] NotificationPanel integrated
- [ ] Test cases passing
- [ ] Postman collection tested
- [ ] Integration with Booking module
- [ ] Integration with Ticket module
- [ ] Integration with Comment module

---

## Performance Optimization Tips

1. **Database Indexes** - Create indexes on:
   - `recipientId` and `createdAt`
   - `userId` in preferences

2. **Pagination** - Always use pagination for large datasets

3. **Auto-cleanup** - Delete old notifications periodically:
   ```java
   notificationService.deleteOldNotifications(90); // Delete older than 90 days
   ```

4. **Caching** - Cache frequently accessed preferences

---

## Security Considerations

✅ User can only view their own notifications  
✅ Preferences are userId-scoped  
✅ Email destinations stored securely  
✅ Input validation on all endpoints  
✅ Role-based access in controller (add when needed)  

---

## Known Limitations & Future Enhancements

- [ ] Real-time WebSocket notifications (not yet implemented)
- [ ] Push notifications to mobile (requires setup)
- [ ] SMS notifications (requires SMS service integration)
- [ ] Notification sounds (can be added to frontend)
- [ ] Notification grouping (group similar notifications)
- [ ] Scheduled digest emails (daily/weekly summary)
- [ ] Rich text formatting in messages
- [ ] File attachments in notifications

---

## Troubleshooting

### Notifications not appearing
1. Check if notification preferences are enabled
2. Verify userId is correct
3. Check MongoDB connection
4. Look at application logs

### Email not sending
1. Verify email credentials in environment variables
2. Check SMTP settings (especially for Gmail - use app password)
3. Verify recipient email is stored in User entity
4. Check firewall/proxy settings

### Frontend not updating
1. Clear browser cache
2. Verify userId is stored in localStorage
3. Check API response in browser DevTools
4. Verify CORS is configured

---

## Notes for Viva/Demonstration

**Key Points to Explain:**
1. How notifications are triggered from other modules
2. The preference system and its flexibility
3. Email notification flow (if implemented)
4. Database schema design
5. Performance optimization with pagination
6. How real-time updates work (30-second polling)
7. Integration with existing modules

**Demonstration Flow:**
1. Create a booking → See approval notification
2. Create a ticket → See creation notification
3. Change notification preferences
4. Check notification history
5. Test pagination
6. Show API endpoints in Postman

---

## Commit Messages (for Git)

```
feat: implement notification module core
feat: create notification models and repositories
feat: implement notification service
feat: create notification REST API endpoints
feat: add email notification support
feat: create notification React components
feat: add notification panel to navbar
feat: create notification history page
feat: add notification preferences settings
test: add notification service tests
docs: add notification API documentation
```

---

## Individual Contribution (JANIDU)

**Modules Implemented:**
- Module D: Notifications

**REST API Endpoints (11 total):**
1. GET /api/notifications/{userId} - Retrieve paginated notifications
2. GET /api/notifications/{userId}/count - Get unread count
3. GET /api/notifications/{userId}/unread - Get unread notifications
4. GET /api/notifications/{userId}/category/{category} - Filter by category
5. GET /api/notifications/detail/{notificationId} - Get single notification
6. PUT /api/notifications/{notificationId}/mark-as-read - Mark as read
7. PUT /api/notifications/{notificationId}/mark-as-unread - Mark as unread
8. PUT /api/notifications/{userId}/mark-all-as-read - Mark all as read
9. DELETE /api/notifications/{notificationId} - Delete notification
10. GET /api/notifications/preferences/{userId} - Get preferences
11. POST /api/notifications/preferences/{userId} - Update preferences

**HTTP Methods Used:**
- GET (6 endpoints)
- PUT (3 endpoints)
- DELETE (1 endpoint)
- POST (1 endpoint)

---

## Resources & References

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- MongoDB Documentation: https://docs.mongodb.com
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**End of Documentation**
