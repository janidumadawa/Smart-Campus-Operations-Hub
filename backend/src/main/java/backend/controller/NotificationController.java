package backend.controller;

import backend.enums.NotificationCategory;
import backend.model.Notification;
import backend.model.NotificationPreference;
import backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * GET /api/notifications/{userId}
     * Get paginated notifications for a user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.getUserNotifications(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", notifications.getContent());
        response.put("totalPages", notifications.getTotalPages());
        response.put("totalElements", notifications.getTotalElements());
        response.put("currentPage", page);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/{userId}/unread
     * Get unread notifications for a user
     */
    @GetMapping("/{userId}/unread")
    public ResponseEntity<Map<String, Object>> getUnreadNotifications(@PathVariable String userId) {
        List<Notification> unreadNotifications = notificationService.getUnreadNotifications(userId);
        long unreadCount = notificationService.getUnreadCount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("unreadCount", unreadCount);
        response.put("notifications", unreadNotifications);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/{userId}/count
     * Get unread notification count
     */
    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@PathVariable String userId) {
        long count = notificationService.getUnreadCount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("unreadCount", count);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/{userId}/category/{category}
     * Get notifications by category
     */
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<Map<String, Object>> getNotificationsByCategory(
            @PathVariable String userId,
            @PathVariable String category) {
        
        try {
            NotificationCategory notifCategory = NotificationCategory.valueOf(category.toUpperCase());
            List<Notification> notifications = notificationService.getNotificationsByCategory(userId, notifCategory);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("notifications", notifications);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Invalid category: " + category);
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * GET /api/notifications/{notificationId}
     * Get a specific notification
     */
    @GetMapping("/detail/{notificationId}")
    public ResponseEntity<Map<String, Object>> getNotification(@PathVariable String notificationId) {
        Optional<Notification> notification = notificationService.getNotificationById(notificationId);
        
        if (notification.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", notification.get());
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Notification not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * PUT /api/notifications/{notificationId}/mark-as-read
     * Mark notification as read
     */
    @PutMapping("/{notificationId}/mark-as-read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable String notificationId) {
        try {
            Notification notification = notificationService.markAsRead(notificationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marked as read");
            response.put("data", notification);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * PUT /api/notifications/{notificationId}/mark-as-unread
     * Mark notification as unread
     */
    @PutMapping("/{notificationId}/mark-as-unread")
    public ResponseEntity<Map<String, Object>> markAsUnread(@PathVariable String notificationId) {
        try {
            Notification notification = notificationService.markAsUnread(notificationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marked as unread");
            response.put("data", notification);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * PUT /api/notifications/{userId}/mark-all-as-read
     * Mark all notifications as read for a user
     */
    @PutMapping("/{userId}/mark-all-as-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications marked as read");
        
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/notifications/{notificationId}
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable String notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * GET /api/notifications/preferences/{userId}
     * Get notification preferences for a user
     */
    @GetMapping("/preferences/{userId}")
    public ResponseEntity<Map<String, Object>> getPreferences(@PathVariable String userId) {
        NotificationPreference preferences = notificationService.getUserPreferences(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", preferences);
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/notifications/preferences/{userId}
     * Create or update notification preferences
     */
    @PostMapping("/preferences/{userId}")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            @PathVariable String userId,
            @RequestBody NotificationPreference preferenceRequest) {
        
        try {
            NotificationPreference updatedPreferences = notificationService.updatePreferences(userId, preferenceRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Preferences updated successfully");
            response.put("data", updatedPreferences);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
