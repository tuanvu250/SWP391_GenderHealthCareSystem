package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Integer> {
}
