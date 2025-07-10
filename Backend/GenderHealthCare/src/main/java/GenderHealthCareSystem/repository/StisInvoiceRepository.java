package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StisInvoiceRepository extends JpaRepository<StisInvoice, Integer> {
    List<StisInvoice> findByPaidAtBetween(LocalDateTime start, LocalDateTime end);
    Optional<StisInvoice> findByStisBookingBookingId(Integer bookingId);
}
