package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class PaymentCallbackRequest {
    private Integer bookingId;
    private String status;
    private Double amount;
    private String currency;
    private String transactionId;
    private String paymentMethod;
}
