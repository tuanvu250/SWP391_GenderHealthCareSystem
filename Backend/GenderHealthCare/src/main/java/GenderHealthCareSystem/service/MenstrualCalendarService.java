package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.DayInfo;
import GenderHealthCareSystem.dto.DayType;
import GenderHealthCareSystem.dto.MenstrualCalendarResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenstrualCalendarService {

    /**
     * Build lịch với từng ngày gán DayType
     * @param cycleId       ID chu kỳ
     * @param startDate     Ngày bắt đầu hành kinh
     * @param cycleLength   Tổng độ dài chu kỳ
     * @param menstruationDays Số ngày hành kinh (từ startDate)
     */
    public MenstrualCalendarResponse buildCalendar(
            Integer cycleId,
            LocalDate startDate,
            int cycleLength,
            int menstruationDays
    ) {
        List<DayInfo> days = new ArrayList<>(cycleLength);

        // Tính ngày rụng trứng: thường là start + (cycleLength - 14) - 1
        int ovulationOffset = cycleLength - 14;
        LocalDate ovulationDate = startDate.plusDays(ovulationOffset - 1);

        // Khoảng thụ thai: [ovulation -5, ovulation +1]
        LocalDate fertileStart = ovulationDate.minusDays(5);
        LocalDate fertileEnd   = ovulationDate.plusDays(1);

        for (int i = 0; i < cycleLength; i++) {
            LocalDate date = startDate.plusDays(i);
            DayType type = DayType.NORMAL;

            // 1) Ngày hành kinh
            if (i < menstruationDays) {
                type = DayType.MENSTRUATION;
            }
            // 2) Ngày khả năng thụ thai
            else if (!date.isBefore(fertileStart) && !date.isAfter(fertileEnd)) {
                long dist = Math.abs(date.toEpochDay() - ovulationDate.toEpochDay());
                if (dist <= 1) {
                    type = DayType.HIGH_FERTILITY;
                } else if (dist <= 3) {
                    type = DayType.MEDIUM_FERTILITY;
                } else {
                    type = DayType.LOW_FERTILITY;
                }
            }

            days.add(new DayInfo(date, type));
        }

        return new MenstrualCalendarResponse(cycleId, startDate, cycleLength, days);
    }
}
