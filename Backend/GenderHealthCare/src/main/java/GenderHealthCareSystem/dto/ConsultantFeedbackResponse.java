package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantFeedbackResponse {
    private Integer feedbackId;
    private Integer bookingId;
    private LocalDateTime bookingDate;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private Integer consultantId;
    private String consultantName;
    private Integer customerId;
    private String customerName;
    private String customerImageUrl;
}
