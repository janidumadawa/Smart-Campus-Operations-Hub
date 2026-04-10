package backend.repository;

import backend.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    Page<Resource> findByType(String type, Pageable pageable);
    
    Page<Resource> findByStatus(String status, Pageable pageable);
    
    Page<Resource> findByTypeAndStatus(String type, String status, Pageable pageable);
    
    Page<Resource> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // For getAvailableResources (no pagination needed)
    List<Resource> findByStatus(String status);
}