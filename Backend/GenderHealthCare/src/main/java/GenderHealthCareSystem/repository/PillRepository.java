package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Pills;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PillRepository extends JpaRepository<Pills, Integer> {
}
