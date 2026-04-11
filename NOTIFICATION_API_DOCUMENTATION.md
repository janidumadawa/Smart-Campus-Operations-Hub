# Notification Module API Documentation

## Base URL
```
http://localhost:8081/api/notifications
```

## Endpoints

### 1. GET - Get User Notifications (Paginated)
**Endpoint:** `GET /api/notifications/{userId}`

**Parameters:**
- `page` (query, optional): Page number (default: 0)
- `size` (query, optional): Items per page (default: 10)

**Example:**
```
GET http://localhost:8081/api/notifications/user123?page=0&size=10
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "recipientId": "user123",
      "type": "BOOKING_APPROVED",
      "category": "BOOKING",
      "title": "Booking Approved",
      "message": "Your booking has been approved",
      "relatedResourceId": "booking_456",
      "relatedResourceType": "BOOKING",
      "createdAt": "2026-04-09T10:30:00",
      "isRead": false,
      "emailSent": true
    }
  ],
  "totalPages": 5,
  "totalElements": 47,
  "currentPage": 0
}
```

---

### 2. GET - Get Unread Notifications Count
**Endpoint:** `GET /api/notifications/{userId}/count`

**Example:**
```
GET http://localhost:8081/api/notifications/user123/count
```

**Response (200):**
```json
{
  "success": true,
  "unreadCount": 3
}
```

---

### 3. GET - Get Unread Notifications List
**Endpoint:** `GET /api/notifications/{userId}/unread`

**Example:**
```
GET http://localhost:8081/api/notifications/user123/unread
```

**Response (200):**
```json
{
  "success": true,
  "unreadCount": 3,
  "notifications": [...]
}
```

---

### 4. GET - Get Notifications by Category
**Endpoint:** `GET /api/notifications/{userId}/category/{category}`

**Categories:** `BOOKING`, `TICKET`, `SYSTEM`

**Example:**
```
GET http://localhost:8081/api/notifications/user123/category/BOOKING
```

**Response (200):**
```json
{
  "success": true,
  "category": "BOOKING",
  "notifications": [...]
}
```

---

### 5. GET - Get Single Notification
**Endpoint:** `GET /api/notifications/detail/{notificationId}`

**Example:**
```
GET http://localhost:8081/api/notifications/detail/notif_123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "notif_123",
    "recipientId": "user123",
    "type": "BOOKING_APPROVED",
    "category": "BOOKING",
    "title": "Booking Approved",
    "message": "Your booking has been approved",
    "relatedResourceId": "booking_456",
    "relatedResourceType": "BOOKING",
    "createdAt": "2026-04-09T10:30:00",
    "isRead": false,
    "emailSent": true
  }
}
```

---

### 6. PUT - Mark Notification as Read
**Endpoint:** `PUT /api/notifications/{notificationId}/mark-as-read`

**Example:**
```
PUT http://localhost:8081/api/notifications/notif_123/mark-as-read
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "notif_123",
    "isRead": true,
    ...
  }
}
```

---

### 7. PUT - Mark Notification as Unread
**Endpoint:** `PUT /api/notifications/{notificationId}/mark-as-unread`

**Example:**
```
PUT http://localhost:8081/api/notifications/notif_123/mark-as-unread
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as unread",
  "data": {
    "id": "notif_123",
    "isRead": false,
    ...
  }
}
```

---

### 8. PUT - Mark All as Read
**Endpoint:** `PUT /api/notifications/{userId}/mark-all-as-read`

**Example:**
```
PUT http://localhost:8081/api/notifications/user123/mark-all-as-read
```

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 9. DELETE - Delete Notification
**Endpoint:** `DELETE /api/notifications/{notificationId}`

**Example:**
```
DELETE http://localhost:8081/api/notifications/notif_123
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### 10. GET - Get Notification Preferences
**Endpoint:** `GET /api/notifications/preferences/{userId}`

**Example:**
```
GET http://localhost:8081/api/notifications/preferences/user123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "pref_123",
    "userId": "user123",
    "bookingAlerts": true,
    "ticketUpdates": true,
    "emailNotifications": true,
    "commentNotifications": true
  }
}
```

---

### 11. POST - Update Notification Preferences
**Endpoint:** `POST /api/notifications/preferences/{userId}`

**Request Body:**
```json
{
  "bookingAlerts": true,
  "ticketUpdates": false,
  "emailNotifications": true,
  "commentNotifications": true
}
```

**Example:**
```
POST http://localhost:8081/api/notifications/preferences/user123
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "id": "pref_123",
    "userId": "user123",
    "bookingAlerts": true,
    "ticketUpdates": false,
    "emailNotifications": true,
    "commentNotifications": true
  }
}
```

---

## HTTP Methods Used
- **GET**: 6 endpoints - Retrieve notifications and preferences
- **PUT**: 3 endpoints - Update read/unread status
- **DELETE**: 1 endpoint - Delete notifications
- **POST**: 1 endpoint - Create/Update preferences

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": "Notification not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid category: INVALID_CATEGORY"
}
```

---

## Integration Points

### From Booking Service
When a booking is approved, rejected, or cancelled:
```java
@Autowired
private NotificationHelper notificationHelper;

// When booking is approved
notificationHelper.triggerBookingApproved(userId, bookingId, resourceName);

// When booking is rejected
notificationHelper.triggerBookingRejected(userId, bookingId, resourceName, reason);

// When booking is cancelled
notificationHelper.triggerBookingCancelled(userId, bookingId, resourceName);
```

### From Ticket Service
When a ticket status changes:
```java
// When ticket is created
notificationHelper.triggerTicketCreated(userId, ticketId, category);

// When ticket is assigned
notificationHelper.triggerTicketAssigned(userId, ticketId, technicianName);

// When ticket is in progress
notificationHelper.triggerTicketInProgress(userId, ticketId);

// When ticket is resolved
notificationHelper.triggerTicketResolved(userId, ticketId, resolutionNotes);

// When ticket is closed
notificationHelper.triggerTicketClosed(userId, ticketId);

// When ticket is rejected
notificationHelper.triggerTicketRejected(userId, ticketId, reason);
```

### From Comment Service
When comments are added or replied:
```java
// When comment is added
notificationHelper.triggerCommentAdded(userId, resourceId, commenterName, "TICKET");

// When someone replies to a comment
notificationHelper.triggerCommentReplied(userId, resourceId, replierName, "TICKET");
```

---

## Testing Checklist

- [ ] Create notifications endpoint works
- [ ] Get all notifications endpoint works
- [ ] Unread count displays correctly
- [ ] Filter by category works
- [ ] Mark as read/unread functions
- [ ] Mark all as read
- [ ] Delete notification works
- [ ] Get/Update preferences works
- [ ] Email notifications are sent (when configured)
- [ ] Frontend notification panel displays correctly
- [ ] Notification history page shows all notifications
- [ ] Notification preferences page allows customization
- [ ] Notification bell badge shows unread count
- [ ] Auto-refresh of notifications every 30 seconds
