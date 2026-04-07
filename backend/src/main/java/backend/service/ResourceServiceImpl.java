// backend\src\main\java\backend\service\ResourceServiceImpl.java
package backend.service;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public Page<Resource> getAllResources(int page, int size, String type, String location) {

        PageRequest pageable = PageRequest.of(page, size);

        // For now: simple pagination (no filters yet)
        return resourceRepository.findAll(pageable);
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }
}