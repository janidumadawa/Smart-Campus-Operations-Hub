package backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class CloudinaryConfig {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        logger.info("Cloudinary Config - Cloud Name: {}", cloudName);
        logger.info("Cloudinary Config - API Key: {}", apiKey != null ? "******" : "null");
        logger.info("Cloudinary Config - API Secret: {}", apiSecret != null ? "******" : "null");
    }

    @Bean
    public Cloudinary cloudinary() {
        if (cloudName == null || cloudName.isEmpty() || 
            apiKey == null || apiKey.isEmpty() || 
            apiSecret == null || apiSecret.isEmpty()) {
            logger.error("Cloudinary credentials are missing!");
            logger.error("CloudName: {}, ApiKey: {}, ApiSecret: {}", cloudName, apiKey != null ? "present" : "null", apiSecret != null ? "present" : "null");
            throw new RuntimeException("Cloudinary credentials not properly configured");
        }
        
        logger.info("Creating Cloudinary bean with cloud name: {}", cloudName);
        
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }
}