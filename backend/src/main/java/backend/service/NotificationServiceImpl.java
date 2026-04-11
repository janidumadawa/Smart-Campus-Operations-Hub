package backend.service;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import backend.model.Notification;
import backend.model.NotificationPreference;
import backend.repository.NotificationRepository;
import backend.repository.NotificationPreferenceRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger = Logger.getLogger(NotificationServiceImpl.class.getName());

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Create a new notification if user has enabled notifications for this category
     */
    @Override
    public Notification createNotification(String recipientId, NotificationType type, NotificationCategory category,
                                          String title, String message, String relatedResourceId, String relatedResourceType) {
        
        // Resolve ID if email is provided
        final String resolvedId = resolveRecipientId(recipientId);
        
        // Check if user has enabled notifications for this category
        if (!isNotificationEnabledForUser(resolvedId, category)) {
            logger.info("Notification skipped: User " + resolvedId + " has disabled " + category + " notifications");
            return null;
        }

        Notification notification = new Notification(resolvedId, type, category, title, message, relatedResourceId, relatedResourceType);
        Notification savedNotification = notificationRepository.save(notification);
        
        logger.info("Notification created: " + savedNotification.getId());
        
        // Send email if enabled
        try {
            sendEmailNotificationAsync(savedNotification);
        } catch (Exception e) {
            logger.warning("Failed to send email notification: " + e.getMessage());
        }

        return savedNotification;
    }

    /**
     * Get paginated notifications for a user
     */
    @Override
    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(resolveRecipientId(userId), pageable);
    }

    /**
     * Get count of unread notifications
     */
    @Override
    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(resolveRecipientId(userId));
    }

    /**
     * Get list of unread notifications
     */
    @Override
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(resolveRecipientId(userId));
    }

    /**
     * Mark a notification as read
     */
    @Override
    public Notification markAsRead(String notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            Notification n = notification.get();
            n.setRead(true);
            return notificationRepository.save(n);
        }
        throw new RuntimeException("Notification not found with ID: " + notificationId);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(resolveRecipientId(userId));
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Mark a notification as unread
     */
    @Override
    public Notification markAsUnread(String notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            Notification n = notification.get();
            n.setRead(false);
            return notificationRepository.save(n);
        }
        throw new RuntimeException("Notification not found with ID: " + notificationId);
    }

    /**
     * Get notifications filtered by category
     */
    @Override
    public List<Notification> getNotificationsByCategory(String userId, NotificationCategory category) {
        return notificationRepository.findByRecipientIdAndCategoryOrderByCreatedAtDesc(resolveRecipientId(userId), category);
    }

    /**
     * Delete a notification
     */
    @Override
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
        logger.info("Notification deleted: " + notificationId);
    }

    /**
     * Get notification by ID
     */
    @Override
    public Optional<Notification> getNotificationById(String notificationId) {
        return notificationRepository.findById(notificationId);
    }

    /**
     * Get or create notification preferences for a user
     */
    @Override
    public NotificationPreference getOrCreatePreferences(String userId) {
        String resolvedId = resolveRecipientId(userId);
        Optional<NotificationPreference> existing = preferenceRepository.findByUserId(resolvedId);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        NotificationPreference newPreference = new NotificationPreference(resolvedId);
        return preferenceRepository.save(newPreference);
    }

    /**
     * Update notification preferences for a user
     */
    @Override
    public NotificationPreference updatePreferences(String userId, NotificationPreference preferences) {
        NotificationPreference existing = getOrCreatePreferences(userId);
        
        // Ensure userId is preserved and correct
        existing.setUserId(userId);
        existing.setBookingAlerts(preferences.isBookingAlerts());
        existing.setTicketUpdates(preferences.isTicketUpdates());
        existing.setEmailNotifications(preferences.isEmailNotifications());
        existing.setCommentNotifications(preferences.isCommentNotifications());
        
        try {
            return preferenceRepository.save(existing);
        } catch (Exception e) {
            logger.severe("Failed to save preferences for user " + userId + ": " + e.getMessage());
            throw new RuntimeException("Could not save preferences: " + e.getMessage());
        }
    }

    /**
     * Get user notification preferences
     */
    @Override
    public NotificationPreference getUserPreferences(String userId) {
        return getOrCreatePreferences(userId);
    }

    /**
     * Send email notification (async)
     */
    @Override
    public void sendEmailNotification(String notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            sendEmailNotificationAsync(notification.get());
        }
    }

    /**
     * Internal method to send email asynchronously
     */
    private void sendEmailNotificationAsync(Notification notification) {
        if (mailSender == null) {
            logger.warning("JavaMailSender not configured. Skipping email notification.");
            return;
        }

        try {
            NotificationPreference preferences = getOrCreatePreferences(notification.getRecipientId());
            
            if (!preferences.isEmailNotifications()) {
                logger.info("User has disabled email notifications");
                return;
            }

            // In production, you would fetch the user's email from User entity
            // For now, this is a placeholder
            String recipientEmail = getEmailForUser(notification.getRecipientId());
            if (recipientEmail == null || recipientEmail.isEmpty()) {
                logger.warning("User email not found");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("[Campus Hub] " + notification.getTitle());
            message.setText(notification.getMessage() + "\n\nPlease log in to the application for more details.");
            message.setFrom("noreply@campushub.com");

            mailSender.send(message);
            
            // Mark email as sent
            notification.setEmailSent(true);
            notificationRepository.save(notification);
            
            logger.info("Email sent to " + recipientEmail);
        } catch (Exception e) {
            logger.warning("Error sending email: " + e.getMessage());
        }
    }

    /**
     * Check if notification is enabled for user
     */
    @Override
    public boolean isNotificationEnabledForUser(String userId, NotificationCategory category) {
        NotificationPreference preferences = getOrCreatePreferences(userId);
        
        switch (category) {
            case BOOKING:
                return preferences.isBookingAlerts();
            case TICKET:
                return preferences.isTicketUpdates();
            case SYSTEM:
                return true; // System notifications are always enabled
            default:
                return true;
        }
    }

    /**
     * Placeholder: Get email for user (integrate with User entity later)
     */
    private String getEmailForUser(String userId) {
        return userRepository.findById(userId)
                .map(backend.model.User::getEmail)
                .orElse(null);
    }

    /**
     * Resolve userId from email if necessary
     */
    private String resolveRecipientId(String userId) {
        if (userId == null) return null;
        if (userId.contains("@")) {
            return userRepository.findByEmail(userId)
                    .map(backend.model.User::getId)
                    .orElse(userId); // Fallback to email if user not found (unlikely)
        }
        return userId;
    }

    /**
     * Clean up old notifications (optional scheduled task)
     */
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        long deletedCount = notificationRepository.deleteByCreatedAtBefore(cutoffDate);
        logger.info("Deleted " + deletedCount + " old notifications");
    }
}
