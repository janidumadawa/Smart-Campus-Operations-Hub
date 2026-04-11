# Notification System Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Smart Campus Operations Hub                  │
│                    Notification System Flow                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐      ┌──────────────────────┐           │
│  │   Notification      │      │  Notification        │           │
│  │   Panel Component   │      │  History Page        │           │
│  └────────────┬────────┘      └──────────┬───────────┘           │
│               │                          │                       │
│               │ Shows unread │triggers API calls                │
│               │ and displays │                                  │
│               │ notifications│                                  │
│               │              │                                  │
│  ┌────────────▼──────────────▼────────────┐                    │
│  │         Notification Bell (Navbar)      │                    │
│  │     - Unread badge count                │                    │
│  │     - Auto-refresh every 30 seconds     │                    │
│  └────────────┬────────────────────────────┘                    │
│               │                                                  │
│  ┌────────────▼───────────────────────┐                         │
│  │ NotificationPreferencesPage         │                         │
│  │ - Toggle alerts by category         │                         │
│  │ - Save preferences                  │                         │
│  └────────────┬───────────────────────┘                         │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                │ HTTP Requests/Responses (axios)
                │
┌───────────────▼──────────────────────────────────────────────────┐
│                      BACKEND (Spring Boot)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────┐                │
│  │      NotificationController (REST API)       │                │
│  │  ┌────────────────────────────────────────┐  │                │
│  │  │ GET    /notifications/{userId}         │  │                │
│  │  │ GET    /notifications/{userId}/count   │  │                │
│  │  │ GET    /notifications/{userId}/unread  │  │                │
│  │  │ PUT    /mark-as-read                   │  │                │
│  │  │ PUT    /mark-all-as-read               │  │                │
│  │  │ DELETE /notifications/{id}             │  │                │
│  │  │ POST   /preferences/{userId}           │  │                │
│  │  └────────────────────────────────────────┘  │                │
│  └────────┬───────────────────────────────────────┘                │
│           │                                                      │
│  ┌────────▼──────────────────────────────────────┐               │
│  │  NotificationService (Business Logic)         │               │
│  │  ┌──────────────────────────────────────────┐ │               │
│  │  │ - createNotification()                   │ │               │
│  │  │ - markAsRead()                           │ │               │
│  │  │ - getUnreadCount()                       │ │               │
│  │  │ - sendEmailNotification()                │ │               │
│  │  │ - getOrCreatePreferences()               │ │               │
│  │  │ - isNotificationEnabledForUser()         │ │               │
│  │  └──────────────────────────────────────────┘ │               │
│  └────────┬────────────────────────────────────────┘               │
│           │                                                      │
│  ┌────────▼──────────────────────────────────────┐               │
│  │  NotificationHelper (Trigger Helper)          │               │
│  │  ┌──────────────────────────────────────────┐ │               │
│  │  │ - triggerBookingApproved()               │ │               │
│  │  │ - triggerTicketInProgress()              │ │               │
│  │  │ - triggerCommentAdded()                  │ │               │
│  │  │ + More trigger methods...                │ │               │
│  │  └──────────────────────────────────────────┘ │               │
│  └────────┬────────────────────────────────────────┘               │
│           │                                                      │
│           │ Called from BookingService,                          │
│           │ TicketService, etc.                                  │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────────┐       │
│  │  notifications       │    │  notification_preferences│       │
│  │  ┌────────────────┐  │    │  ┌───────────────────┐   │       │
│  │  │ _id            │  │    │  │ _id               │   │       │
│  │  │ recipientId    │  │    │  │ userId            │   │       │
│  │  │ type           │  │    │  │ bookingAlerts     │   │       │
│  │  │ category       │  │    │  │ ticketUpdates     │   │       │
│  │  │ title          │  │    │  │ emailNotifications│   │       │
│  │  │ message        │  │    │  └───────────────────┘   │       │
│  │  │ createdAt      │  │    │                          │       │
│  │  │ isRead         │  │    │ (Auto-created for each  │       │
│  │  │ emailSent      │  │    │  user on first access)  │       │
│  │  └────────────────┘  │    └──────────────────────────┘       │
│  └──────────────────────┘                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Notification Creation Flow

