package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConsultantBookingResponse {
    private Integer bookingId;
    private String status;
    private String paymentUrl;    // URL thanh toán (VNPAY hoặc PayPal)
    private String meetLink;      // URL họp (sau khi thanh toán)
}
