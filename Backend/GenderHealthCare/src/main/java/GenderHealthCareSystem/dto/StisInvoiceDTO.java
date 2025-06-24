package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisInvoiceDTO {

    private Integer invoiceId;
    private Integer bookingId;
    private String transactionId;
    private Double totalAmount;
    private String currency;
    private String paymentMethod;
    private LocalDateTime paidAt;
}
