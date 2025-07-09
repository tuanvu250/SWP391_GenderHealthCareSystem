package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ConsultantBookingResponse {
    private Integer bookingId;
    private String consultantName;
    private LocalDateTime bookingDate;
    private BigDecimal amount;
    private String paymentStatus;
    private String paymentMethod;
    private String meetLink;
    private String status;
    private Integer consultantId; // Added consultantId field
}
