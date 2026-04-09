// backend\src\main\java\backend\service\ResourceServiceImpl.java
package backend.service;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

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
        if (id == null) return null;
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public Resource createResource(Resource resource) {
        if (resource == null) return null;
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAvailableResources() {
        return resourceRepository.findByStatus("AVAILABLE", null).getContent();
    }

    @Override
    public Resource updateResource(String id, Resource resource) {
        if (id == null || resource == null) return null;
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
        if (id == null) return;
        resourceRepository.deleteById(id);
    }

    /**
     * Upload an image for a resource to Cloudinary
     * @param id the resource ID
     * @param image the image file to upload
     * @return the updated resource with imagePublicId set
     * @throws IOException if upload fails
     */
    public Resource uploadResourceImage(String id, MultipartFile image) throws IOException {
        Resource resource = getResourceById(id);
        if (resource == null) {
            throw new IllegalArgumentException("Resource not found with id: " + id);
        }

        // Delete old image if it exists
        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            try {
                cloudinaryService.deleteImage(resource.getImagePublicId());
            } catch (IOException e) {
                // Log but don't fail if old image deletion fails
                System.err.println("Warning: Failed to delete old image: " + e.getMessage());
            }
        }

        // Upload new image to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
        
        String publicId = (String) uploadResult.get("public_id");
        resource.setImagePublicId(publicId);

        return resourceRepository.save(resource);
    }
}