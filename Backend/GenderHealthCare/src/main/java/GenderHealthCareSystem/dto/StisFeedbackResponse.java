package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisFeedbackResponse {
    private Integer feedbackId;
    private Integer bookingId;
    private LocalDateTime bookingDate;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String serviceName;
    private String status;
    private Integer userId;
    private String userFullName;
    private String userImageUrl;
}