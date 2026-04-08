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
public Page<Resource> getAllResources(int page, int size, String type, String location, String status) {
    PageRequest pageable = PageRequest.of(page, size);
    
    // If search term is provided, search in both name and location
    if (location != null && !location.isEmpty()) {
        // Search in name OR location
        return resourceRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
            location, location, pageable);
    }
    
    // Apply type and status filters
    if (type != null && !type.isEmpty() && status != null && !status.isEmpty()) {
        return resourceRepository.findByTypeAndStatus(type, status, pageable);
    } else if (type != null && !type.isEmpty()) {
        return resourceRepository.findByType(type, pageable);
    } else if (status != null && !status.isEmpty()) {
        return resourceRepository.findByStatus(status, pageable);
    }
    
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

    @Override
    public Resource updateResource(String id, Resource resource) {
        Resource existing = resourceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        existing.setName(resource.getName());
        existing.setType(resource.getType());
        existing.setLocation(resource.getLocation());
        existing.setCapacity(resource.getCapacity());
        existing.setStatus(resource.getStatus());
        existing.setImagePublicId(resource.getImagePublicId());
        
        return resourceRepository.save(existing);
    }

    @Override
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}