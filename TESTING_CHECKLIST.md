# NOTIFICATION MODULE - TESTING & DEPLOYMENT CHECKLIST

**Implemented by:** JANIDU  
**Date:** April 9, 2026  
**Module:** D - Notifications

---

## 🔧 SETUP & BUILD

### Backend Setup
- [ ] Clone repository
- [ ] Navigate to `backend/` directory
- [ ] Run `./mvnw clean install`
- [ ] Verify build succeeds (no errors)
- [ ] Check all dependencies downloaded
- [ ] Verify `pom.xml` includes:
  - [ ] Spring Boot Starter Web
  - [ ] Spring Boot Starter Data MongoDB
  - [ ] Spring Boot Starter Mail
  - [ ] Spring Dotenv
  - [ ] Cloudinary

### Frontend Setup
- [ ] Navigate to `frontend/` directory
- [ ] Run `npm install`
- [ ] Verify all dependencies installed
- [ ] Check `package.json` includes required packages:
  - [ ] React
  - [ ] React Router
  - [ ] Axios
  - [ ] Tailwind CSS
  - [ ] Lucide Icons
  - [ ] React Hot Toast

### Database Setup
- [ ] MongoDB running locally or remotely
- [ ] Connection string configured
- [ ] Test connection works
- [ ] Verify collections will auto-create

---

## 🚀 RUNNING THE APPLICATION

### Start Backend
- [ ] Navigate to `backend/` directory
- [ ] Run `./mvnw spring-boot:run`
- [ ] Wait for "Application started" message
- [ ] Verify running on `http://localhost:8081`
- [ ] Check console for any errors
- [ ] Verify MongoDB connection successful

### Start Frontend
- [ ] Open new terminal
- [ ] Navigate to `frontend/` directory
- [ ] Run `npm run dev`
- [ ] Wait for "Local: http://localhost:5173" message
- [ ] Open browser to `http://localhost:5173`
- [ ] Verify page loads without errors

### Initial State
- [ ] Application loads successfully
- [ ] No console errors
- [ ] Login page accessible
- [ ] Navbar displays correctly

---

## 👤 USER AUTHENTICATION

### Create Test Account
- [ ] Go to register page
- [ ] Create account with:
  - [ ] Valid email
  - [ ] Strong password
  - [ ] Name
- [ ] Verify account created successfully
- [ ] Login with new credentials
- [ ] Verify dashboard loads

### Verify Session
- [ ] User ID stored in localStorage
- [ ] Session persists on refresh
- [ ] Can navigate between pages
- [ ] Logout clears session

---

## 🔔 NOTIFICATION PANEL

### Visual Elements
- [ ] Notification bell icon visible in navbar
- [ ] Bell has proper styling
- [ ] No errors in console

### Badge Count
- [ ] Badge shows unread count (initially 0)
- [ ] Badge disappears when no unread
- [ ] Badge updates dynamically
- [ ] Badge styling is correct

### Panel Functionality
- [ ] Clicking bell opens notification panel
- [ ] Panel slides in from right
- [ ] Panel has header with title
- [ ] Panel has close button (X)
- [ ] Clicking X closes panel
- [ ] Panel shows "No notifications" message initially

### Panel Content
- [ ] Notifications display in list format
- [ ] Each notification shows:
  - [ ] Icon/emoji
  - [ ] Title
  - [ ] Message
  - [ ] Date/time
- [ ] Pagination shows if >10 notifications
- [ ] Can navigate between pages

### Panel Actions
- [ ] Can mark notification as read (checkmark button)
- [ ] Can delete notification (trash button)
- [ ] Can mark all as read (button in header)
- [ ] Actions work correctly

---

## 📋 NOTIFICATION HISTORY PAGE

### Accessing Page
- [ ] Can navigate to `/notifications`
- [ ] Page loads successfully
- [ ] Header displays correctly

### Filters
- [ ] "All" filter works (shows all notifications)
- [ ] "Booking" filter shows booking notifications only
- [ ] "Ticket" filter shows ticket notifications only
- [ ] "System" filter shows system notifications only
- [ ] Active filter highlighted
- [ ] Filters work independently

### Display
- [ ] Notifications display in card format
- [ ] Each card shows:
  - [ ] Icon
  - [ ] Title
  - [ ] Full message
  - [ ] Date and time
  - [ ] Category badge
  - [ ] Read/unread indicator
- [ ] Cards are responsive

### Actions
- [ ] Can mark as read (checkmark button)
- [ ] Can mark as unread (checkmark button)
- [ ] Can delete (trash button)
- [ ] Actions update UI immediately

### Pagination
- [ ] Shows "Page X of Y"
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Can navigate through pages
- [ ] Shows correct items per page

---

## ⚙️ NOTIFICATION PREFERENCES

### Accessing Page
- [ ] Can navigate to `/notification-preferences`
- [ ] Page loads successfully
- [ ] Header displays correctly

