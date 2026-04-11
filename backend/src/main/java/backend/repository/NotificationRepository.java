package backend.repository;

import backend.enums.NotificationCategory;
import backend.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Find all notifications for a specific user
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);

    // Find paginated notifications for a user
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId, Pageable pageable);

    // Find unread notifications for a user
    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(String recipientId);

    // Count unread notifications for a user
    long countByRecipientIdAndReadFalse(String recipientId);

    // Find notifications by category
    List<Notification> findByRecipientIdAndCategoryOrderByCreatedAtDesc(String recipientId, NotificationCategory category);

    // Find notifications for a specific resource
    List<Notification> findByRelatedResourceIdOrderByCreatedAtDesc(String relatedResourceId);

    // Find notifications created after a specific date
    List<Notification> findByRecipientIdAndCreatedAtAfterOrderByCreatedAtDesc(String recipientId, LocalDateTime dateTime);

    // Find notifications not yet sent via email
    List<Notification> findByRecipientIdAndEmailSentFalse(String recipientId);

    // Delete notifications older than a specific date
    long deleteByCreatedAtBefore(LocalDateTime dateTime);
}
