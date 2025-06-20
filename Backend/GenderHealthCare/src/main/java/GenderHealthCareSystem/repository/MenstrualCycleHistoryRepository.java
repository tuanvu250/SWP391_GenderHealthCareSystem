package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.MenstrualCycleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenstrualCycleHistoryRepository extends JpaRepository<MenstrualCycleHistory, Integer> {
}
