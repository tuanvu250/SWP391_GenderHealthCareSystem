package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefundResponse {
    private String message;
    private Double refundAmount;
    private String refundStatus;
}
