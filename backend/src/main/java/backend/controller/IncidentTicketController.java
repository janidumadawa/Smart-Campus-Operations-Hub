package backend.controller;

import backend.dto.CommentRequest;
import backend.dto.TicketRequest;
import backend.dto.TicketStatusUpdateRequest;
import backend.model.IncidentTicket;
import backend.service.IncidentTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    // ─── EXCEPTION HANDLERS ───────────────────────────────────
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(java.util.NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleForbidden(SecurityException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
    }

    // ─── CREATE ───────────────────────────────────────────────
    // POST /api/tickets
    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody TicketRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(req));
    }

    // ─── GET ──────────────────────────────────────────────────
    // GET /api/tickets
    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String technicianId,
            @RequestParam(required = false) String priority) {

        if (status       != null) return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
        if (userId       != null) return ResponseEntity.ok(ticketService.getTicketsByUser(userId));
        if (technicianId != null) return ResponseEntity.ok(ticketService.getTicketsByTechnician(technicianId));
        if (priority     != null) return ResponseEntity.ok(ticketService.getTicketsByPriority(priority));
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/admin
    @GetMapping("/admin")
    public ResponseEntity<List<IncidentTicket>> getTicketsForAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        return ResponseEntity.ok(
                ticketService.getTicketsForAdmin(status, priority, category, location, fromDate, toDate));
    }

    // GET /api/tickets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // GET /api/tickets/{id}/sla
    @GetMapping("/{id}/sla")
    public ResponseEntity<Map<String, Object>> getSlaMetrics(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getSlaMetrics(id));
    }

    // ─── STATUS UPDATE ────────────────────────────────────────
    // PATCH /api/tickets/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdateRequest req) {
        return ResponseEntity.ok(ticketService.updateStatus(id, req));
    }

    // ─── ASSIGN TECHNICIAN ────────────────────────────────────
    // PATCH /api/tickets/{id}/assign
    @PatchMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.assignTechnician(
                id,
                body.get("technicianId"),
                body.get("technicianName")));
    }

    // ─── ATTACHMENTS ──────────────────────────────────────────
    // POST /api/tickets/{id}/attachments
    @PostMapping("/{id}/attachments")
    public ResponseEntity<IncidentTicket> uploadAttachments(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files) throws Exception {
        if (files.size() > 3) {
            throw new IllegalStateException("Cannot upload more than 3 files at once.");
        }
        return ResponseEntity.ok(ticketService.uploadAttachments(id, files));
    }

    // ─── COMMENTS ─────────────────────────────────────────────
    // POST /api/tickets/{id}/comments
    @PostMapping("/{id}/comments")
    public ResponseEntity<IncidentTicket> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest req) {
        return ResponseEntity.ok(ticketService.addComment(id, req));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId}
    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<IncidentTicket> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String requesterId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                ticketService.editComment(ticketId, commentId, requesterId, body.get("content")));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId}
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String requesterId,
            @RequestParam(defaultValue = "false") boolean isAdmin) {
        ticketService.deleteComment(ticketId, commentId, requesterId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    // ─── DELETE TICKET ────────────────────────────────────────
    // DELETE /api/tickets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}