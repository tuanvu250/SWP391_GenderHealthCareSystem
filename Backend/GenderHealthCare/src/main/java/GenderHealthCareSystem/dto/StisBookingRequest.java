package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisBookingRequest {
    private Integer customerId;
    private Integer serviceId;
    private LocalDateTime bookingDate;
    private String note;
    private String paymentMethod;
}
