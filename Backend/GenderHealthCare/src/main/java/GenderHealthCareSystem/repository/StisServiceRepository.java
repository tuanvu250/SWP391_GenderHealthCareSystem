package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StisServiceRepository
        extends JpaRepository<StisService, Integer>, JpaSpecificationExecutor<StisService> {
}
