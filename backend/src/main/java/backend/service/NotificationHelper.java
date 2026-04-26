package backend.service;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Helper class to trigger notifications from other services
 * Usage: NotificationHelper.triggerBookingApproved(notificationService, userId, bookingId)
 */
@Component
public class NotificationHelper {

    @Autowired
    private NotificationService notificationService;

    // ===== BOOKING NOTIFICATIONS =====

    public void triggerBookingApproved(String userId, String bookingId, String resourceName) {
        notificationService.createNotification(
            userId,
            NotificationType.BOOKING_APPROVED,
            NotificationCategory.BOOKING,
            "Booking Approved",
            "Your booking for " + resourceName + " has been approved. You can now proceed with the booking.",
            bookingId,
            "BOOKING"
        );
    }

    public void triggerBookingRejected(String userId, String bookingId, String resourceName, String reason) {
        notificationService.createNotification(
            userId,
            NotificationType.BOOKING_REJECTED,
            NotificationCategory.BOOKING,
            "Booking Rejected",
            "Your booking for " + resourceName + " has been rejected. Reason: " + reason,
            bookingId,
            "BOOKING"
        );
    }

    public void triggerBookingCancelled(String userId, String bookingId, String resourceName) {
        notificationService.createNotification(
            userId,
            NotificationType.BOOKING_CANCELLED,
            NotificationCategory.BOOKING,
            "Booking Cancelled",
            "Your booking for " + resourceName + " has been cancelled.",
            bookingId,
            "BOOKING"
        );
    }

    // ===== TICKET NOTIFICATIONS =====

    public void triggerTicketCreated(String userId, String ticketId, String category) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_CREATED,
            NotificationCategory.TICKET,
            "Ticket Created",
            "Your support ticket #" + ticketId + " has been created successfully.",
            ticketId,
            "TICKET"
        );
    }

    public void triggerTicketAssigned(String userId, String ticketId, String technicianName) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_ASSIGNED,
            NotificationCategory.TICKET,
            "Ticket Assigned",
            "Your ticket #" + ticketId + " has been assigned to " + technicianName,
            ticketId,
            "TICKET"
        );
    }

    public void triggerTicketInProgress(String userId, String ticketId) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_IN_PROGRESS,
            NotificationCategory.TICKET,
            "Ticket In Progress",
            "Your ticket #" + ticketId + " is now being worked on.",
            ticketId,
            "TICKET"
        );
    }

    public void triggerTicketResolved(String userId, String ticketId, String resolutionNotes) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_RESOLVED,
            NotificationCategory.TICKET,
            "Ticket Resolved",
            "Your ticket #" + ticketId + " has been resolved. Notes: " + resolutionNotes,
            ticketId,
            "TICKET"
        );
    }

    public void triggerTicketClosed(String userId, String ticketId) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_CLOSED,
            NotificationCategory.TICKET,
            "Ticket Closed",
            "Your ticket #" + ticketId + " has been closed.",
            ticketId,
            "TICKET"
        );
    }

    public void triggerTicketRejected(String userId, String ticketId, String reason) {
        notificationService.createNotification(
            userId,
            NotificationType.TICKET_REJECTED,
            NotificationCategory.TICKET,
            "Ticket Rejected",
            "Your ticket #" + ticketId + " has been rejected. Reason: " + reason,
            ticketId,
            "TICKET"
        );
    }

    // ===== COMMENT NOTIFICATIONS =====

    public void triggerCommentAdded(String userId, String resourceId, String commenterName, String resourceType) {
        notificationService.createNotification(
            userId,
            NotificationType.COMMENT_ADDED,
            NotificationCategory.TICKET,
            "New Comment",
            commenterName + " added a comment to your " + resourceType.toLowerCase() + ".",
            resourceId,
            resourceType
        );
    }

    public void triggerCommentReplied(String userId, String resourceId, String replierName, String resourceType) {
        notificationService.createNotification(
            userId,
            NotificationType.COMMENT_REPLIED,
            NotificationCategory.TICKET,
            "Comment Reply",
            replierName + " replied to your comment on " + resourceType.toLowerCase() + ".",
            resourceId,
            resourceType
        );
    }
}
