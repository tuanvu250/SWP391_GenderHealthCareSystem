package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.ConsultantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultantProfileRepository extends JpaRepository<ConsultantProfile, Integer> {
    // Query theo Consultant (User) ID
    Optional<ConsultantProfile> findByConsultant_UserId(Integer userId);
}
