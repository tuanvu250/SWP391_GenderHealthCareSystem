package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.MenstrualCycle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Integer> {
    // Có thể custom thêm: findByCustomerId, findByStartDateBetween,...
}
