// backend\src\main\java\backend\controller\ResourceController.java
package backend.controller;

import backend.model.Resource;
import backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

    // UPLOAD image for a resource
    @PostMapping("/{id}/upload-image")
    public Resource uploadResourceImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image) throws IOException {
        
        System.out.println("Upload image request received for resource: " + id);
        
        // TODO: Implement image upload logic without Cloudinary
        // For now, just return the existing resource
        Resource resource = resourceService.getResourceById(id);
        if (resource == null) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        
        return resource;
    }

    // Create sample resources
    @PostMapping("/sample")
    public String createSampleResources() {
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