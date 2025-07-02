package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "QuestionComment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionComment {

    @Id
    @Column(name = "CommentID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "QuestionID", referencedColumnName = "QuestionID")
    private Question question;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserID", referencedColumnName = "UserID")
    private Users user;

    @Column(name = "Content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}
