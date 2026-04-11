package backend.controller;

import backend.enums.NotificationCategory;
import backend.enums.NotificationType;
import backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Debug controller to trigger test notifications
 * This is for testing purposes to "run the notification part"
 */
@RestController
@RequestMapping("/api/public")
public class NotificationDebugController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/test-notification/{userId}")
    public ResponseEntity<Map<String, Object>> triggerTestNotification(@PathVariable String userId) {
        notificationService.createNotification(
                userId,
                NotificationType.SYSTEM_ALERT,
                NotificationCategory.SYSTEM,
                "Test Notification",
                "Hello! This is a test notification to verify that the notification module is running correctly.",
                "test-123",
                "SYSTEM"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Test notification triggered for user: " + userId);
        return ResponseEntity.ok(response);
    }
}
