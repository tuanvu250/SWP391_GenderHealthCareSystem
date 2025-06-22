package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StisFeedbackResponse {
    private Integer feedbackId;
    private Integer userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}