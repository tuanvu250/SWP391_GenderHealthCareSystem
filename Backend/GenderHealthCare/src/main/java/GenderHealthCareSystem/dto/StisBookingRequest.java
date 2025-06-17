package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisBookingRequest {
    private Integer customerId;
    private Integer serviceId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String note;
    private String paymentMethod;
}
