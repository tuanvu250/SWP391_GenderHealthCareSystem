package GenderHealthCareSystem.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogPostResponse {

    private Integer postId;
    private Integer consultantId;
    private String consultantName;
    private String title;
    private String content;
    private String thumbnailUrl;
    private LocalDateTime publishedAt;
    private String tags;
}