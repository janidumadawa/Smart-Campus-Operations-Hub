package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "incident_tickets")
public class IncidentTicket {

    @Id
    private String id;

    private String title;
    private String category;        // ELECTRICAL, PLUMBING, IT, FURNITURE, OTHER
    private String description;
    private String priority;        // LOW, MEDIUM, HIGH, CRITICAL
    private String status;          // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED

    private String resourceId;
    private String location;

    private String reportedByUserId;
    private String reportedByName;
    private String contactDetails;

    private String assignedTechnicianId;
    private String assignedTechnicianName;

    private String resolutionNotes;
    private String rejectionReason;

    private List<String> attachmentUrls;
    private List<TicketComment> comments;
    private List<TicketActivity> activities;  // Activity timeline/history

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime respondedAt;  // SLA: time of first response
    private LocalDateTime resolvedAt;   // SLA: time of resolution
}