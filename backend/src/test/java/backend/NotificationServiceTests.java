package backend;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import backend.model.Notification;
import backend.model.NotificationPreference;
import backend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class NotificationServiceTests {

    @Autowired
    private NotificationService notificationService;

    private String testUserId = "test_user_123";
    private String testNotificationId;

    @BeforeEach
    public void setUp() {
        // Create a test notification
        Notification notification = notificationService.createNotification(
            testUserId,
            NotificationType.BOOKING_APPROVED,
            NotificationCategory.BOOKING,
            "Test Booking Approved",
            "Your booking has been approved",
            "booking_123",
            "BOOKING"
        );
        if (notification != null) {
            testNotificationId = notification.getId();
        }
    }

    @Test
    public void testCreateNotification() {
        Notification notification = notificationService.createNotification(
            testUserId,
            NotificationType.TICKET_CREATED,
            NotificationCategory.TICKET,
            "Test Ticket Created",
            "Your ticket has been created",
            "ticket_123",
            "TICKET"
        );
        
        assertNotNull(notification);
        assertEquals(testUserId, notification.getRecipientId());
        assertEquals(NotificationType.TICKET_CREATED, notification.getType());
        assertEquals(NotificationCategory.TICKET, notification.getCategory());
        assertFalse(notification.isRead());
    }

    @Test
    public void testMarkNotificationAsRead() {
        Notification notification = notificationService.markAsRead(testNotificationId);
        
        assertTrue(notification.isRead());
    }

    @Test
    public void testMarkNotificationAsUnread() {
        // First mark as read
        notificationService.markAsRead(testNotificationId);
        
        // Then unread
        Notification notification = notificationService.markAsUnread(testNotificationId);
        
        assertFalse(notification.isRead());
    }

    @Test
    public void testGetUnreadCount() {
        long count = notificationService.getUnreadCount(testUserId);
        
        assertTrue(count >= 0);
        System.out.println("Unread count: " + count);
    }

    @Test
    public void testGetNotificationsByCategory() {
        var notifications = notificationService.getNotificationsByCategory(
            testUserId,
            NotificationCategory.BOOKING
        );
        
        assertNotNull(notifications);
        assertTrue(notifications.stream()
            .allMatch(n -> n.getCategory() == NotificationCategory.BOOKING));
    }

    @Test
    public void testGetOrCreatePreferences() {
        NotificationPreference preferences = notificationService.getOrCreatePreferences(testUserId);
        
        assertNotNull(preferences);
        assertEquals(testUserId, preferences.getUserId());
        assertTrue(preferences.isBookingAlerts());
        assertTrue(preferences.isTicketUpdates());
    }

    @Test
    public void testUpdatePreferences() {
        NotificationPreference newPrefs = new NotificationPreference();
        newPrefs.setBookingAlerts(false);
        newPrefs.setTicketUpdates(true);
        newPrefs.setEmailNotifications(false);
        
        NotificationPreference updated = notificationService.updatePreferences(testUserId, newPrefs);
        
        assertFalse(updated.isBookingAlerts());
        assertTrue(updated.isTicketUpdates());
        assertFalse(updated.isEmailNotifications());
    }

    @Test
    public void testIsNotificationEnabledForUser() {
        boolean enabled = notificationService.isNotificationEnabledForUser(testUserId, NotificationCategory.BOOKING);
        
        assertTrue(enabled);
    }

    @Test
    public void testDeleteNotification() {
        String idToDelete = testNotificationId;
        
        notificationService.deleteNotification(idToDelete);
        
        var deleted = notificationService.getNotificationById(idToDelete);
        assertFalse(deleted.isPresent());
    }

    @Test
    public void testMarkAllAsRead() {
        // Create multiple notifications
        notificationService.createNotification(
            testUserId,
            NotificationType.BOOKING_REJECTED,
            NotificationCategory.BOOKING,
            "Test 2",
            "Message 2",
            "booking_456",
            "BOOKING"
        );
        
        notificationService.createNotification(
            testUserId,
            NotificationType.TICKET_RESOLVED,
            NotificationCategory.TICKET,
            "Test 3",
            "Message 3",
            "ticket_456",
            "TICKET"
        );
        
        // Mark all as read
        notificationService.markAllAsRead(testUserId);
        
        // Verify all are read
        var unread = notificationService.getUnreadNotifications(testUserId);
        assertTrue(unread.isEmpty());
    }
}
