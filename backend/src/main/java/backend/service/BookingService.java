package backend.service;

import backend.dto.BookingRequestDTO;
import backend.dto.BookingResponseDTO;
import backend.enums.BookingStatus;
import backend.exception.ConflictException;
import backend.exception.ResourceNotFoundException;
import backend.model.Booking;
import backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        validateBookingRequest(dto);

        List<Booking> sameDayBookings = bookingRepository.findByResourceAndDate(dto.getResource(), dto.getDate());

        boolean hasConflict = sameDayBookings.stream().anyMatch(booking ->
                booking.getStatus() != BookingStatus.REJECTED &&
                booking.getStatus() != BookingStatus.CANCELLED &&
                dto.getStartTime().compareTo(booking.getEndTime()) < 0 &&
                dto.getEndTime().compareTo(booking.getStartTime()) > 0
        );

        if (hasConflict) {
            throw new ConflictException("Booking conflict detected for this resource and time.");
        }

        Booking booking = new Booking(
                dto.getResource(),
                dto.getDate(),
                dto.getStartTime(),
                dto.getEndTime(),
                dto.getPurpose(),
                dto.getAttendees(),
                dto.getRequestedBy(),
                dto.getEmail(),
                BookingStatus.PENDING,
                ""
        );

        return mapToResponse(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    public List<BookingResponseDTO> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReason("");

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponseDTO rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason == null ? "" : reason);

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponseDTO cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.CANCELLED);

        return mapToResponse(bookingRepository.save(booking));
    }

    private void validateBookingRequest(BookingRequestDTO dto) {
        if (isBlank(dto.getResource()) || isBlank(dto.getDate()) || isBlank(dto.getStartTime())
                || isBlank(dto.getEndTime()) || isBlank(dto.getPurpose())
                || dto.getAttendees() == null || isBlank(dto.getRequestedBy()) || isBlank(dto.getEmail())) {
            throw new IllegalArgumentException("All booking fields are required.");
        }

        if (dto.getStartTime().compareTo(dto.getEndTime()) >= 0) {
            throw new IllegalArgumentException("End time must be later than start time.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private BookingResponseDTO mapToResponse(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getResource(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getRequestedBy(),
                booking.getEmail(),
                booking.getStatus(),
                booking.getAdminReason()
        );
    }
}