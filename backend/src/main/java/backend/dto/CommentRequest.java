package backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Author ID is required")
    private String authorId;

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "User role is required")
    private String userRole;

    @NotBlank(message = "Content is required")
    private String content;
}