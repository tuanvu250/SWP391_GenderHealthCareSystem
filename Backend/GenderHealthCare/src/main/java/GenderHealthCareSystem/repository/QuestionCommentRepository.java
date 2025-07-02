package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.QuestionComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionCommentRepository extends JpaRepository<QuestionComment, Integer> {

    // Find comments by question ID
    List<QuestionComment> findByQuestion_QuestionIdOrderByCreatedAtAsc(Integer questionId);

    // Find comments by question ID with pagination
    Page<QuestionComment> findByQuestion_QuestionIdOrderByCreatedAtAsc(Integer questionId, Pageable pageable);

    // Count comments for a question
    @Query("SELECT COUNT(c) FROM QuestionComment c WHERE c.question.questionId = :questionId")
    long countByQuestionId(@Param("questionId") Integer questionId);

    // Find comments by user
    Page<QuestionComment> findByUser_UserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    // Delete all comments of a question (for hard delete)
    void deleteByQuestion_QuestionId(Integer questionId);
}
