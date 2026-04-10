package backend.controller;

import backend.dto.BookingRequestDTO;
import backend.model.Booking;
import backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE BOOKING
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // GET ALL BOOKINGS (Admin)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET USER'S BOOKINGS
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getBookingsByEmail(email));
    }

    // GET BOOKING BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}