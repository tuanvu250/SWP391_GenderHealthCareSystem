package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StisResultRepository extends JpaRepository<StisResult, Integer> {
    Optional<StisResult> findByStisBooking_BookingId(Integer bookingId);

    Page<StisResult> findAll(Pageable pageable);
}
