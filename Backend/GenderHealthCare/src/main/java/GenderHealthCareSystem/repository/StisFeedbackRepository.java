package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for STIS feedback operations
 */
public interface StisFeedbackRepository extends JpaRepository<StisFeedback, Integer> {
    /**
     * Find all feedback for a specific service
     * 
     * @param serviceId the ID of the service
     * @return list of feedback for the service
     */
    List<StisFeedback> findByStisService_ServiceId(Integer serviceId);

    /**
     * Check if feedback exists for a specific booking
     * 
     * @param bookingId the ID of the booking
     * @return true if feedback exists, false otherwise
     */
    boolean existsByStisBooking_BookingId(Integer bookingId);

    /**
     * Find feedback by booking ID
     * 
     * @param bookingId the ID of the booking
     * @return the feedback for the booking
     */
    StisFeedback findByStisBooking_BookingId(Integer bookingId);

    /**
     * Find all feedback by user ID with pagination
     * 
     * @param userId   the ID of the user
     * @param pageable pagination information
     * @return page of feedback for the user
     */
    Page<StisFeedback> findByUserId(Integer userId, Pageable pageable);

    /**
     * Find all feedback by user ID and status with pagination
     * 
     * @param userId   the ID of the user
     * @param status   the status of the feedback
     * @param pageable pagination information
     * @return page of feedback for the user with the specified status
     */
    Page<StisFeedback> findByUserIdAndStatus(Integer userId, String status, Pageable pageable);

    /**
     * Find all feedback for a specific service with the specified status
     * 
     * @param serviceId the ID of the service
     * @param status    the status of the feedback
     * @return list of feedback for the service with the specified status
     */
    List<StisFeedback> findByStisService_ServiceIdAndStatus(Integer serviceId, String status);

}
