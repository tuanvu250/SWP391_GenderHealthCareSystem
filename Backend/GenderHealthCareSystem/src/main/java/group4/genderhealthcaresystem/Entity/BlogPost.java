package group4.genderhealthcaresystem.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "BlogPost")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @Column(name = "PostID")
    private Integer postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID")
    private Users consultant;

    @Column(name = "Title", length = 255)
    private String title;

    @Column(name = "Content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "ThumbnailURL", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "PublishedAt")
    private LocalDateTime publishedAt;

    @Column(name = "Tags", columnDefinition = "TEXT")
    private String tags; // Consider a separate Tag entity and ManyToMany relationship
}
