package backend.controller;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // ✅ GET all resources
    @GetMapping
    public Page<Resource> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {

        Page<Resource> resources = resourceService.getAllResources(page, size, type, location, status);

        // Convert imagePublicId to full URL for each resource
        resources.getContent().forEach(resource -> {
            if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
                String imageUrl = cloudinaryService.getImageUrl(resource.getImagePublicId());
                resource.setImagePublicId(imageUrl);
            }
        });

        return resources;
    }

    // ✅ ADD THIS (IMPORTANT)
    @PostMapping
    public Resource createResource(
            @RequestPart("resource") Resource resource,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        if (image != null && !image.isEmpty()) {
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
            String publicId = (String) uploadResult.get("public_id");
            resource.setImagePublicId(publicId);
        }

        Resource savedResource = resourceService.createResource(resource);

        // Return with full URL
        if (savedResource.getImagePublicId() != null && !savedResource.getImagePublicId().isEmpty()) {
            savedResource.setImagePublicId(cloudinaryService.getImageUrl(savedResource.getImagePublicId()));
        }

        return savedResource;
    }

    // CREATE without image (for simple JSON requests)
    @PostMapping("/simple")
    public Resource createResourceSimple(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // UPDATE resource with optional image
    @PutMapping("/{id}")
    public Resource updateResource(
            @PathVariable String id,
            @RequestPart("resource") Resource resourceUpdate,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        Resource existing = resourceService.getResourceById(id);
        if (existing == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        // Update fields from request
        existing.setName(resourceUpdate.getName());
        existing.setType(resourceUpdate.getType());
        existing.setLocation(resourceUpdate.getLocation());
        existing.setCapacity(resourceUpdate.getCapacity());
        existing.setStatus(resourceUpdate.getStatus());

        // Handle image update
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (existing.getImagePublicId() != null && !existing.getImagePublicId().isEmpty()) {
                try {
                    cloudinaryService.deleteImage(existing.getImagePublicId());
                } catch (IOException e) {
                    System.err.println("Warning: Failed to delete old image: " + e.getMessage());
                }
            }
            // Upload new image
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
            String newPublicId = (String) uploadResult.get("public_id");
            existing.setImagePublicId(newPublicId);
        }
        // If no new image, keep the existing imagePublicId

        Resource updatedResource = resourceService.updateResource(id, existing);

        // Return with full URL
        if (updatedResource.getImagePublicId() != null && !updatedResource.getImagePublicId().isEmpty()) {
            updatedResource.setImagePublicId(cloudinaryService.getImageUrl(updatedResource.getImagePublicId()));
        }

        return updatedResource;
    }

    // UPDATE without image (for simple JSON requests)
    @PutMapping("/{id}/simple")
    public Resource updateResourceSimple(@PathVariable String id, @RequestBody Resource resourceUpdate) {
        Resource existing = resourceService.getResourceById(id);
        if (existing == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        // Update fields but keep existing image
        existing.setName(resourceUpdate.getName());
        existing.setType(resourceUpdate.getType());
        existing.setLocation(resourceUpdate.getLocation());
        existing.setCapacity(resourceUpdate.getCapacity());
        existing.setStatus(resourceUpdate.getStatus());
        // Keep existing imagePublicId

        return resourceService.updateResource(id, existing);
    }

    // UPLOAD image for existing resource
    @PostMapping("/{id}/upload-image")
    public Resource uploadResourceImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image) throws IOException {

        Resource resource = resourceService.getResourceById(id);
        if (resource == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        // Delete old image if exists
        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            try {
                cloudinaryService.deleteImage(resource.getImagePublicId());
            } catch (IOException e) {
                System.err.println("Warning: Failed to delete old image: " + e.getMessage());
            }
        }

        // Upload new image
        Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
        String publicId = (String) uploadResult.get("public_id");
        resource.setImagePublicId(publicId);

        Resource updatedResource = resourceService.updateResource(id, resource);

        // Return with full URL
        if (updatedResource.getImagePublicId() != null && !updatedResource.getImagePublicId().isEmpty()) {
            updatedResource.setImagePublicId(cloudinaryService.getImageUrl(updatedResource.getImagePublicId()));
        }

        return updatedResource;
    }

    // DELETE resource
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource != null && resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            try {
                cloudinaryService.deleteImage(resource.getImagePublicId());
            } catch (IOException e) {
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }
        resourceService.deleteResource(id);
    }

    // GET image URL
    @GetMapping("/{id}/image-url")
    public String getImageUrl(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource != null && resource.getImagePublicId() != null) {
            return cloudinaryService.getImageUrl(resource.getImagePublicId());
        }
        return null;
    }
}