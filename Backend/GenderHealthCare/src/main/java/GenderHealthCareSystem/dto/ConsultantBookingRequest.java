package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultantBookingRequest {
    private Integer consultantId;
    private Integer customerId;
    private LocalDateTime bookingDate;
    private String note;
    private String paymentMethod;
}