```
Module Event Occurs
(Booking Approved / Ticket Created / Comment Added)
         │
         ▼
┌─────────────────────────┐
│ BookingService /        │
│ TicketService /         │
│ CommentService calls    │
│ NotificationHelper      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ triggerBookingApproved(...) or similar │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ NotificationService.createNotification()                │
│  1. Check user preferences                              │
│  2. Create Notification object                          │
│  3. Save to database                                    │
│  4. Send email (async if enabled)                       │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
    ┌────┴────────────┐
    │                 │
    ▼                 ▼
┌────────────┐   ┌─────────────┐
│ Database   │   │ Email Queue │
│ (MongoDB)  │   │ (if enabled)│
└────────────┘   └─────────────┘
    │                 │
    │                 ▼
    │            ┌──────────────┐
    │            │ SMTP Server  │
    │            │ (Gmail, etc) │
    │            └──────────────┘
    │                 │
    │                 ▼
    │            ┌──────────────┐
    │            │ User Email   │
    │            └──────────────┘
    │
    ▼
┌────────────────────────────┐
│ Frontend polls every 30sec │
│ Notification bell updates │
│ Panel shows notification   │
└────────────────────────────┘
```

---

## User Actions Flow

```
┌──────────────────────────────────────────┐
│        User Opens Notification Panel    │
└────────────┬─────────────────────────────┘
             │
             ▼
      ┌─────────────────┐
      │ API Call Sent:  │
      │ GET /notifs/{}  │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────────────────────┐
      │ Backend returns paginated list  │
      └────────┬────────────────────────┘
               │
               ▼
      ┌─────────────────────────────────┐
      │ Frontend displays notifications │
      │ with unread highlighting        │
      └────────┬────────────────────────┘
               │
      ┌────────┴───────┬──────────────┐
      │                │              │
      ▼                ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Mark     │  │ Delete   │  │ Mark All │
  │ as Read  │  │ Notice   │  │ as Read  │
  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │             │             │
       ▼             ▼             ▼
    PUT Call     DELETE Call    PUT Call
    │             │             │
    └────┬────────┴────────┬────┘
         │                 │
         ▼                 ▼
    Database Updated  Frontend Updated
    Status changed    UI refreshed
```

---

## Notification Preferences Flow

```
┌──────────────────────────────────────────────┐
│  User visits /notification-preferences       │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ GET /preferences/{userId}  │
│ Fetch current settings     │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Display Preference Toggles:    │
│ ✓ Booking Alerts              │
│ ✓ Ticket Updates              │
│ ✓ Email Notifications         │
│ ✓ Comment Notifications       │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ User toggles settings        │
│ Clicks "Save Preferences"    │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ POST /preferences/{userId}       │
│ with updated preferences         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Database updates preferences     │
│ Response with saved settings     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Message: "Saved Successfully"    │
│ Future notifications respect this│
└──────────────────────────────────┘
```

---

## Database Relationships

