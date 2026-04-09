package backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for handling Cloudinary image uploads and deletions.
 * Centralizes all Cloudinary operations for resources and ticket attachments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    @Value("${cloudinary.url:}")
    private String cloudinaryUrl;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    /**
     * Upload an image file to Cloudinary
     * @param file the image file to upload
     * @param folder the folder in Cloudinary to store the image (e.g., "resources" or "tickets")
     * @param publicId optional public ID for the resource (if null, Cloudinary will generate one)
     * @return a map containing upload response with public_id and secure_url
     * @throws IOException if upload fails
     */
    public Map<String, Object> uploadImage(MultipartFile file, String folder, String publicId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try {
            log.info("Starting Cloudinary upload for file: {} to folder: {}", file.getOriginalFilename(), folder);
            
            // Initialize Cloudinary with credentials
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
            ));
            
            log.debug("Cloudinary initialized with cloud_name: {}", cloudName);

            // Upload parameters
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "resource_type", "auto",
                "overwrite", true
            );
            
            // Set folder path for organization
            if (folder != null && !folder.isEmpty()) {
                uploadParams.put("folder", folder);
            }
            
            log.debug("Upload parameters: folder={}, publicId={}", folder, publicId);
            
            // Upload the file
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            String resultPublicId = (String) uploadResult.get("public_id");
            String resultSecureUrl = (String) uploadResult.get("secure_url");
            
            log.info("✓ Cloudinary upload successful! Public ID: {}, Secure URL: {}", resultPublicId, resultSecureUrl);

            // Extract the result and return standardized format
            Map<String, Object> result = new HashMap<>();
            result.put("public_id", resultPublicId);
            result.put("secure_url", resultSecureUrl);
            result.put("url", uploadResult.get("url"));
            result.put("format", uploadResult.get("format"));
            result.put("resource_type", uploadResult.get("resource_type"));

            return result;
        } catch (Exception e) {
            log.error("✗ Failed to upload image to Cloudinary: {}", e.getMessage(), e);
            throw new IOException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Delete an image from Cloudinary by its public ID
     * @param publicId the public ID of the image to delete
     * @throws IOException if deletion fails
     */
    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isEmpty()) {
            throw new IllegalArgumentException("Public ID cannot be empty");
        }
        
        try {
            log.info("Deleting image from Cloudinary: {}", publicId);
            
            // Initialize Cloudinary with credentials
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
            ));
            
            // Delete the resource
            Map deleteResult = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            
            log.info("✓ Cloudinary deletion successful. Result: {}", deleteResult.get("result"));
        } catch (Exception e) {
            log.error("✗ Failed to delete image from Cloudinary: {}", publicId, e);
        }
    }

    /**
     * Generate a secure URL for a Cloudinary image
     * @param publicId the public ID of the image
     * @return secure HTTPS URL to the image
     */
    public String getImageUrl(String publicId) {
        if (publicId == null || publicId.isEmpty()) {
            return null;
        }
        return "https://res.cloudinary.com/" + cloudName + "/image/upload/" + publicId;
    }

    /**
     * Generate a transformed URL for a Cloudinary image
     * @param publicId the public ID of the image
     * @param width desired width (0 for no constraint)
     * @param height desired height (0 for no constraint)
     * @param quality quality setting (e.g., "auto", 80, 90)
     * @return secure HTTPS URL to the transformed image
     */
    public String getTransformedImageUrl(String publicId, int width, int height, String quality) {
        if (publicId == null || publicId.isEmpty()) {
            return null;
        }

        StringBuilder transformations = new StringBuilder();

        if (width > 0 || height > 0) {
            if (width > 0) {
                transformations.append("w_").append(width);
            }
            if (height > 0) {
                if (transformations.length() > 0) transformations.append(",");
                transformations.append("h_").append(height);
            }
            transformations.append(",c_scale/");
        }

        if (quality != null && !quality.isEmpty()) {
            transformations.append("q_").append(quality).append("/");
        }

        String transform = transformations.toString();
        if (!transform.isEmpty()) {
            return "https://res.cloudinary.com/" + cloudName + "/image/upload/" + transform + publicId;
        }

        return getImageUrl(publicId);
    }
}
