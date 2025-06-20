package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.DayInfo;
import GenderHealthCareSystem.dto.DayType;
import GenderHealthCareSystem.dto.MenstrualCalendarResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenstrualCalendarService {

    @Autowired
    private EmailService emailService;

    /**
     * Dự đoán nhiều chu kỳ sinh sản bắt đầu từ startDate. Trả về danh sách các
     * ngày để hiển thị lịch theo nhiều tháng.
     */
    public MenstrualCalendarResponse buildCalendar(
            Integer cycleId,
            LocalDate startDate,
            int cycleLength,
            int menstruationDays
    ) {
        List<DayInfo> days = new ArrayList<>();

        int numberOfCycles = 6; // Dự đoán 6 chu kỳ liên tiếp
        for (int cycle = 0; cycle < numberOfCycles; cycle++) {
            LocalDate cycleStart = startDate.plusDays(cycle * cycleLength);
            LocalDate ovulationDate = cycleStart.plusDays(cycleLength - 14);

            for (int day = 0; day < cycleLength; day++) {
                LocalDate currentDate = cycleStart.plusDays(day);
                DayType type = DayType.NORMAL;

                if (day < menstruationDays) {
                    type = DayType.MENSTRUATION;
                } else {
                    long dist = Math.abs(currentDate.toEpochDay() - ovulationDate.toEpochDay());
                    if (dist <= 1) {
                        type = DayType.HIGH_FERTILITY;
                    } else if (dist <= 3) {
                        type = DayType.MEDIUM_FERTILITY;
                    }
                }

                days.add(new DayInfo(currentDate, type));
            }
        }

        return new MenstrualCalendarResponse(
                cycleId,
                startDate,
                cycleLength,
                days
        );
    }

    public void sendFertilityNotifications(String userEmail,
                                           LocalDate startDate,
                                           int cycleLength,
                                           int menstruationDays) {
        LocalDate today = LocalDate.now();

        int numberOfCycles = 6;
        for (int cycle = 0; cycle < numberOfCycles; cycle++) {
            LocalDate cycleStart = startDate.plusDays((long) cycle * (long) cycleLength);
            LocalDate ovulationDate = cycleStart.plusDays(cycleLength - 14);

            for (int day = 0; day < cycleLength; day++) {
                LocalDate currentDate = cycleStart.plusDays(day);
                // chỉ quan tâm sau ngày kinh
                if (day < menstruationDays) continue;

                long dist = Math.abs(currentDate.toEpochDay() - ovulationDate.toEpochDay());
                // lọc ngày hôm nay hoặc trước mỗi giai đoạn 1 ngày
                if (!(currentDate.minusDays(1).isEqual(today) || currentDate.isEqual(today))) {
                    continue;
                }

                // giờ gửi theo type
                if (dist <= 1) {
                    emailService.sendFertilityNotificationEmail(
                            userEmail,
                            "Thông báo: Giai đoạn khả năng mang thai cao",
                            "Bạn sắp bước vào giai đoạn khả năng mang thai cao từ "
                                    + currentDate + " đến " + currentDate.plusDays(1)
                    );
                } else if (dist <= 3) {
                    emailService.sendFertilityNotificationEmail(
                            userEmail,
                            "Thông báo: Giai đoạn khả năng mang thai trung bình",
                            "Bạn sắp bước vào giai đoạn khả năng mang thai trung bình từ "
                                    + currentDate + " đến " + currentDate.plusDays(2)
                    );
                } else if (dist <= 5) {
                    emailService.sendFertilityNotificationEmail(
                            userEmail,
                            "Thông báo: Giai đoạn khả năng mang thai thấp",
                            "Bạn sắp bước vào giai đoạn khả năng mang thai thấp từ "
                                    + currentDate + " đến " + currentDate.plusDays(4)
                    );
                }
            }
        }
    }

}
