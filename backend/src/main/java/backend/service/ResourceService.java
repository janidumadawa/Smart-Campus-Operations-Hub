// backend\src\main\java\backend\service\ResourceService.java
package backend.service;

import backend.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ResourceService {

    Page<Resource> getAllResources(int page, int size, String type, String location);

    Resource getResourceById(String id);

    Resource createResource(Resource resource);

    /**
     * Get all resources with AVAILABLE status
     * @return list of available resources
     */
    List<Resource> getAvailableResources();

    /**
     * Upload an image for a resource to Cloudinary
     * @param id the resource ID
     * @param image the image file to upload
     * @return the updated resource
     * @throws IOException if upload fails
     */
    Resource uploadResourceImage(String id, MultipartFile image) throws IOException;

}