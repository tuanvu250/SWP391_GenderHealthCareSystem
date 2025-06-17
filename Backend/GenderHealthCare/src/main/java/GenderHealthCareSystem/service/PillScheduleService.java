package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PillScheduleService {

    private final PillScheduleRepository scheduleRepo;

    /**
     * Sinh tự động lịch uống cho một đơn thuốc.
     * @param pill đối tượng Pills vừa được tạo, chứa thông tin startDate và pillType (số ngày)
     */
    public List<PillSchedule> generateSchedule(Pills pill) {
        int days = Integer.parseInt(pill.getPillType());
        LocalDate start = pill.getStartDate();
        List<PillSchedule> schedules = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            PillSchedule sch = new PillSchedule();
            sch.setPill(pill);
            sch.setPillDate(start.plusDays(i));
            // Với loại 28 ngày, 7 ngày cuối là placebo
            sch.setIsPlacebo(days == 28 && i >= 21);
            // hasTaken mặc định false, confirmToken tự sinh trong @PrePersist
            scheduleRepo.save(sch);
            schedules.add(sch);
        }

        return schedules;
    }
}
