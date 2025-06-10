package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.MenstrualCalendarResponse;
import GenderHealthCareSystem.service.MenstrualCalendarService;
import GenderHealthCareSystem.service.MenstrualCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menstrual/calendar")
@RequiredArgsConstructor
public class MenstrualCalendarController {

    private final MenstrualCycleService cycleService;
    private final MenstrualCalendarService calendarService;

    /**
     * GET /api/menstrual/calendar/me
     * Lấy lịch của chính user đang đăng nhập (dựa JWT)
     */
    @GetMapping("/me")
    public ResponseEntity<MenstrualCalendarResponse> getMyCalendar(
            @AuthenticationPrincipal Jwt jwt
    ) {
        // 1. Lấy userId từ JWT (claim "userId")
        Number userIdNum = jwt.getClaim("userID");
        if (userIdNum == null) {
            throw new IllegalArgumentException("Missing userId claim");
        }
        int userId = userIdNum.intValue();

        // 2. Lấy dữ liệu chu kỳ gần nhất
        var cycle = cycleService.getLatestCycleForUser(userId);

        // 3. Tính số ngày hành kinh (từ start đến endDate)
        int menstruationDays = (int) (cycle.getEndDate().toEpochDay()
                - cycle.getStartDate().toEpochDay()) + 1;

        // 4. Build calendar
        MenstrualCalendarResponse cal =
                calendarService.buildCalendar(
                        cycle.getCycleId(),
                        cycle.getStartDate(),
                        cycle.getCycleLength(),
                        menstruationDays
                );

        return ResponseEntity.ok(cal);
    }
}
