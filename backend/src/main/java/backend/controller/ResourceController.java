// backend\src\main\java\backend\controller\ResourceController.java
package backend.controller;

import backend.model.Resource;
import backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // GET all resources with pagination
    @GetMapping
    public Page<Resource> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location) {
        return resourceService.getAllResources(page, size, type, location);
    }

    // GET all available resources (for ticket form selection)
    @GetMapping("/available")
    public ResponseEntity<List<Resource>> getAvailableResources() {
        List<Resource> availableResources = resourceService.getAvailableResources();
        return ResponseEntity.ok(availableResources);
    }

    // GET resource by ID
    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    // CREATE new resource
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // UPLOAD image for a resource to Cloudinary
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, Object>> uploadResourceImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image) {
        
        try {
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Image file is required"));
            }

            Resource updatedResource = resourceService.uploadResourceImage(id, image);
            
            return ResponseEntity.ok(Map.of(
                "message", "Image uploaded successfully",
                "resourceId", updatedResource.getId(),
                "imagePublicId", updatedResource.getImagePublicId(),
                "imageUrl", updatedResource.getImageUrl()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    // Create sample resources (for development/testing only)
    @PostMapping("/sample")
    public String createSampleResources() {
        // NOTE: This endpoint is for testing only
        // In production, use the POST /resources endpoint with proper data
        Resource room1 = new Resource("Conference Room A", "ROOM", "Building 1, Floor 2", 20, "AVAILABLE", 
            "sample/conference-room-a");
        Resource room2 = new Resource("Meeting Room B", "ROOM", "Building 2, Floor 1", 10, "AVAILABLE",
            "sample/meeting-room-b");
        Resource projector = new Resource("HD Projector", "EQUIPMENT", "Media Center", 1, "AVAILABLE",
            "sample/projector");
        
        resourceService.createResource(room1);
        resourceService.createResource(room2);
        resourceService.createResource(projector);
        
        return "Sample resources created with image references!";
    }
}