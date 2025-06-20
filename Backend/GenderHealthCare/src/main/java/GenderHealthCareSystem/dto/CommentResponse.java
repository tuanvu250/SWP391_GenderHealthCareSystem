package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Integer commentId;              // ID of the comment
    private String content;                 // Content of the comment
    private LocalDateTime createdAt;               // Creation date of the comment (formatted as String)
    private LocalDateTime updatedAt;               // Last update date of the comment (formatted as String)
    private int UserID;
    private String userFullName;            // Full name of the user
    private String userImageUrl;            // URL of the user's profile image

}
