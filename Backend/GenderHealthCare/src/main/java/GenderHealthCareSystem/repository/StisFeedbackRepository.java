package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StisFeedbackRepository extends JpaRepository<StisFeedback, Integer> {
    // Find by service
    List<StisFeedback> findByStisService_ServiceId(Integer serviceId);

    // Find by user
    List<StisFeedback> findByUserId(Integer userId);

    // Find by booking
    StisFeedback findByStisBooking_BookingId(Integer bookingId);

    // Check existence
    boolean existsByStisBooking_BookingId(Integer bookingId);
}
