// backend\src\main\java\backend\service\ResourceService.java
package backend.service;

import backend.model.Resource;
import org.springframework.data.domain.Page;

public interface ResourceService {

    Page<Resource> getAllResources(int page, int size, String type, String location, String status);

    Resource getResourceById(String id);

    Resource createResource(Resource resource);

    Resource updateResource(String id, Resource resource);

    void deleteResource(String id);
}