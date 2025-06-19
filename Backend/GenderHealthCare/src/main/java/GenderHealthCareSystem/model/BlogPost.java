package GenderHealthCareSystem.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "BlogPost")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @Column(name = "PostID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer postId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID")
    private Users consultant;

    @Column(name = "Title", length = 255, columnDefinition = "NVARCHAR(255)")
    private String title;

    @Column(name = "Content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "ThumbnailURL", columnDefinition = "NVARCHAR(255)")
    private String thumbnailUrl;

    @Column(name = "PublishedAt")
    private LocalDateTime publishedAt;

    @Column(name = "Tags", columnDefinition = "NVARCHAR(255)")
    private String tags;
    @Column(name = "ViewCount")
    private long viewCount;

    @Column(name = "LikeCount")
    private long likeCount;

    @Column(name = "DislikeCount")
    private long dislikeCount;

    @Column(name = "Status" , length = 20, columnDefinition = "NVARCHAR(20)")
    private String status; // e.g., "Pending", "Published", "Deleted"


}
