package backend.service;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import backend.model.Notification;
import backend.model.NotificationPreference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface NotificationService {

    // Create and save a notification
    Notification createNotification(String recipientId, NotificationType type, NotificationCategory category,
                                   String title, String message, String relatedResourceId, String relatedResourceType);

    // Get all notifications for a user (paginated)
    Page<Notification> getUserNotifications(String userId, Pageable pageable);

    // Get unread notifications count
    long getUnreadCount(String userId);

    // Get unread notifications
    List<Notification> getUnreadNotifications(String userId);

    // Mark notification as read
    Notification markAsRead(String notificationId);

    // Mark all notifications as read for a user
    void markAllAsRead(String userId);

    // Mark notification as unread
    Notification markAsUnread(String notificationId);

    // Get notifications by category
    List<Notification> getNotificationsByCategory(String userId, NotificationCategory category);

    // Delete a notification
    void deleteNotification(String notificationId);

    // Get notification by ID
    Optional<Notification> getNotificationById(String notificationId);

    // Notification preferences
    NotificationPreference getOrCreatePreferences(String userId);
    NotificationPreference updatePreferences(String userId, NotificationPreference preferences);
    NotificationPreference getUserPreferences(String userId);

    // Send email notification
    void sendEmailNotification(String notificationId);

    // Check if user prefers notifications for a category
    boolean isNotificationEnabledForUser(String userId, NotificationCategory category);
}
