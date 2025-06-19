package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @Column(name = "CommentID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PostID", referencedColumnName = "PostID")
    private BlogPost blogPost;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserID", referencedColumnName = "UserID")
    private Users user;

    @Column(name = "Content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "Status", length = 20, columnDefinition = "NVARCHAR(20)")
    private String status; // e.g., "Visible", "Hidden", "Deleted"
}
