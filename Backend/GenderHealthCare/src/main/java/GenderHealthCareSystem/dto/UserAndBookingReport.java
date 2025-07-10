package GenderHealthCareSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserAndBookingReport {
    private LocalDate date;
    private int users;
    private int bookings;
    private int appointments;
}
