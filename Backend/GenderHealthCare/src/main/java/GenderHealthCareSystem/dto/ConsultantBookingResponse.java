package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ConsultantBookingResponse {
    private Integer bookingId;
    private String consultantName;
    private String status;
    private String paymentUrl;    // URL thanh toán (VNPAY hoặc PayPal)
    private String paymentStatus;
    private String meetLink;      // URL họp (sau khi thanh toán)
    private BigDecimal totalAmount;
    private String paymentMethod;
}
