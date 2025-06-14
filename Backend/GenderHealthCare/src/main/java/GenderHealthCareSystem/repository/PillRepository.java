package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Pills;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PillRepository extends JpaRepository<Pills, Integer> {
    // Lấy tất cả pills active của 1 user
    List<Pills> findByCustomer_UserIdAndIsActiveTrue(Integer userId);

    // Lấy tất cả pills active (dùng cho scheduler gửi cho mọi user)
    List<Pills> findByIsActiveTrue();
}
