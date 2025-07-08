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

    List<ConsultantFeedback> findByConsultantProfile_ProfileId(Integer profileId);
    Page<ConsultantFeedback> findByConsultantProfile_ProfileId(Integer profileId, Pageable pageable);
    Page<ConsultantFeedback> findByConsultantProfile_ProfileIdAndRating(Integer profileId, Integer rating, Pageable pageable);

    List<ConsultantFeedback> findByConsultantProfile_Consultant_UserId(Integer consultantId);
    Page<ConsultantFeedback> findByConsultantProfile_Consultant_UserId(Integer consultantId, Pageable pageable);
    Page<ConsultantFeedback> findByConsultantProfile_Consultant_UserIdAndRating(Integer consultantId, Integer rating, Pageable pageable);

    List<ConsultantFeedback> findByCustomer_UserId(Integer customerId);
    Page<ConsultantFeedback> findByCustomer_UserId(Integer customerId, Pageable pageable);

    boolean existsByConsultationBooking_BookingId(Integer bookingId);
    ConsultantFeedback findByConsultationBooking_BookingId(Integer bookingId);

    boolean existsByCustomer_UserIdAndConsultantProfile_ProfileId(Integer customerId, Integer profileId);

    boolean existsByCustomer_UserIdAndConsultantProfile_Consultant_UserId(Integer customerId, Integer consultantId);

    Page<ConsultantFeedback> findByRating(Integer rating, Pageable pageable);

    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf WHERE cf.consultantProfile.consultant.userId = :consultantId")
    Double getAverageRatingByConsultantId(@Param("consultantId") Integer consultantId);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.consultantProfile.consultant.userId = :consultantId")
    Long getCountByConsultantId(@Param("consultantId") Integer consultantId);

    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf WHERE cf.consultantProfile.profileId = :profileId")
    Double getAverageRatingByProfileId(@Param("profileId") Integer profileId);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.consultantProfile.profileId = :profileId")
    Long getCountByProfileId(@Param("profileId") Integer profileId);

    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf")
    Double getTotalAverageRating();

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.rating = :rating")
    Long countByRating(@Param("rating") Integer rating);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf")
    Long countAllRatings();

    @Modifying
    @Query(value = "DELETE FROM ConsultantFeedback WHERE FeedbackID = :feedbackId", nativeQuery = true)
    int deleteByFeedbackId(@Param("feedbackId") Integer feedbackId);
}
