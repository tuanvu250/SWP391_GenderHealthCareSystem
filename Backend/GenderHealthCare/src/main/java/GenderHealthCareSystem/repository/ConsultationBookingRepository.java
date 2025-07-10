package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


    List<ConsultationBooking> findByConsultant(Users consultant);

    @Query("SELECT cb FROM ConsultationBooking cb " +
            "WHERE cb.customer.userId = :customerId " +
            "AND (:consultantId IS NULL OR cb.consultant.userId = :consultantId) " +
            "AND (:startDateTime IS NULL OR cb.bookingDate >= :startDateTime) " +
            "AND (:endDateTime IS NULL OR cb.bookingDate <= :endDateTime)")
    Page<ConsultationBooking> getHistory(
            @Param("customerId") int customerId,
            @Param("consultantId") Integer consultantId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            Pageable pageable
    );

    List<ConsultationBooking> findByCustomer_UserId(Integer customerId);

    @Query("SELECT b FROM ConsultationBooking b WHERE b.consultant.userId = :consultantId AND b.bookingDate BETWEEN :start AND :end")
    Optional<ConsultationBooking> findConflict(@Param("consultantId") Integer consultantId,
                                               @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);
    boolean existsByConsultantAndBookingDate(Users consultant, LocalDateTime bookingDate);

    List<ConsultationBooking> findByBookingDateBetween(LocalDateTime startDate, LocalDateTime endDate);


    int countByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore);
}
