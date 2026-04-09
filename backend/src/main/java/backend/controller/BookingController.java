package backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    // ✅ GET (test)
    @GetMapping
    public String test() {
        return "Booking API working";
    }

    // ✅ POST (this fixes your error)
    @PostMapping
    public Map<String, Object> createBooking(@RequestBody Map<String, Object> request) {

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking created successfully");
        response.put("data", request);

        return response;
    }
}