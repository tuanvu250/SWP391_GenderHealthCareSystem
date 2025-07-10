package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.enums.BookingStatus;
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

    @Query("SELECT b FROM ConsultationBooking b WHERE (:customerName IS NULL OR LOWER(b.customer.fullName) LIKE LOWER(CONCAT('%', :customerName, '%'))) AND (:consultantName IS NULL OR LOWER(b.consultant.fullName) LIKE LOWER(CONCAT('%', :consultantName, '%')))")
    Page<ConsultationBooking> findByCustomerOrConsultantName(@Param("customerName") String customerName, @Param("consultantName") String consultantName, Pageable pageable);

    @Query("SELECT b FROM ConsultationBooking b WHERE (:customerName IS NULL OR LOWER(b.customer.fullName) LIKE LOWER(CONCAT('%', :customerName, '%'))) AND (:consultantName IS NULL OR LOWER(b.consultant.fullName) LIKE LOWER(CONCAT('%', :consultantName, '%'))) AND (:startDate IS NULL OR b.bookingDate >= :startDate) AND (:endDate IS NULL OR b.bookingDate <= :endDate) AND (:status IS NULL OR b.status = :status)")
    Page<ConsultationBooking> findByCustomerOrConsultantNameAndDateAndStatus(@Param("customerName") String customerName, @Param("consultantName") String consultantName, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("status") BookingStatus status, Pageable pageable);

    @Query("SELECT cb FROM ConsultationBooking cb WHERE cb.consultant.userId = :consultantId")
    Page<ConsultationBooking> findByConsultant(@Param("consultantId") Integer consultantId, Pageable pageable);
}
