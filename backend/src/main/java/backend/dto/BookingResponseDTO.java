package backend.dto;

import backend.enums.BookingStatus;

public class BookingResponseDTO {

    private String id;
    private String resource;
    private String date;
    private String startTime;
    private String endTime;
    private String purpose;
    private Integer attendees;
    private String requestedBy;
    private String email;
    private BookingStatus status;
    private String adminReason;

    public BookingResponseDTO() {
    }

    public BookingResponseDTO(String id, String resource, String date, String startTime, String endTime,
                              String purpose, Integer attendees, String requestedBy, String email,
                              BookingStatus status, String adminReason) {
        this.id = id;
        this.resource = resource;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
        this.requestedBy = requestedBy;
        this.email = email;
        this.status = status;
        this.adminReason = adminReason;
    }

    public String getId() {
        return id;
    }

    public String getResource() {
        return resource;
    }

    public String getDate() {
        return date;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getAttendees() {
        return attendees;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public String getEmail() {
        return email;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getAdminReason() {
        return adminReason;
    }
}