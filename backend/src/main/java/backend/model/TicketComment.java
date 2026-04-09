package backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketComment {

    private String id;
    private String ticketId;
    private String authorId;
    private String authorName;
    private String userRole;      
    private String content;
    private boolean edited = false; 
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}