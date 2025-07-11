package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConsultantProfileRepository extends JpaRepository<ConsultantProfile, Integer> {
    Optional<ConsultantProfile> findByConsultantUserId(Integer consultantId);

    @Query("SELECT cp FROM ConsultantProfile cp WHERE cp.employmentStatus = true")
    List<ConsultantProfile> findActiveConsultants();
}
