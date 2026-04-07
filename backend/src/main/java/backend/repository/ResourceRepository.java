// backend\src\main\java\backend\repository\ResourceRepository.java
package backend.repository;

import backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

}