package backend.service;

import backend.enums.NotificationType;
import backend.enums.NotificationCategory;
import backend.model.NotificationPreference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * EXAMPLE: How to integrate notifications into BookingService
 * 
 * This shows how to trigger notifications when booking events occur.
 * Apply similar logic to your TicketService and CommentService
 */

@Service
public class BookingServiceWithNotifications {

    @Autowired
    private NotificationHelper notificationHelper;
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Example: Called when admin approves a booking
     */
    public void approveBooking(String bookingId, String userId, String resourceName) {
        // ... existing booking approval logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerBookingApproved(userId, bookingId, resourceName);
        
        // Also send email if enabled
        // Automatically done in NotificationServiceImpl
    }

    /**
     * Example: Called when admin rejects a booking
     */
    public void rejectBooking(String bookingId, String userId, String resourceName, String reason) {
        // ... existing booking rejection logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerBookingRejected(userId, bookingId, resourceName, reason);
    }

    /**
     * Example: Called when a booking is cancelled
     */
    public void cancelBooking(String bookingId, String userId, String resourceName) {
        // ... existing cancellation logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerBookingCancelled(userId, bookingId, resourceName);
    }

    /**
     * Example: Check if user wants these notifications
     * (Optional - NotificationService already checks this)
     */
    public boolean shouldNotifyUser(String userId) {
        NotificationPreference pref = notificationService.getUserPreferences(userId);
        return pref.isBookingAlerts();
    }

    /**
     * Example: Send custom notification
     */
    public void sendCustomNotification(String userId, String title, String message) {
        notificationService.createNotification(
            userId,
            NotificationType.BOOKING_APPROVED,
            NotificationCategory.BOOKING,
            title,
            message,
            "booking_123",
            "BOOKING"
        );
    }
}

/**
 * EXAMPLE 2: How to integrate with TicketService
 */
@Service
class TicketServiceWithNotifications {

    @Autowired
    private NotificationHelper notificationHelper;

    public void createTicket(String ticketId, String userId, String category) {
        // ... create ticket logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerTicketCreated(userId, ticketId, category);
    }

    public void assignTicket(String ticketId, String userId, String technicianName) {
        // ... assign ticket logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerTicketAssigned(userId, ticketId, technicianName);
    }

    public void updateTicketStatus(String ticketId, String userId, String newStatus) {
        // ... update status logic ...
        
        // Based on status, trigger appropriate notification
        if ("IN_PROGRESS".equals(newStatus)) {
            notificationHelper.triggerTicketInProgress(userId, ticketId);
        } else if ("RESOLVED".equals(newStatus)) {
            notificationHelper.triggerTicketResolved(userId, ticketId, "Issue has been resolved");
        } else if ("CLOSED".equals(newStatus)) {
            notificationHelper.triggerTicketClosed(userId, ticketId);
        } else if ("REJECTED".equals(newStatus)) {
            notificationHelper.triggerTicketRejected(userId, ticketId, "Not enough information provided");
        }
    }
}

/**
 * EXAMPLE 3: How to integrate with CommentService
 */
@Service
class CommentServiceWithNotifications {

    @Autowired
    private NotificationHelper notificationHelper;

    public void addComment(String commentId, String userId, String ticketId, String commenterName) {
        // ... add comment logic ...
        
        // TRIGGER NOTIFICATION - Everyone who follows this ticket gets notified
        // (You may need to get all followers from ticket owner, technician, etc.)
        
        notificationHelper.triggerCommentAdded(userId, ticketId, commenterName, "TICKET");
    }

    public void replyToComment(String replyId, String userId, String ticketId, String replierName) {
        // ... add reply logic ...
        
        // TRIGGER NOTIFICATION
        notificationHelper.triggerCommentReplied(userId, ticketId, replierName, "TICKET");
    }
}

/**
 * STEP-BY-STEP INTEGRATION GUIDE
 * 
 * 1. Add @Autowired NotificationHelper to your service:
 *    @Autowired
 *    private NotificationHelper notificationHelper;
 * 
 * 2. Call the appropriate trigger method:
 *    notificationHelper.triggerBookingApproved(userId, bookingId, resourceName);
 * 
 * 3. That's it! The notification will be:
 *    - Created in the database
 *    - Checked against user preferences
 *    - Sent via email (if enabled)
 *    - Displayed in the frontend notification panel
 * 
 * 4. Test by:
 *    - Create a booking/ticket
 *    - Check the notification bell in navbar
 *    - Verify it appears in notification history
 *    - Check email if configured
 */

/**
 * NOTIFICATION TYPES AVAILABLE
 * 
 * BOOKING NOTIFICATIONS:
 * - NotificationType.BOOKING_APPROVED
 * - NotificationType.BOOKING_REJECTED
 * - NotificationType.BOOKING_CANCELLED
 * 
 * TICKET NOTIFICATIONS:
 * - NotificationType.TICKET_CREATED
 * - NotificationType.TICKET_ASSIGNED
 * - NotificationType.TICKET_IN_PROGRESS
 * - NotificationType.TICKET_RESOLVED
 * - NotificationType.TICKET_CLOSED
 * - NotificationType.TICKET_REJECTED
 * 
 * COMMENT NOTIFICATIONS:
 * - NotificationType.COMMENT_ADDED
 * - NotificationType.COMMENT_REPLIED
 * 
 * CATEGORIES:
 * - NotificationCategory.BOOKING
 * - NotificationCategory.TICKET
 * - NotificationCategory.SYSTEM
 */
