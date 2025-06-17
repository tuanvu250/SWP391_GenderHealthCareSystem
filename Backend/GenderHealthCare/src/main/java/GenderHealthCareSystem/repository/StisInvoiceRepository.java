package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StisInvoiceRepository extends JpaRepository<StisInvoice, Integer> {
}
