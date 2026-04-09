// backend\src\main\java\backend\repository\ResourceRepository.java
package backend.repository;

import backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    /**
     * Find all resources with a specific status
     * @param status the status to filter by (e.g., "AVAILABLE", "OUT_OF_SERVICE")
     * @return list of resources matching the status
     */
    List<Resource> findByStatus(String status);
}