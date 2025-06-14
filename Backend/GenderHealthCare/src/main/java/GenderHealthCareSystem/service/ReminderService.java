package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.PillScheduleResponse;
import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final PillScheduleRepository scheduleRepo;

    /** Lấy reminder hằng ngày cho web (user đang login) */
    public List<PillScheduleResponse> getTodayReminders(Integer userId) {
        LocalDate today = LocalDate.now();
        return scheduleRepo
                .findByPill_Customer_UserIdAndPillDateAndHasTakenFalse(userId, today)
                .stream()
                .map(sch -> {
                    PillScheduleResponse dto = new PillScheduleResponse();
                    dto.setScheduleId(sch.getScheduleId());
                    dto.setPillDate(sch.getPillDate());
                    dto.setTimeOfDay(sch.getPill().getTimeOfDay());
                    dto.setPillType(sch.getPill().getPillType());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /** Đánh dấu đã uống/chưa uống */
    public void markTaken(Integer scheduleId, boolean taken) {
        PillSchedule sch = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found"));
        sch.setHasTaken(taken);
        scheduleRepo.save(sch);
    }
}
