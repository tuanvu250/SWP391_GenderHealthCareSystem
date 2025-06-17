package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.PillScheduleResponse;
import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pills/schedule")
@RequiredArgsConstructor
public class PillScheduleController {
    private final PillScheduleRepository repo;

    /**
     * ✅ GET /api/pills/schedule/all
     * Trả về toàn bộ lịch uống thuốc của user đang đăng nhập (dựa trên token)
     */
    @GetMapping("/all")
    public ResponseEntity<List<PillScheduleResponse>> getScheduleByUser(@AuthenticationPrincipal Jwt jwt) {
        Number userIdNum = jwt.getClaim("userID");
        if (userIdNum == null) {
            throw new IllegalArgumentException("Missing userID claim in token");
        }
        Integer userId = userIdNum.intValue();

        List<PillScheduleResponse> dtos = repo
                .findByPill_Customer_UserId(userId)
                .stream()
                .map(sch -> new PillScheduleResponse(
                        sch.getScheduleId(),
                        sch.getPillDate(),
                        sch.getPill().getTimeOfDay(),
                        sch.getPill().getPillType(),
                        sch.getHasTaken(),
                        sch.getIsPlacebo()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * ✅ GET /api/pills/schedule/{id}/confirm?token=...
     * Xác nhận đã uống qua link trong email
     */
    @GetMapping("/{id}/confirm")
    public ResponseEntity<String> confirmTaken(
            @PathVariable Integer id,
            @RequestParam("token") String token) {

        PillSchedule sch = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!token.equals(sch.getConfirmToken())) {
            throw new RuntimeException("Invalid token");
        }

        sch.setHasTaken(true);
        //sch.setConfirmToken(null);
        repo.save(sch);

        String html = "<h3>✅ Bạn đã xác nhận uống ngày " + sch.getPillDate() + " thành công!</h3>";
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
