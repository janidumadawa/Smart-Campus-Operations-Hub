// backend\src\main\java\backend\service\BookingService.java
package backend.service;

import backend.dto.BookingRequestDTO;
import backend.enums.BookingStatus;
import backend.exception.ConflictException;
import backend.exception.ResourceNotFoundException;
import backend.model.Booking;
import backend.model.Resource;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public Booking createBooking(BookingRequestDTO dto) {
        if (dto.getResourceId() == null || dto.getResourceId().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource ID is required.");
        }

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found."));

        if ("OUT_OF_SERVICE".equalsIgnoreCase(resource.getStatus())) {
            throw new IllegalArgumentException("Selected resource is out of service.");
        }

        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDate(resource.getId(), dto.getDate());

        boolean hasConflict = existingBookings.stream().anyMatch(booking ->
                booking.getStatus() != BookingStatus.REJECTED &&
                booking.getStatus() != BookingStatus.CANCELLED &&
                dto.getStartTime().compareTo(booking.getEndTime()) < 0 &&
                dto.getEndTime().compareTo(booking.getStartTime()) > 0
        );

        if (hasConflict) {
            throw new ConflictException("Booking conflict detected for this resource and time.");
        }

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
        booking.setAdminReason("");

        return bookingRepository.save(booking);
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
}