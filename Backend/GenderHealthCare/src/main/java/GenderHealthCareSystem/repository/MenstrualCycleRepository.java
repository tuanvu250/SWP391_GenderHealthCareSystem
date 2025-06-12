package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.MenstrualCycle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Integer> {
    // Có thể custom thêm: findByCustomerId, findByStartDateBetween,...
    Optional<MenstrualCycle> findFirstByCustomerUserIdOrderByStartDateDesc(Integer userId);

}