### Preference Options
- [ ] "Booking Notifications" toggle visible
- [ ] "Ticket Updates" toggle visible
- [ ] "Comment Notifications" toggle visible
- [ ] "Email Notifications" toggle visible
- [ ] Each has description text
- [ ] Each has visual toggle switch

### Toggle Functionality
- [ ] Can toggle each preference on/off
- [ ] Toggles show visual feedback
- [ ] Active state clearly indicated
- [ ] Initial state reflects saved preferences

### Save/Reset
- [ ] Save button present and functional
- [ ] Reset button present and functional
- [ ] Clicking Save shows success message
- [ ] Preferences persist on refresh
- [ ] Different users have different preferences

---

## 🔌 REST API ENDPOINTS

### GET /api/notifications/{userId}
- [ ] Returns paginated notifications
- [ ] Accepts page & size parameters
- [ ] Returns 200 OK
- [ ] Response includes:
  - [ ] success: true
  - [ ] data: array
  - [ ] totalPages
  - [ ] totalElements
  - [ ] currentPage

### GET /api/notifications/{userId}/count
- [ ] Returns unread count
- [ ] Returns 200 OK
- [ ] Response includes:
  - [ ] success: true
  - [ ] unreadCount: number

### GET /api/notifications/{userId}/unread
- [ ] Returns unread notifications only
- [ ] Returns 200 OK
- [ ] Response includes unreadCount and notifications

### GET /api/notifications/{userId}/category/{category}
- [ ] Filter by BOOKING works
- [ ] Filter by TICKET works
- [ ] Filter by SYSTEM works
- [ ] Invalid category returns 400
- [ ] Returns correct filtered results

### GET /api/notifications/detail/{notificationId}
- [ ] Returns single notification
- [ ] Returns 200 for valid ID
- [ ] Returns 404 for invalid ID
- [ ] Includes all notification fields

### PUT /api/notifications/{notificationId}/mark-as-read
- [ ] Marks notification as read
- [ ] Returns 200 OK
- [ ] Returns 404 for invalid ID
- [ ] isRead changes to true

### PUT /api/notifications/{notificationId}/mark-as-unread
- [ ] Marks notification as unread
- [ ] Returns 200 OK
- [ ] Returns 404 for invalid ID
- [ ] isRead changes to false

### PUT /api/notifications/{userId}/mark-all-as-read
- [ ] Marks all user notifications as read
- [ ] Returns 200 OK
- [ ] All user's notifications show isRead: true

### DELETE /api/notifications/{notificationId}
- [ ] Deletes notification from database
- [ ] Returns 200 OK
- [ ] Returns 404 for invalid ID
- [ ] Notification no longer retrievable

### GET /api/notifications/preferences/{userId}
- [ ] Returns user preferences
- [ ] Creates default if not exists
- [ ] Returns all preference fields
- [ ] Returns 200 OK

### POST /api/notifications/preferences/{userId}
- [ ] Saves/updates preferences
- [ ] Returns 200 OK
- [ ] Returns 400 for invalid data
- [ ] Preferences persisted in database
- [ ] Reflects in next GET call

---

## 📨 EMAIL NOTIFICATIONS (Optional)

### Configuration
- [ ] Email credentials set in environment
- [ ] SMTP host configured
- [ ] Port configured (587 for Gmail)
- [ ] Authentication credentials valid
- [ ] Test account has app-specific password (for Gmail)

### Email Delivery
- [ ] When enabled, emails are sent
- [ ] Recipient email is correct
- [ ] Subject line is appropriate
- [ ] Email body includes message
- [ ] Email marked as sent in database
- [ ] Failed emails are logged

### Email Content
- [ ] Subject: "[Campus Hub] {Title}"
- [ ] Body includes: Message
- [ ] Body includes: Call to action
- [ ] From address correct
- [ ] Formatting is clean

---

## 🔗 INTEGRATION WITH OTHER MODULES

### Booking Module Integration
- [ ] Create booking → No errors
- [ ] Admin approves booking → Notification created
- [ ] Check notification panel → Shows approval notification
- [ ] User gets notified correctly
- [ ] Database entries correct

### Ticket Module Integration (Ready for)
- [ ] Service has NotificationHelper injection
- [ ] Create ticket → Can trigger notification
- [ ] Ticket status change → Can trigger notification
- [ ] Comment added → Can trigger notification

### Comment Module Integration (Ready for)
- [ ] Service can use NotificationHelper
- [ ] Comment creation → Can trigger notification
- [ ] Reply to comment → Can trigger notification

---

## 🧪 MANUAL USER WORKFLOWS

### Workflow 1: Booking Approval Notification
1. [ ] User A creates booking for resource
2. [ ] Admin reviews booking
3. [ ] Admin approves booking
4. [ ] User A notification bell updates (count increases)
5. [ ] User A opens notification panel
6. [ ] Sees "Booking Approved" notification
7. [ ] Can mark as read
8. [ ] Can view in history page

