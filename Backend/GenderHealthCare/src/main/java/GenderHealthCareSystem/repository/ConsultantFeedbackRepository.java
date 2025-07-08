package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultantFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultantFeedbackRepository extends JpaRepository<ConsultantFeedback, Integer> {

    // Booking-related queries
    boolean existsByConsultationBooking_BookingId(Integer bookingId);
    ConsultantFeedback findByConsultationBooking_BookingId(Integer bookingId);

    // Consultant-related queries
    List<ConsultantFeedback> findByConsultationBooking_Consultant_UserId(Integer consultantId);
    Page<ConsultantFeedback> findByConsultationBooking_Consultant_UserId(Integer consultantId, Pageable pageable);

    Page<ConsultantFeedback> findByConsultationBooking_Consultant_UserIdAndRating(
            Integer consultantId, Integer rating, Pageable pageable);

    // Rating-related queries
    Page<ConsultantFeedback> findByRating(Integer rating, Pageable pageable);

    // Customer-related queries
    List<ConsultantFeedback> findByConsultationBooking_Customer_UserId(Integer customerId);

    // Custom queries for statistics
    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf WHERE cf.consultationBooking.consultant.userId = :consultantId")
    Double getAverageRatingByConsultantId(@Param("consultantId") Integer consultantId);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.consultationBooking.consultant.userId = :consultantId")
    Long getCountByConsultantId(@Param("consultantId") Integer consultantId);

    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf")
    Double getTotalAverageRating();

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.rating = :rating")
    Long countByRating(@Param("rating") Integer rating);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf")
    Long countAllRatings();

    // Custom delete operation
    @Modifying
    @Query(value = "DELETE FROM ConsultantFeedback WHERE FeedbackID = :feedbackId", nativeQuery = true)
    int deleteByFeedbackId(@Param("feedbackId") Integer feedbackId);
}
