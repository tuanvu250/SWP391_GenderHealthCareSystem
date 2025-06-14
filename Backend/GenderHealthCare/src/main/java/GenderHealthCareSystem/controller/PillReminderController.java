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

    @GetMapping("/reminders/today")
    public ResponseEntity<List<PillScheduleResponse>> getTodayReminders(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = jwt.getClaim("userID");
        return ResponseEntity.ok(reminderService.getTodayReminders(userId));
    }

    @PostMapping("/schedule/{id}/mark")
    public ResponseEntity<Void> markTaken(@PathVariable Integer id,
                                          @RequestParam boolean taken) {
        reminderService.markTaken(id, taken);
        return ResponseEntity.ok().build();
    }
}
