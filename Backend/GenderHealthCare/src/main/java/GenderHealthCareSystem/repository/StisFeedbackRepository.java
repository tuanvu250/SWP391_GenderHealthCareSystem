package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StisFeedbackRepository extends JpaRepository<StisFeedback, Integer> {
    List<StisFeedback> findByStisService_ServiceId(Integer serviceId);

    boolean existsByStisBooking_BookingId(Integer bookingId);

    StisFeedback findByStisBooking_BookingId(Integer bookingId);
}