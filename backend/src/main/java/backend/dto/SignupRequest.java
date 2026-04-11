package backend.dto;

import lombok.Data;
import java.util.Set;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private Set<String> roles;
}