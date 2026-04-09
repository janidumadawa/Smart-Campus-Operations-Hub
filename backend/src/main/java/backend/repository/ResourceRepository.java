package backend.repository;

import backend.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    Page<Resource> findByType(String type, Pageable pageable);
    Page<Resource> findByStatus(String status, Pageable pageable);
    Page<Resource> findByTypeAndStatus(String type, String status, Pageable pageable);
    Page<Resource> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
        String name, String location, Pageable pageable);
}