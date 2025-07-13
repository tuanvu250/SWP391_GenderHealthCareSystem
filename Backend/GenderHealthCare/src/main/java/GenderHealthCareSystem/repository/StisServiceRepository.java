package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.StisService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StisServiceRepository
        extends JpaRepository<StisService, Integer>, JpaSpecificationExecutor<StisService> {

    List<StisService> findByType(String type);

    List<StisService> findByTypeAndStatus(String type, String status);
}
