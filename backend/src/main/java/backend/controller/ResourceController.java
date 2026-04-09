package backend.controller;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // ✅ GET all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceRepository.findAll());
    }

    // ✅ ADD THIS (IMPORTANT)
    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return new ResponseEntity<>(resourceRepository.save(resource), HttpStatus.CREATED);
    }
}