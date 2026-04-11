package backend.model;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String recipientId;  // User ID who receives the notification
    private String senderId;     // User ID who triggered the notification (optional)
    private NotificationType type;
    private NotificationCategory category;
    private String title;
    private String message;
    private String relatedResourceId;  // Booking ID, Ticket ID, etc.
    private String relatedResourceType; // BOOKING, TICKET
    private LocalDateTime createdAt;
    private boolean read;
    private boolean emailSent;

    // Constructors
    public Notification() {}

    public Notification(String recipientId, NotificationType type, NotificationCategory category, 
                       String title, String message, String relatedResourceId, String relatedResourceType) {
        this.recipientId = recipientId;
        this.type = type;
        this.category = category;
        this.title = title;
        this.message = message;
        this.relatedResourceId = relatedResourceId;
        this.relatedResourceType = relatedResourceType;
        this.createdAt = LocalDateTime.now();
        this.read = false;
        this.emailSent = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public NotificationCategory getCategory() {
        return category;
    }

    public void setCategory(NotificationCategory category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRelatedResourceId() {
        return relatedResourceId;
    }

    public void setRelatedResourceId(String relatedResourceId) {
        this.relatedResourceId = relatedResourceId;
    }

    public String getRelatedResourceType() {
        return relatedResourceType;
    }

    public void setRelatedResourceType(String relatedResourceType) {
        this.relatedResourceType = relatedResourceType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @JsonProperty("isRead")
    public boolean isRead() {
        return read;
    }

    @JsonProperty("isRead")
    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isEmailSent() {
        return emailSent;
    }

    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }
}
