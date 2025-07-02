package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantFeedbackCreateResponse {
    private Integer feedbackId;
    private Integer bookingId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
