package GenderHealthCareSystem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GenderHealthCareSystem.dto.MenstrualCalendarResponse;
import GenderHealthCareSystem.dto.MenstrualCycleRequest;
import GenderHealthCareSystem.dto.MenstrualCycleResponse;
import GenderHealthCareSystem.service.MenstrualCalendarService;
import GenderHealthCareSystem.service.MenstrualCycleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/menstrual")
@RequiredArgsConstructor
@Slf4j
public class MenstrualCycleController {

    private final MenstrualCycleService cycleService;
    private final MenstrualCalendarService calendarService;

    @PostMapping("/calculate")
    public ResponseEntity<?> createAndCalculateCycle(
            @RequestBody MenstrualCycleRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null || jwt.getClaimAsString("userID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        Integer userId;
        try {
            userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userID không hợp lệ trong token");
        }

        try {
            // Lưu chu kỳ mới vào DB
            MenstrualCycleResponse saved = cycleService.createMenstrualCycle(request, userId);

            // Tính số ngày hành kinh
            int menstruationDays = (int) (saved.getEndDate().toEpochDay() - saved.getStartDate().toEpochDay()) + 1;

            // Tính toán lịch từ dữ liệu người dùng nhập
            MenstrualCalendarResponse calendar = calendarService.buildCalendar(
                    null, //  bỏ cycleId để tránh phụ thuộc
                    saved.getStartDate(),
                    saved.getCycleLength(),
                    menstruationDays
            );

            return ResponseEntity.ok(calendar);

        } catch (Exception e) {
            log.error("Lỗi khi tạo và tính chu kỳ cho userID={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateCycle(
            @RequestBody MenstrualCycleRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null || jwt.getClaimAsString("userID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        Integer userId;
        try {
            userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userID không hợp lệ trong token");
        }

        try {
            // Save the updated cycle and recalculate predictions
            cycleService.updateMenstrualCycle(request, userId);

            // Fetch the latest cycle to ensure the data is up-to-date
            MenstrualCycleResponse latestCycle = cycleService.getLatestCycleForUser(userId);

            // Recalculate the calendar based on the updated cycle
            int menstruationDays = (int) (latestCycle.getEndDate().toEpochDay() - latestCycle.getStartDate().toEpochDay()) + 1;
            MenstrualCalendarResponse calendar = calendarService.buildCalendar(
                    latestCycle.getCycleId(),
                    latestCycle.getStartDate(),
                    latestCycle.getCycleLength(),
                    menstruationDays
            );

            return ResponseEntity.ok(calendar);

        } catch (Exception e) {
            log.error("Lỗi khi cập nhật chu kỳ cho userID={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }
}
