package backend.controller;

import backend.model.Resource;
import backend.service.CloudinaryService;
import backend.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;
    private final CloudinaryService cloudinaryService;

    public ResourceController(ResourceService resourceService, CloudinaryService cloudinaryService) {
        this.resourceService = resourceService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public Page<Resource> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status
    ) {
        Page<Resource> resources = resourceService.getAllResources(page, size, type, location, status);

        resources.getContent().forEach(resource -> {
            if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
                resource.setImagePublicId(cloudinaryService.getImageUrl(resource.getImagePublicId()));
            }
        });

        return resources;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            resource.setImagePublicId(cloudinaryService.getImageUrl(resource.getImagePublicId()));
        }

        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public Resource createResource(
            @RequestPart("resource") Resource resource,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        if (image != null && !image.isEmpty()) {
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
            String publicId = (String) uploadResult.get("public_id");
            resource.setImagePublicId(publicId);
        }

        Resource savedResource = resourceService.createResource(resource);

        if (savedResource.getImagePublicId() != null && !savedResource.getImagePublicId().isEmpty()) {
            savedResource.setImagePublicId(cloudinaryService.getImageUrl(savedResource.getImagePublicId()));
        }

        return savedResource;
    }

    @PostMapping("/simple")
    public Resource createResourceSimple(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
    public Resource updateResource(
            @PathVariable String id,
            @RequestPart("resource") Resource resourceUpdate,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Resource existing = resourceService.getResourceById(id);
        if (existing == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        existing.setName(resourceUpdate.getName());
        existing.setType(resourceUpdate.getType());
        existing.setLocation(resourceUpdate.getLocation());
        existing.setCapacity(resourceUpdate.getCapacity());
        existing.setStatus(resourceUpdate.getStatus());

        if (image != null && !image.isEmpty()) {
            if (existing.getImagePublicId() != null && !existing.getImagePublicId().isEmpty()) {
                try {
                    cloudinaryService.deleteImage(existing.getImagePublicId());
                } catch (IOException e) {
                    System.err.println("Warning: Failed to delete old image: " + e.getMessage());
                }
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
            String newPublicId = (String) uploadResult.get("public_id");
            existing.setImagePublicId(newPublicId);
        }

        Resource updatedResource = resourceService.updateResource(id, existing);

        if (updatedResource.getImagePublicId() != null && !updatedResource.getImagePublicId().isEmpty()) {
            updatedResource.setImagePublicId(cloudinaryService.getImageUrl(updatedResource.getImagePublicId()));
        }

        return updatedResource;
    }

    @PutMapping("/{id}/simple")
    public Resource updateResourceSimple(@PathVariable String id, @RequestBody Resource resourceUpdate) {
        Resource existing = resourceService.getResourceById(id);
        if (existing == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        existing.setName(resourceUpdate.getName());
        existing.setType(resourceUpdate.getType());
        existing.setLocation(resourceUpdate.getLocation());
        existing.setCapacity(resourceUpdate.getCapacity());
        existing.setStatus(resourceUpdate.getStatus());

        return resourceService.updateResource(id, existing);
    }

    @PostMapping("/{id}/upload-image")
    public Resource uploadResourceImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        Resource resource = resourceService.getResourceById(id);
        if (resource == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }

        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            try {
                cloudinaryService.deleteImage(resource.getImagePublicId());
            } catch (IOException e) {
                System.err.println("Warning: Failed to delete old image: " + e.getMessage());
            }
        }

        Map<String, Object> uploadResult = cloudinaryService.uploadImage(image, "resources", null);
        String publicId = (String) uploadResult.get("public_id");
        resource.setImagePublicId(publicId);

        Resource updatedResource = resourceService.updateResource(id, resource);

        if (updatedResource.getImagePublicId() != null && !updatedResource.getImagePublicId().isEmpty()) {
            updatedResource.setImagePublicId(cloudinaryService.getImageUrl(updatedResource.getImagePublicId()));
        }

        return updatedResource;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            try {
                cloudinaryService.deleteImage(resource.getImagePublicId());
            } catch (IOException e) {
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }

        resourceService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted successfully");
    }

    @GetMapping("/{id}/image-url")
    public ResponseEntity<String> getImageUrl(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        if (resource.getImagePublicId() != null && !resource.getImagePublicId().isEmpty()) {
            return ResponseEntity.ok(cloudinaryService.getImageUrl(resource.getImagePublicId()));
        }

        return ResponseEntity.ok("");
    }

    // GET all available resources (for ticket form selection and booking)
    @GetMapping("/available")
    public ResponseEntity<List<Resource>> getAvailableResources() {
        List<Resource> availableResources = resourceService.getAvailableResources();
        return ResponseEntity.ok(availableResources);
    }
}