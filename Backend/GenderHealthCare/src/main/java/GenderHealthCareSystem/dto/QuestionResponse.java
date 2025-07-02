package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponse {
    private Integer questionId;
    private String title;
    private String content;
    private String answer;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
    private String status;
    
    // Customer information
    private Integer customerId;
    private String customerFullName;
    private String customerImageUrl;
    
    // Consultant information (if assigned)
    private Integer consultantId;
    private String consultantFullName;
    private String consultantImageUrl;
    
    // Answer by information (if answered)
    private Integer answerById;
    private String answerByFullName;
    private String answerByImageUrl;
    
    // Helper fields
    private boolean isAnswered;
    private int commentCount; // Number of comments on this question
}
