package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisBookingResponse {
    private Integer bookingId;
    private Integer customerId;
    private String customerName;
    private Integer serviceId;
    private String serviceName;
    private BigDecimal servicePrice;
    private LocalDateTime bookingDate;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
