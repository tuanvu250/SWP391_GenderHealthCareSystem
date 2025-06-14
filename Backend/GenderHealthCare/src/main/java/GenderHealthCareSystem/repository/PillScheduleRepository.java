package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.PillSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PillScheduleRepository extends JpaRepository<PillSchedule, Integer> {
    // Lấy toàn bộ lịch của 1 pill, sắp xếp theo ngày
    List<PillSchedule> findByPill_PillIdOrderByPillDate(Integer pillId);

    // Lấy lịch chưa uống của 1 pill tại ngày hôm nay
    Optional<PillSchedule> findByPill_PillIdAndPillDateAndHasTakenFalse(Integer pillId, LocalDate date);

    // Lấy lịch trong 1 khoảng ngày cho 1 user (weekly summary)
    List<PillSchedule> findByPill_Customer_UserIdAndPillDateBetween(Integer userId, LocalDate from, LocalDate to);

    // Lấy lịch trước ngày hôm nay mà chưa đánh dấu (dùng finalize)
    List<PillSchedule> findByPillDateBeforeAndHasTakenFalse(LocalDate date);

    // API cho Web reminder: lấy reminder hằng ngày
    List<PillSchedule> findByPill_Customer_UserIdAndPillDateAndHasTakenFalse(Integer userId, LocalDate date);
}
