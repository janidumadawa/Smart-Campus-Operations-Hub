package backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "OPEN|IN_PROGRESS|RESOLVED|CLOSED|REJECTED",
             message = "Status must be OPEN, IN_PROGRESS, RESOLVED, CLOSED, or REJECTED")
    private String status;

    private String resolutionNotes;
    private String rejectionReason;
    private String assignedTechnicianId;
    private String assignedTechnicianName;
    
    // Activity tracking - who is making the change
    private String updatedByUserId;
    private String updatedByName;
    private String updatedByRole;  // ADMIN, TECHNICIAN, USER
}