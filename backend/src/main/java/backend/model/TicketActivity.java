package backend.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketActivity {

    private String id;
    private String activityType;      // STATUS_CHANGE, ASSIGNMENT, RESOLUTION, REJECTION, COMMENT, ATTACHMENT
    private String title;             // Human-readable summary
    private String description;       // Detailed description of what changed
    
    // Actor information
    private String performedByUserId;
    private String performedByName;
    private String performedByRole;   // ADMIN, TECHNICIAN, USER
    
    // Change details
    private String previousValue;     // Previous status/value
    private String newValue;          // New status/value
    private String details;           // Additional details (notes, reason, etc.)
    
    private LocalDateTime timestamp;
    
}
