package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ConsultantBookingResponse {
    private Integer bookingId;
    private String consultantName;
    private LocalDateTime bookingDate;
    private Double hourlyRate; // Thay thế totalAmount bằng hourlyRate
    private String paymentStatus;
    private String paymentMethod;
    private String meetLink;
    private String status;
    private Integer consultantId; // Added consultantId field
    private String customerName; // Added customerName field
}
