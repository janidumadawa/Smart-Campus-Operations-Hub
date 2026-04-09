package backend.repository;

import backend.model.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<IncidentTicket, String> {

    // Get all tickets by a specific user
    List<IncidentTicket> findByReportedByUserId(String userId);

    // Get all tickets by status (e.g. OPEN, IN_PROGRESS)
    List<IncidentTicket> findByStatus(String status);

    // Get all tickets by priority
    List<IncidentTicket> findByPriority(String priority);

    // Get all tickets assigned to a technician
    List<IncidentTicket> findByAssignedTechnicianId(String technicianId);

    // Get tickets by category
    List<IncidentTicket> findByCategory(String category);
}