### Workflow 2: Notification Preferences
1. [ ] User visits preferences page
2. [ ] Disables booking alerts
3. [ ] Saves preferences
4. [ ] User B (admin) approves new booking
5. [ ] User A receives NO notification (because disabled)
6. [ ] User A re-enables and saves
7. [ ] User B creates another booking
8. [ ] User A receives notification (now enabled)

### Workflow 3: Notification History
1. [ ] Create multiple notifications manually (or through events)
2. [ ] Visit notification history page
3. [ ] See all notifications listed
4. [ ] Filter by Booking category
5. [ ] Only booking notifications show
6. [ ] Mark some as read
7. [ ] Filter by Ticket category
8. [ ] Verify correct filtering

### Workflow 4: Mark as Read Flow
1. [ ] See unread notification in panel (blue background)
2. [ ] Click checkmark to mark as read
3. [ ] Background changes to white
4. [ ] Unread count decreases
5. [ ] In history, notification shows as read
6. [ ] Can mark as unread again

### Workflow 5: Delete Notification
1. [ ] Open notification panel
2. [ ] Click trash icon on a notification
3. [ ] Notification disappears immediately
4. [ ] Check history page
5. [ ] Notification no longer appears
6. [ ] Verify database entry deleted

---

## 🔒 SECURITY TESTING

### User Isolation
- [ ] User A cannot see User B's notifications
- [ ] User A cannot modify User B's preferences
- [ ] Preferences stored per userId
- [ ] API requires correct userId

### Input Validation
- [ ] Invalid notification ID returns 400/404
- [ ] Invalid category returns 400
- [ ] Malformed requests handled gracefully
- [ ] XSS attempts blocked

### Authorization
- [ ] Users can only access own notifications
- [ ] Admin has admin-only functions (implement if needed)
- [ ] Role-based access enforced

---

## 📱 RESPONSIVE DESIGN

### Mobile (< 768px)
- [ ] Notification panel works on mobile
- [ ] Text sizes readable
- [ ] Touch targets large enough
- [ ] History page responsive
- [ ] Preferences page responsive
- [ ] No horizontal scrolling

### Tablet (768px - 1024px)
- [ ] All layouts optimized
- [ ] Content displays properly
- [ ] Navigation works smoothly

### Desktop (> 1024px)
- [ ] Full features visible
- [ ] Panels positioned correctly
- [ ] Pagination visible
- [ ] All buttons accessible

---

## ⚡ PERFORMANCE TESTING

### Load Time
- [ ] Notification panel opens < 1 second
- [ ] History page loads < 2 seconds
- [ ] Preferences page loads < 1 second
- [ ] Api responses < 500ms

### Database Performance
- [ ] Queries use indexes
- [ ] Pagination handles large datasets
- [ ] Unread count query is fast
- [ ] No N+1 query problems

### Frontend Performance
- [ ] No unnecessary re-renders
- [ ] Components load lazily
- [ ] Memory usage normal
- [ ] No memory leaks

---

## 🐛 ERROR HANDLING

### Graceful Error Messages
- [ ] 404 errors show friendly message
- [ ] 500 errors caught and displayed
- [ ] API errors shown to user
- [ ] No raw error traces visible

### Edge Cases
- [ ] Zero notifications handled
- [ ] Empty filters show message
- [ ] Failed API calls retry or show error
- [ ] Preference save failures handled
- [ ] Email send failures logged

---

## 📊 TESTING SUMMARY

### Backend Tests
- [ ] Run: `./mvnw test -Dtest=NotificationServiceTests`
- [ ] All tests passing
- [ ] Coverage > 80%
- [ ] No warnings

### Frontend Tests (Manual)
- [ ] All workflows tested
- [ ] No console errors
- [ ] No warnings
- [ ] Responsive design verified

### API Tests (Postman/curl)
- [ ] All 11 endpoints tested
- [ ] All HTTP methods work
- [ ] Error responses correct
- [ ] Status codes correct

---

## ✅ FINAL CHECKLIST

### Code Quality
- [ ] Code formatted consistently
- [ ] Comments/documentation complete
- [ ] No debug logs in production code
- [ ] No hardcoded values
- [ ] Constants defined properly

### Documentation
- [ ] API documentation complete
- [ ] Architecture diagrams included
- [ ] Integration examples provided
- [ ] Readme includes setup steps
- [ ] README includes all files created

### Git/Version Control
- [ ] All files committed
- [ ] Clear commit messages
- [ ] No uncommitted changes
- [ ] History shows individual work
- [ ] No binary files committed

### Submission Ready
- [ ] All features implemented
- [ ] No known bugs
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Ready for demo
- [ ] Ready for viva

---

## 📋 TESTING RECORD

**Tested By:** _________________  
**Date:** _________________________  
**Result:** ☐ PASS ☐ FAIL  

**Issues Found:**
- [ ] None
- [ ] Minor (if yes, list below):
  1. _______________________________
  2. _______________________________

**Notes:**
_________________________________
_________________________________
_________________________________

**Sign Off:** _____________________

---

**Remember:** Test thoroughly before submission!
