package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository  extends JpaRepository<Invoice, Integer> {
    Optional<Invoice> findByConsultationBookingBookingId(Integer bookingId);
    List<Invoice> findByPaidAtBetween(LocalDateTime start, LocalDateTime end);
}
