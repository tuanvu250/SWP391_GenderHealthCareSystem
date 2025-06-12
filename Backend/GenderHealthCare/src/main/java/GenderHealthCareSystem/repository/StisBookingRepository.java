package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StisBookingRepository extends JpaRepository<StisBooking, Integer> {
    List<StisBooking> findByCustomer_UserId(Integer userId);
}
