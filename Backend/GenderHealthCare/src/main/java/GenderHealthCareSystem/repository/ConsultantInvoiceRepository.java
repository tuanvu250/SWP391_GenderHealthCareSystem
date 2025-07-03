package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultantInvoiceRepository extends JpaRepository<Invoice, Integer> {
    Optional<Invoice> findByConsultationBookingBookingId(Integer bookingId);
}

