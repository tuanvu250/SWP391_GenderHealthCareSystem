package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionCommentResponse {
    private Integer commentId;
    private Integer questionId;
    private String content;
    private LocalDateTime createdAt;
    // Removed status field - no longer needed

    // User information
    private Integer userId;
    private String userFullName;
    private String userImageUrl;
}
