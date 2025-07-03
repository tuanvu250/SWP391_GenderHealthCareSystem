package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultantBookingDetailResponse {
    private Integer bookingId;
    private String customerName;
    private Integer customerId;
    private LocalDateTime bookingDate;
    private String status;
    private String paymentStatus;
    private String meetLink;
}
