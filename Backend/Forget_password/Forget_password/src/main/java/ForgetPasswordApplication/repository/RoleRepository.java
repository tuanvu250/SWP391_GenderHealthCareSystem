package ForgetPasswordApplication.repository;

import ForgetPasswordApplication.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Integer> {
}
