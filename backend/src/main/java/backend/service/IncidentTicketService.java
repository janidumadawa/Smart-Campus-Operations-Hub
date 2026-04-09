package backend.service;

import backend.dto.CommentRequest;
import backend.dto.TicketRequest;
import backend.dto.TicketStatusUpdateRequest;
import backend.model.IncidentTicket;
import backend.model.TicketActivity;
import backend.model.TicketComment;
import backend.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final CloudinaryService cloudinaryService;

    @Value("${file.upload-dir:uploads/tickets}")
    private String uploadDir;

    // ─── STATUS TRANSITION RULES ──────────────────────────────
    private static final Map<String, List<String>> ALLOWED_TRANSITIONS = Map.of(
        "OPEN",        List.of("IN_PROGRESS", "REJECTED"),
        "IN_PROGRESS", List.of("RESOLVED", "REJECTED"),
        "RESOLVED",    List.of("CLOSED"),
        "CLOSED",      List.of(),
        "REJECTED",    List.of()
    );

    private void validateTransition(String from, String to) {
        List<String> allowed = ALLOWED_TRANSITIONS.getOrDefault(from, List.of());
        if (!allowed.contains(to)) {
            throw new IllegalStateException(
                "Invalid transition: " + from + " → " + to +
                ". Allowed next statuses: " + allowed);
        }
    }

    // ─── CREATE ───────────────────────────────────────────────
    public IncidentTicket createTicket(TicketRequest req) {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(req.getTitle());
        ticket.setCategory(req.getCategory());
        ticket.setDescription(req.getDescription());
        ticket.setPriority(req.getPriority());
        ticket.setResourceId(req.getResourceId());
        ticket.setLocation(req.getLocation());
        ticket.setReportedByUserId(req.getReportedByUserId());
        ticket.setReportedByName(req.getReportedByName());
        ticket.setContactDetails(req.getContactDetails());
        ticket.setStatus("OPEN");
        ticket.setAttachmentUrls(new ArrayList<>());
        ticket.setComments(new ArrayList<>());
        ticket.setActivities(new ArrayList<>());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Log initial creation activity
        TicketActivity creationActivity = new TicketActivity();
        creationActivity.setId(UUID.randomUUID().toString());
        creationActivity.setActivityType("CREATION");
        creationActivity.setTitle("Ticket Created");
        creationActivity.setDescription("Ticket has been created");
        creationActivity.setPerformedByUserId(req.getReportedByUserId());
        creationActivity.setPerformedByName(req.getReportedByName());
        creationActivity.setPerformedByRole("USER");
        creationActivity.setNewValue("OPEN");
        creationActivity.setTimestamp(LocalDateTime.now());
        
        ticket.getActivities().add(creationActivity);
        
        return ticketRepository.save(ticket);
    }

    // ─── IMAGE UPLOAD ─────────────────────────────────────────
    public IncidentTicket uploadAttachments(String ticketId, List<MultipartFile> files) throws IOException {
        IncidentTicket ticket = getTicketById(ticketId);
        if (files == null || files.isEmpty()) {
            throw new IllegalStateException("At least one attachment is required.");
        }

        List<String> existing = ticket.getAttachmentUrls();
        if (existing == null) existing = new ArrayList<>();

        int available = 3 - existing.size();
        if (available <= 0) {
            throw new IllegalStateException("Maximum 3 attachments already reached.");
        }
        if (files.size() > available) {
            throw new IllegalStateException(
                "You can only add " + available + " more attachment(s). Already has " + existing.size() + ".");
        }

        // Upload each file to Cloudinary
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                throw new IllegalStateException("Attachment file cannot be empty.");
            }

            try {
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(
                    file, 
                    "tickets/" + ticketId,
                    null
                );
                
                // Extract the secure URL from Cloudinary response
                String secureUrl = (String) uploadResult.get("secure_url");
                if (secureUrl != null) {
                    existing.add(secureUrl);
                }
            } catch (IOException e) {
                throw new IOException("Failed to upload attachment: " + e.getMessage(), e);
            }
        }

        ticket.setAttachmentUrls(existing);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Log attachment activity
        TicketActivity attachmentActivity = new TicketActivity();
        attachmentActivity.setId(UUID.randomUUID().toString());
        attachmentActivity.setActivityType("ATTACHMENT");
        attachmentActivity.setTitle("Attachments Added");
        attachmentActivity.setDescription(files.size() + " attachment(s) uploaded");
        attachmentActivity.setPerformedByUserId("USER");
        attachmentActivity.setPerformedByName("User");
        attachmentActivity.setPerformedByRole("USER");
        attachmentActivity.setDetails("Uploaded " + files.size() + " file(s)");
        attachmentActivity.setTimestamp(LocalDateTime.now());
        
        List<TicketActivity> activities = ticket.getActivities();
        if (activities == null) activities = new ArrayList<>();
        activities.add(attachmentActivity);
        ticket.setActivities(activities);
        
        return ticketRepository.save(ticket);
    }

    // ─── GET ──────────────────────────────────────────────────
    public IncidentTicket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ticket not found: " + id));
    }

    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<IncidentTicket> getTicketsByUser(String userId) {
        return ticketRepository.findByReportedByUserId(userId);
    }

    public List<IncidentTicket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public List<IncidentTicket> getTicketsByTechnician(String technicianId) {
        return ticketRepository.findByAssignedTechnicianId(technicianId);
    }

    public List<IncidentTicket> getTicketsByPriority(String priority) {
        return ticketRepository.findByPriority(priority);
    }

    public List<IncidentTicket> getTicketsForAdmin(String status,
                                                   String priority,
                                                   String category,
                                                   String location,
                                                   String fromDate,
                                                   String toDate) {
        LocalDate from = parseDate(fromDate, "fromDate");
        LocalDate to = parseDate(toDate, "toDate");
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalStateException("fromDate cannot be after toDate.");
        }

        Stream<IncidentTicket> stream = ticketRepository.findAll().stream();
        if (status != null && !status.isBlank()) {
            stream = stream.filter(t -> equalsIgnoreCase(t.getStatus(), status));
        }
        if (priority != null && !priority.isBlank()) {
            stream = stream.filter(t -> equalsIgnoreCase(t.getPriority(), priority));
        }
        if (category != null && !category.isBlank()) {
            stream = stream.filter(t -> equalsIgnoreCase(t.getCategory(), category));
        }
        if (location != null && !location.isBlank()) {
            stream = stream.filter(t -> t.getLocation() != null &&
                    t.getLocation().toLowerCase().contains(location.toLowerCase()));
        }
        if (from != null) {
            stream = stream.filter(t -> t.getCreatedAt() != null &&
                    !t.getCreatedAt().toLocalDate().isBefore(from));
        }
        if (to != null) {
            stream = stream.filter(t -> t.getCreatedAt() != null &&
                    !t.getCreatedAt().toLocalDate().isAfter(to));
        }

        return stream
                .sorted(Comparator.comparing(IncidentTicket::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private LocalDate parseDate(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            throw new IllegalStateException(fieldName + " must be in ISO format yyyy-MM-dd.");
        }
    }

    private boolean equalsIgnoreCase(String left, String right) {
        return left != null && right != null && left.equalsIgnoreCase(right);
    }

    // ─── STATUS UPDATE ────────────────────────────────────────
    public IncidentTicket updateStatus(String ticketId, TicketStatusUpdateRequest req) {
        IncidentTicket ticket = getTicketById(ticketId);
        String previousStatus = ticket.getStatus();
        String newStatus = req.getStatus();

        validateTransition(previousStatus, newStatus);

        if ("REJECTED".equals(newStatus) &&
            (req.getRejectionReason() == null || req.getRejectionReason().isBlank())) {
            throw new IllegalStateException("Rejection reason is required when setting status to REJECTED.");
        }
        if ("RESOLVED".equals(newStatus) &&
            (req.getResolutionNotes() == null || req.getResolutionNotes().isBlank())) {
            throw new IllegalStateException("Resolution notes are required when setting status to RESOLVED.");
        }

        // SLA: record first response time
        if ("OPEN".equals(previousStatus) && ticket.getRespondedAt() == null) {
            ticket.setRespondedAt(LocalDateTime.now());
        }
        // SLA: record resolution time
        if ("RESOLVED".equals(newStatus) && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        ticket.setStatus(newStatus);

        if (req.getResolutionNotes() != null) ticket.setResolutionNotes(req.getResolutionNotes());
        if (req.getRejectionReason() != null) ticket.setRejectionReason(req.getRejectionReason());
        if (req.getAssignedTechnicianId() != null) ticket.setAssignedTechnicianId(req.getAssignedTechnicianId());
        if (req.getAssignedTechnicianName() != null) ticket.setAssignedTechnicianName(req.getAssignedTechnicianName());

        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Log status change activity
        logStatusChangeActivity(ticket, previousStatus, newStatus, req);
        
        return ticketRepository.save(ticket);
    }

    // ─── ASSIGN TECHNICIAN ────────────────────────────────────
    public IncidentTicket assignTechnician(String ticketId, String technicianId, String technicianName) {
        IncidentTicket ticket = getTicketById(ticketId);
        String previousTech = ticket.getAssignedTechnicianName();

        ticket.setAssignedTechnicianId(technicianId);
        ticket.setAssignedTechnicianName(technicianName);

        // Auto-transition OPEN → IN_PROGRESS on assignment
        String previousStatus = ticket.getStatus();
        if ("OPEN".equals(ticket.getStatus())) {
            ticket.setStatus("IN_PROGRESS");
            if (ticket.getRespondedAt() == null) {
                ticket.setRespondedAt(LocalDateTime.now());
            }
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Log assignment activity
        TicketActivity assignment = new TicketActivity();
        assignment.setId(UUID.randomUUID().toString());
        assignment.setActivityType("ASSIGNMENT");
        assignment.setTitle("Technician Assigned");
        assignment.setDescription("Technician " + technicianName + " has been assigned to this ticket");
        assignment.setPerformedByUserId("SYSTEM");
        assignment.setPerformedByName("System");
        assignment.setPerformedByRole("SYSTEM");
        assignment.setPreviousValue(previousTech != null ? previousTech : "Unassigned");
        assignment.setNewValue(technicianName);
        assignment.setTimestamp(LocalDateTime.now());
        
        List<TicketActivity> activities = ticket.getActivities();
        if (activities == null) activities = new ArrayList<>();
        activities.add(assignment);
        ticket.setActivities(activities);
        
        // If status changed, also log that
        if (!previousStatus.equals(ticket.getStatus())) {
            TicketActivity statusChange = new TicketActivity();
            statusChange.setId(UUID.randomUUID().toString());
            statusChange.setActivityType("STATUS_CHANGE");
            statusChange.setTitle("Status Updated");
            statusChange.setDescription("Status changed from " + previousStatus + " to " + ticket.getStatus());
            statusChange.setPerformedByUserId("SYSTEM");
            statusChange.setPerformedByName("System");
            statusChange.setPerformedByRole("SYSTEM");
            statusChange.setPreviousValue(previousStatus);
            statusChange.setNewValue(ticket.getStatus());
            statusChange.setTimestamp(LocalDateTime.now());
            ticket.getActivities().add(statusChange);
        }
        
        return ticketRepository.save(ticket);
    }

    // ─── ACTIVITY LOGGING HELPER ──────────────────────────────
    private void logStatusChangeActivity(IncidentTicket ticket, String previousStatus, 
                                        String newStatus, TicketStatusUpdateRequest req) {
        TicketActivity activity = new TicketActivity();
        activity.setId(UUID.randomUUID().toString());
        activity.setActivityType("STATUS_CHANGE");
        activity.setTitle("Status Updated");
        activity.setDescription("Status changed from " + previousStatus + " to " + newStatus);
        
        // Use provided updater info or default to System
        activity.setPerformedByUserId(req.getUpdatedByUserId() != null ? req.getUpdatedByUserId() : "SYSTEM");
        activity.setPerformedByName(req.getUpdatedByName() != null ? req.getUpdatedByName() : "System");
        activity.setPerformedByRole(req.getUpdatedByRole() != null ? req.getUpdatedByRole() : "SYSTEM");
        
        activity.setPreviousValue(previousStatus);
        activity.setNewValue(newStatus);
        
        // Add details based on status
        if ("RESOLVED".equals(newStatus)) {
            activity.setDetails(req.getResolutionNotes());
        } else if ("REJECTED".equals(newStatus)) {
            activity.setDetails(req.getRejectionReason());
        }
        
        activity.setTimestamp(LocalDateTime.now());
        
        List<TicketActivity> activities = ticket.getActivities();
        if (activities == null) activities = new ArrayList<>();
        activities.add(activity);
        ticket.setActivities(activities);
    }

    // ─── SLA METRICS ──────────────────────────────────────────
    public Map<String, Object> getSlaMetrics(String ticketId) {
        IncidentTicket ticket = getTicketById(ticketId);
        Map<String, Object> sla = new LinkedHashMap<>();

        sla.put("ticketId", ticketId);
        sla.put("status", ticket.getStatus());
        sla.put("priority", ticket.getPriority());
        sla.put("createdAt", ticket.getCreatedAt());
        sla.put("respondedAt", ticket.getRespondedAt());
        sla.put("resolvedAt", ticket.getResolvedAt());

        long responseThresholdMinutes  = getResponseThreshold(ticket.getPriority());
        long resolutionThresholdMinutes = getResolutionThreshold(ticket.getPriority());

        sla.put("responseThresholdMinutes",  responseThresholdMinutes);
        sla.put("resolutionThresholdMinutes", resolutionThresholdMinutes);

        // Response time
        if (ticket.getRespondedAt() != null) {
            long responseMinutes = Duration.between(ticket.getCreatedAt(), ticket.getRespondedAt()).toMinutes();
            sla.put("responseTimeMinutes", responseMinutes);
            sla.put("responseBreached", responseMinutes > responseThresholdMinutes);
        } else {
            long elapsedMinutes = Duration.between(ticket.getCreatedAt(), LocalDateTime.now()).toMinutes();
            sla.put("responseTimeMinutes", null);
            sla.put("elapsedSinceCreatedMinutes", elapsedMinutes);
            sla.put("responseBreached", elapsedMinutes > responseThresholdMinutes);
        }

        // Resolution time
        if (ticket.getResolvedAt() != null) {
            long resolutionMinutes = Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt()).toMinutes();
            sla.put("resolutionTimeMinutes", resolutionMinutes);
            sla.put("resolutionBreached", resolutionMinutes > resolutionThresholdMinutes);
        } else {
            long elapsedMinutes = Duration.between(ticket.getCreatedAt(), LocalDateTime.now()).toMinutes();
            sla.put("resolutionTimeMinutes", null);
            sla.put("resolutionBreached", elapsedMinutes > resolutionThresholdMinutes);
        }

        return sla;
    }

    private long getResponseThreshold(String priority) {
        return switch (priority.toUpperCase()) {
            case "CRITICAL" -> 30;
            case "HIGH"     -> 120;
            case "MEDIUM"   -> 480;
            case "LOW"      -> 1440;
            default         -> 1440;
        };
    }

    private long getResolutionThreshold(String priority) {
        return switch (priority.toUpperCase()) {
            case "CRITICAL" -> 240;
            case "HIGH"     -> 1440;
            case "MEDIUM"   -> 4320;
            case "LOW"      -> 10080;
            default         -> 10080;
        };
    }

    // ─── COMMENTS ─────────────────────────────────────────────
    public IncidentTicket addComment(String ticketId, CommentRequest req) {
        IncidentTicket ticket = getTicketById(ticketId);

        TicketComment comment = new TicketComment();
        comment.setId(UUID.randomUUID().toString());
        comment.setTicketId(ticketId);
        comment.setAuthorId(req.getAuthorId());
        comment.setAuthorName(req.getAuthorName());
        comment.setUserRole(req.getUserRole());
        comment.setContent(req.getContent());
        comment.setEdited(false);
        comment.setCreatedAt(LocalDateTime.now());

        List<TicketComment> comments = ticket.getComments();
        if (comments == null) comments = new ArrayList<>();
        comments.add(comment);
        ticket.setComments(comments);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Log comment activity
        TicketActivity commentActivity = new TicketActivity();
        commentActivity.setId(UUID.randomUUID().toString());
        commentActivity.setActivityType("COMMENT");
        commentActivity.setTitle("Comment Added");
        commentActivity.setDescription("New comment added");
        commentActivity.setPerformedByUserId(req.getAuthorId());
        commentActivity.setPerformedByName(req.getAuthorName());
        commentActivity.setPerformedByRole(req.getUserRole());
        commentActivity.setDetails(req.getContent());
        commentActivity.setTimestamp(LocalDateTime.now());
        
        List<TicketActivity> activities = ticket.getActivities();
        if (activities == null) activities = new ArrayList<>();
        activities.add(commentActivity);
        ticket.setActivities(activities);
        
        return ticketRepository.save(ticket);
    }

    public IncidentTicket editComment(String ticketId, String commentId,
                                      String requesterId, String newContent) {
        IncidentTicket ticket = getTicketById(ticketId);
        if (newContent == null || newContent.isBlank()) {
            throw new IllegalStateException("Comment content cannot be empty.");
        }

        TicketComment target = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Comment not found: " + commentId));

        if (!target.getAuthorId().equals(requesterId)) {
            throw new SecurityException("Not allowed to edit this comment.");
        }

        target.setContent(newContent);
        target.setEdited(true);
        target.setUpdatedAt(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public IncidentTicket deleteComment(String ticketId, String commentId,
                                        String requesterId, boolean isAdmin) {
        IncidentTicket ticket = getTicketById(ticketId);

        boolean removed = ticket.getComments().removeIf(c -> {
            if (!c.getId().equals(commentId)) return false;
            if (isAdmin || c.getAuthorId().equals(requesterId)) return true;
            throw new SecurityException("Cannot delete: comment not found or not yours.");
        });

        if (!removed) throw new NoSuchElementException("Comment not found: " + commentId);

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // ─── DELETE TICKET ────────────────────────────────────────
    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new NoSuchElementException("Ticket not found: " + id);
        }
        ticketRepository.deleteById(id);
    }
}