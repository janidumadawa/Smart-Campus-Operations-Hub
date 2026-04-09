package backend.repository;

import backend.model.NotificationPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends MongoRepository<NotificationPreference, String> {

    // Find preferences by user ID
    Optional<NotificationPreference> findByUserId(String userId);

    // Check if user preferences exist
    boolean existsByUserId(String userId);
}
