package backend.model;

import backend.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String name;
    private String profilePicture;
    
    private Set<Role> roles = new HashSet<>();
    
    private boolean enabled = true;
    private String provider; // "local" or "google"
    private String providerId;
    
    private Long createdAt = System.currentTimeMillis();
    private Long updatedAt = System.currentTimeMillis();
}