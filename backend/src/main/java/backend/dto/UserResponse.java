package backend.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String profilePicture;
    private Set<String> roles;
}