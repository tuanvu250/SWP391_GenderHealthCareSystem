package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationBookingRepository
        extends JpaRepository<ConsultationBooking, Integer> {

    /**
     * Kiểm tra xem có booking nào cho consultant này
     * trong khoảng [slotStart, slotEnd) hay không.
     */
    boolean existsByConsultantAndBookingDateBetween(
            Users consultant,
            LocalDateTime slotStart,
            LocalDateTime slotEnd
    );

    /**
     * Kiểm tra xem có booking nào cho consultant này
     * trong khoảng [slotStart, slotEnd) hay không.
     */
    Optional<ConsultationBooking> findByConsultantAndBookingDateBetween(Users consultant, LocalDateTime slotStart, LocalDateTime slotEnd);

    @Query("SELECT cb FROM ConsultationBooking cb WHERE cb.consultant.userId = :consultantId AND cb.bookingDate BETWEEN :slotStart AND :slotEnd")
    Optional<ConsultationBooking> findConflict(@Param("consultantId") Integer consultantId, @Param("slotStart") LocalDateTime slotStart, @Param("slotEnd") LocalDateTime slotEnd);

    List<ConsultationBooking> findByConsultant(Users consultant);
}

