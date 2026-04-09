package backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String name;
    private List<String> roles;

    public JwtResponse(String token, String id, String email, String name, List<String> roles) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }
}