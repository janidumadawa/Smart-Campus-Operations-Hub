// backend\src\main\java\backend\service\ResourceServiceImpl.java
package backend.service;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    private final CloudinaryService cloudinaryService;

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

    @Override
    public List<Resource> getAvailableResources() {
        return resourceRepository.findByStatus("AVAILABLE");
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