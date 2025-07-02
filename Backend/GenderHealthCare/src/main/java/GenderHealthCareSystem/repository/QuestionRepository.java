package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {

    // Find all questions with status filter
    Page<Question> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    // Find pending questions (not answered)
    @Query("SELECT q FROM Question q WHERE q.answer IS NULL AND q.status = 'PENDING' ORDER BY q.createdAt DESC")
    Page<Question> findPendingQuestions(Pageable pageable);

    // Find answered questions
    @Query("SELECT q FROM Question q WHERE q.answer IS NOT NULL AND q.status = 'ANSWERED' ORDER BY q.answeredAt DESC")
    Page<Question> findAnsweredQuestions(Pageable pageable);

    // Find questions by customer
    Page<Question> findByCustomer_UserIdAndStatusOrderByCreatedAtDesc(Integer customerId, String status, Pageable pageable);

    // Find questions by consultant (assigned to)
    Page<Question> findByConsultant_UserIdAndStatusOrderByCreatedAtDesc(Integer consultantId, String status, Pageable pageable);

    // Find questions answered by specific consultant
    Page<Question> findByAnswerBy_UserIdAndStatusOrderByAnsweredAtDesc(Integer consultantId, String status, Pageable pageable);

    // Search questions by title or content
    @Query("SELECT q FROM Question q WHERE " +
           "(LOWER(q.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "q.status = :status ORDER BY q.createdAt DESC")
    Page<Question> searchQuestions(@Param("keyword") String keyword, @Param("status") String status, Pageable pageable);

    // Count pending questions
    @Query("SELECT COUNT(q) FROM Question q WHERE q.answer IS NULL AND q.status = 'PENDING'")
    long countPendingQuestions();

    // Count answered questions
    @Query("SELECT COUNT(q) FROM Question q WHERE q.answer IS NOT NULL AND q.status = 'ANSWERED'")
    long countAnsweredQuestions();
}
