package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.PillScheduleResponse;
import GenderHealthCareSystem.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pills")
@RequiredArgsConstructor
public class PillReminderController {
    private final ReminderService reminderService;

    /**
     * GET /api/pills/reminders/today
     * Trả về reminder cho ngày hôm nay (dùng JWT lấy userID)
     */
    @GetMapping("/reminders/today")
    public ResponseEntity<List<PillScheduleResponse>> getTodayReminders(
            @AuthenticationPrincipal Jwt jwt) {

        Number userIdNum = jwt.getClaim("userID");
        if (userIdNum == null) {
            return ResponseEntity.status(401).build();
        }
        Integer userId = userIdNum.intValue();

        List<PillScheduleResponse> reminders =
                reminderService.getTodayReminders(userId);
        return ResponseEntity.ok(reminders);
    }

    /**
     * POST /api/pills/schedule/{id}/mark?taken=true
     * User tick đã uống/chưa uống trên web
     */
    @PostMapping("/schedule/{id}/mark")
    public ResponseEntity<Void> markTaken(
            @PathVariable Integer id,
            @RequestParam boolean taken) {

        reminderService.markTaken(id, taken);
        return ResponseEntity.ok().build();
    }
}
