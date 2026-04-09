package backend.repository;

import backend.model.TicketComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<TicketComment, String> {

    List<TicketComment> findByTicketId(String ticketId);
    List<TicketComment> findByAuthorId(String authorId);
    void deleteByTicketId(String ticketId);
}