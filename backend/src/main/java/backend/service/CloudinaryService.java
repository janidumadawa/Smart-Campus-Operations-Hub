// backend\src\main\java\backend\service\CloudinaryService.java
package backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    @Autowired
    private Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file, String folderName) throws IOException {
        try {
            logger.info("Starting image upload to folder: {}", folderName);
            logger.info("File name: {}, Size: {} bytes", file.getOriginalFilename(), file.getSize());
            
            if (cloudinary == null) {
                logger.error("Cloudinary bean is null!");
                throw new RuntimeException("Cloudinary service not initialized");
            }
            
            File uploadedFile = convertMultiPartToFile(file);
            
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", folderName,
                "use_filename", true,
                "unique_filename", true
            );
            
            logger.info("Uploading to Cloudinary...");
            Map<String, Object> uploadResult = cloudinary.uploader().upload(uploadedFile, uploadParams);
            
            logger.info("Upload successful! Public ID: {}", uploadResult.get("public_id"));
            
            // Clean up temp file
            uploadedFile.delete();
            
            return uploadResult;
        } catch (Exception e) {
            logger.error("Error uploading to Cloudinary: {}", e.getMessage(), e);
            throw new IOException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }
    
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}