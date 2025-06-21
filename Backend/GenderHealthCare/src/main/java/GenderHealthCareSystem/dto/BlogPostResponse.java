package GenderHealthCareSystem.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogPostResponse {

    private Integer postId;
    private Integer consultantId;
    private String consultantImageUrl;
    private String consultantName;
    private String title;
    private String content;
    private String thumbnailUrl;
    private LocalDateTime publishedAt;
    private long viewCount;
    private long likeCount;
    private String status;
    private String tags;
}