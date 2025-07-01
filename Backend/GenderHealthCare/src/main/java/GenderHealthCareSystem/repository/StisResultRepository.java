package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StisResultRepository extends JpaRepository<StisResult, Integer> {
    // Sử dụng query để lấy kết quả đầu tiên, tránh lỗi khi có nhiều kết quả
    @Query(value = "SELECT TOP 1 * FROM STIsResult WHERE booking_id = :bookingId ORDER BY ResultID ASC", nativeQuery = true)
    Optional<StisResult> findByStisBooking_BookingId(@Param("bookingId") Integer bookingId);

    List<StisResult> findAllByStisBooking_BookingId(Integer bookingId);

    Page<StisResult> findAll(Pageable pageable);
}
