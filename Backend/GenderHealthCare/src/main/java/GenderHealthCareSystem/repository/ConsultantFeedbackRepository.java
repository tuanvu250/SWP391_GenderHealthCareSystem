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

    boolean existsByConsultationBooking_BookingId(Integer bookingId);
    ConsultantFeedback findByConsultationBooking_BookingId(Integer bookingId);

    boolean existsByCustomer_UserIdAndConsultantProfile_Consultant_UserId(Integer customerId, Integer consultantId);
    
    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf WHERE cf.consultantProfile.consultant.userId = :consultantId")
    Double getAverageRatingByConsultantId(@Param("consultantId") Integer consultantId);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.consultantProfile.consultant.userId = :consultantId")
    Long getCountByConsultantId(@Param("consultantId") Integer consultantId);

    // Removed unused ProfileId statistics methods

    @Query("SELECT AVG(cf.rating) FROM ConsultantFeedback cf")
    Double getTotalAverageRating();

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf WHERE cf.rating = :rating")
    Long countByRating(@Param("rating") Integer rating);

    @Query("SELECT COUNT(cf) FROM ConsultantFeedback cf")
    Long countAllRatings();

    @Modifying
    @Query(value = "DELETE FROM ConsultantFeedback WHERE FeedbackID = :feedbackId", nativeQuery = true)
    int deleteByFeedbackId(@Param("feedbackId") Integer feedbackId);

    // Search methods
    @Query("SELECT cf FROM ConsultantFeedback cf WHERE " +
           "(:consultantId IS NULL OR cf.consultantProfile.consultant.userId = :consultantId) AND " +
           "(:rating IS NULL OR cf.rating = :rating) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(cf.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(cf.customer.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(cf.consultantProfile.consultant.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ConsultantFeedback> findAllWithFilters(@Param("consultantId") Integer consultantId,
                                                @Param("rating") Integer rating,
                                                @Param("search") String search,
                                                Pageable pageable);

    @Query("SELECT cf FROM ConsultantFeedback cf WHERE " +
           "cf.consultantProfile.consultant.userId = :consultantId AND " +
           "(:rating IS NULL OR cf.rating = :rating) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(cf.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(cf.customer.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ConsultantFeedback> findByConsultantIdWithSearchAndRating(@Param("consultantId") Integer consultantId,
                                                                   @Param("rating") Integer rating,
                                                                   @Param("search") String search,
                                                                   Pageable pageable);

    @Query("SELECT cf FROM ConsultantFeedback cf WHERE " +
           "cf.customer.userId = :customerId AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(cf.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(cf.consultantProfile.consultant.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ConsultantFeedback> findByCustomerIdWithSearch(@Param("customerId") Integer customerId,
                                                        @Param("search") String search,
                                                        Pageable pageable);
}