```
┌─────────────────────────────────┐
│           User                  │
│ ┌─────────────────────────────┐ │
│ │ _id (userId)                │ │
│ │ email                       │ │
│ │ name                        │ │
│ │ role (ADMIN, USER, etc)     │ │
│ └────────┬────────────────────┘ │
└─────────┼────────────────────────┘
          │
          │ has many
          │
          ├──────────────────────────────┬─────────────────────────────┐
          │                              │                             │
          ▼                              ▼                             ▼
┌───────────────────────────────┐ ┌──────────────────────┐ ┌─────────────────────┐
│   Notification                │ │ NotificationPreference│ │ Booking / Ticket    │
│ ┌─────────────────────────────┤ │ ┌──────────────────┤ │ ┌─────────────────┐   │
│ │ _id                         │ │ │ _id              │ │ │ _id             │   │
│ │ recipientId (userId) ──────────┼─┼─► userId        │ │ │ userId          │   │
│ │ type (enum)                 │ │ │ bookingAlerts   │ │ │ resourceId      │   │
│ │ category (BOOKING/TICKET)   │ │ │ ticketUpdates   │ │ │ status (PENDING)│   │
│ │ title                       │ │ │ emailNotifs     │ │ │ date            │   │
│ │ message                     │ │ │ commentNotifs   │ │ │ ...             │   │
│ │ relatedResourceId ──────────────┼─┼────────────────┼───┼─► (references)  │   │
│ │ relatedResourceType         │ │ │                │ │ │                 │   │
│ │ createdAt                   │ │ │                │ │ │                 │   │
│ │ isRead                      │ │ │                │ │ │                 │   │
│ │ emailSent                   │ │ │                │ │ │                 │   │
│ └─────────────────────────────┤ │ └──────────────────┤ │ └─────────────────┘   │
└───────────────────────────────┘ └──────────────────────┘ └─────────────────────┘
```

---

## REST API Endpoint Topology

```
                      /api/notifications (BASE)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    /{userId}        /{notificationId}    /preferences

    │                    │                    │
    ├─ GET              ├─ GET (detail)      ├─ GET
    │ (paginated)       │                    │ (retrieve)
    │                   ├─ PUT (read)        │
    │                   ├─ PUT (unread)      └─ POST
    │                   └─ DELETE             (save)
    │
    ├─ /count
    │  └─ GET (get count)
    │
    ├─ /unread
    │  └─ GET (get list)
    │
    ├─ /mark-all-as-read
    │  └─ PUT
    │
    └─ /category/{category}
       └─ GET (filtered)
```

---

## Notification Lifecycle States

```
                    Created (New)
                         │
                         ▼
      ┌──────────────────────────────────────┐
      │  Database                            │
      │  isRead = false                      │
      │  emailSent = false                   │
      └──────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
      Email Sent    User Reads       Never Read
    (if enabled)    isRead = true    (stays unread)
         │               │               │
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
                  User Deletes
                  (removed from DB)
```

---

## Key Performance Indicators

```
Metrics to Monitor:

☐ Average notification response time
☐ Email delivery success rate
☐ Unread notification count per user
☐ Most common notification types
☐ API endpoint performance
☐ Database query optimization
☐ Memory usage of notification service
☐ Email queue size
☐ Frontend notification fetch frequency
☐ User preference update frequency
```

---

## Error Handling Flow

```
User Action
    │
    ▼
API Call Sent
    │
    ▼
Request reaches Backend
    │
    ├─ Validation Error
    │  └─ 400 Bad Request
    │
    ├─ Resource Not Found
    │  └─ 404 Not Found
    │
    ├─ Server Error
    │  └─ 500 Internal Server Error
    │
    └─ Success
       ├─ 200 OK
       ├─ 201 Created
       └─ Response with data
            │
            ▼
        Frontend processes
        Updates UI accordingly
        Shows success/error message
```

---

## Concurrency & Thread Safety

```
Multiple Users Accessing Notifications Simultaneously:

User A ──┐
         ├──► NotificationService (Thread Pool)
User B ──┤           │
         │           ├─► Get notif for User A
User C ──┤           ├─► Get notif for User B
         └──► Called├─► Mark as read for User C
              from  └─► Update prefs for User A
              multiple
              threads
                    │
                    ▼
            MongoDB handles
            concurrent writes
            with atomicity
```

---

This architecture ensures:
- ✅ Scalability (horizontal scaling with load balancing)
- ✅ Reliability (database persistence)
- ✅ User preference enforcement
- ✅ Real-time feedback (polling every 30 seconds)
- ✅ Clean separation of concerns
- ✅ Easy integration with other modules
