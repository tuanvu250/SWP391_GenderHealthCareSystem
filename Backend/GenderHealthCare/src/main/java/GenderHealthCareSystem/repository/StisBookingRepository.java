package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StisBookingRepository extends JpaRepository<StisBooking, Integer> {
    List<StisBooking> findByCustomer_UserId(Integer userId);

    Page<StisBooking> findAllByCustomer_FullNameAndStisService_ServiceId(String name, int serviceID, Pageable pageable);

    @Query("SELECT sb FROM StisBooking sb " +
            "WHERE (:name IS NULL OR sb.customer.fullName LIKE %:name%) " +
            "AND (:serviceID IS NULL OR sb.stisService.serviceId = :serviceID) " +
            "AND (:status IS NULL OR sb.status = :status)" +
            "AND (:startDateTime IS NULL OR sb.bookingDate >= :startDateTime) " +
            "AND (:endDateTime IS NULL OR sb.bookingDate <= :endDateTime)")
    Page<StisBooking> findByCustomerNameAndServiceIdAndStatus(@Param("name") String name,
                                                              @Param("serviceID") Integer serviceID,
                                                              @Param("status") StisBookingStatus status,
                                                              @Param("startDateTime") LocalDateTime startDateTime,
                                                              @Param("endDateTime") LocalDateTime endDateTime,
                                                              Pageable pageable);

    @Query("SELECT sb FROM StisBooking sb " +
            "WHERE (:ID = sb.customer.userId) " +
            "AND (:serviceID IS NULL OR sb.stisService.serviceId = :serviceID) " +
            "AND (:status IS NULL OR sb.status = :status)" +
            "AND (:startDateTime IS NULL OR sb.bookingDate >= :startDateTime) " +
            "AND (:endDateTime IS NULL OR sb.bookingDate <= :endDateTime)")
    Page<StisBooking> getHistory(@Param("ID") int ID,
                                 @Param("serviceID") Integer serviceID,
                                 @Param("startDateTime") LocalDateTime startDateTime,
                                 @Param("endDateTime") LocalDateTime endDateTime,
                                 @Param("status") StisBookingStatus status,
                                 Pageable pageable);

    @Query("SELECT COUNT(sb) FROM StisBooking sb " +
            "WHERE sb.customer.userId = :userId " +
            "AND sb.bookingDate BETWEEN :startOfDay AND :endOfDay")
    long countByUserIdAndBookingDate(
            @Param("userId") Integer userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);


}
