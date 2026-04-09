package backend.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for Cloudinary integration.
 * Contains settings for Cloudinary API credentials.
 * Properties are read from application.properties
 */
@Configuration
public class CloudinaryConfig {
    // Cloudinary configuration is loaded from application.properties:
    // cloudinary.url, cloudinary.cloud-name, cloudinary.api-key, cloudinary.api-secret
    // CloudinaryService will use these values via @Value annotations
}
