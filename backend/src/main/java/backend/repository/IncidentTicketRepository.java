package backend.repository;

import backend.model.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByReportedByUserId(String userId);
    List<IncidentTicket> findByStatus(String status);
    List<IncidentTicket> findByAssignedTechnicianId(String technicianId);
    List<IncidentTicket> findByPriority(String priority);
}