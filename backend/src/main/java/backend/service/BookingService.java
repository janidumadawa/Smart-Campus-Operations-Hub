package backend.service;

import backend.dto.BookingRequestDTO;
import backend.dto.BookingReviewDTO;
import backend.enums.BookingStatus;
import backend.exception.ConflictException;
import backend.exception.ResourceNotFoundException;
import backend.model.Booking;
import backend.model.Resource;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationHelper notificationHelper;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, 
                          ResourceRepository resourceRepository,
                          NotificationHelper notificationHelper,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationHelper = notificationHelper;
        this.userRepository = userRepository;
    }

    private String getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(backend.model.User::getId)
                .orElse(null);
    }

    public Booking createBooking(BookingRequestDTO dto) {
        // Validate resource exists
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        // Check if resource is available
        if ("OUT_OF_SERVICE".equalsIgnoreCase(resource.getStatus())) {
            throw new IllegalArgumentException("Resource is out of service");
        }

        // Check for time conflicts
        List<Booking> existing = bookingRepository.findByResourceIdAndDate(
                dto.getResourceId(), dto.getDate());

        boolean hasConflict = existing.stream()
                .filter(b -> b.getStatus() != BookingStatus.REJECTED)
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .anyMatch(b -> timeOverlaps(dto.getStartTime(), dto.getEndTime(), 
                                           b.getStartTime(), b.getEndTime()));

        if (hasConflict) {
            throw new ConflictException("Time slot already booked for this resource");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setResourceId(resource.getId());
        booking.setResourceName(resource.getName());
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setAttendees(dto.getAttendees());
        booking.setRequestedBy(dto.getRequestedBy());
        booking.setEmail(dto.getEmail());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        
        // Trigger notification
        String userId = getUserIdByEmail(saved.getEmail());
        if (userId != null) {
            notificationHelper.triggerBookingRequested(userId, saved.getId(), saved.getResourceName());
        }
        
        // Notify Admins
        notificationHelper.notifyAdminsOfNewBooking(saved.getId(), saved.getResourceName(), saved.getRequestedBy());
        
        return saved;
    }

    private boolean timeOverlaps(String start1, String end1, String start2, String end2) {
        return start1.compareTo(end2) < 0 && end1.compareTo(start2) > 0;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Booking reviewBooking(String id, BookingReviewDTO review) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be reviewed");
        }

        booking.setStatus(review.getStatus());
        if (review.getAdminReason() != null) {
            booking.setAdminReason(review.getAdminReason());
        }
        Booking saved = bookingRepository.save(booking);
        
        // Trigger notification
        String userId = getUserIdByEmail(saved.getEmail());
        if (userId != null) {
            if (saved.getStatus() == BookingStatus.APPROVED) {
                notificationHelper.triggerBookingApproved(userId, saved.getId(), saved.getResourceName());
            } else if (saved.getStatus() == BookingStatus.REJECTED) {
                notificationHelper.triggerBookingRejected(userId, saved.getId(), saved.getResourceName(), saved.getAdminReason());
            }
        }
        
        return saved;
    }

    public Booking cancelBooking(String id, String email) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getEmail().equals(email)) {
            throw new SecurityException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING && 
            booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Cannot cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        
        // Trigger notification
        String userId = getUserIdByEmail(saved.getEmail());
        if (userId != null) {
            notificationHelper.triggerBookingCancelled(userId, saved.getId(), saved.getResourceName());
        }
        
        return saved;
    }
}