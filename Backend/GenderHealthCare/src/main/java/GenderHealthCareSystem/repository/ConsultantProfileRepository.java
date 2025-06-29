package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConsultantProfileRepository extends JpaRepository<ConsultantProfile, Integer> {
    Optional<ConsultantProfile> findByConsultantUserId(Integer consultantId);
}
