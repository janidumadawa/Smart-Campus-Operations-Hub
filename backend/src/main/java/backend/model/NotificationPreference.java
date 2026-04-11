package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notification_preferences")
public class NotificationPreference {

    @Id
    private String id;

    private String userId;
    private boolean bookingAlerts;      // Enable/disable booking notifications
    private boolean ticketUpdates;      // Enable/disable ticket notifications
    private boolean emailNotifications; // Enable/disable email notifications
    private boolean commentNotifications; // Enable/disable comment notifications

    // Constructors
    public NotificationPreference() {}

    public NotificationPreference(String userId) {
        this.userId = userId;
        this.bookingAlerts = true;
        this.ticketUpdates = true;
        this.emailNotifications = true;
        this.commentNotifications = true;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isBookingAlerts() {
        return bookingAlerts;
    }

    public void setBookingAlerts(boolean bookingAlerts) {
        this.bookingAlerts = bookingAlerts;
    }

    public boolean isTicketUpdates() {
        return ticketUpdates;
    }

    public void setTicketUpdates(boolean ticketUpdates) {
        this.ticketUpdates = ticketUpdates;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isCommentNotifications() {
        return commentNotifications;
    }

    public void setCommentNotifications(boolean commentNotifications) {
        this.commentNotifications = commentNotifications;
    }
}
