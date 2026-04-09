package backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @Pattern(regexp = "ELECTRICAL|PLUMBING|IT|FURNITURE|OTHER|",
             message = "Category must be ELECTRICAL, PLUMBING, IT, FURNITURE, OTHER, or empty")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "LOW|MEDIUM|HIGH|CRITICAL",
             message = "Priority must be LOW, MEDIUM, HIGH, or CRITICAL")
    private String priority;

    private String resourceId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Reporter user ID is required")
    private String reportedByUserId;

    @NotBlank(message = "Reporter name is required")
    private String reportedByName;

    @NotBlank(message = "Contact details are required")
    private String contactDetails;
}