package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users,Integer> {
    Optional<Users> findByPhone(String phone);


    @Query("SELECT u FROM Users u " +
            "WHERE (:name IS NULL OR u.fullName LIKE %:name%) " +
            "AND (:email IS NULL OR u.account.email LIKE %:email%) " +
            "AND (:phone IS NULL OR u.phone LIKE %:phone%) " +
            "AND (:startDate IS NULL OR u.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR u.createdAt <= :endDate)" +
            "AND (:status IS NULL OR u.account.accountStatus = :status) " +
            "AND (:role IS NULL OR u.role.roleName Like %:role%)")
    Page<Users> searchUsers(@Param("name") String name,
                            @Param("email") String email,
                            @Param("phone") String phone,
                            @Param("startDate") LocalDateTime startDate,
                            @Param("endDate") LocalDateTime endDate,
                            @Param("status") AccountStatus status,
                            @Param("role") String role,
                            Pageable pageable);
}

