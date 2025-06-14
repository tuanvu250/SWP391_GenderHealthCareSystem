package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/pills/schedule")
@RequiredArgsConstructor
public class PillScheduleController {
    private final PillScheduleRepository repo;

    @GetMapping("/{id}/confirm")
    public ResponseEntity<String> confirmTaken(@PathVariable Integer id,
                                               @RequestParam("token") String token) {
        PillSchedule sch = repo.findById(id).orElseThrow();
        if (!token.equals(sch.getConfirmToken())) throw new RuntimeException("Invalid token");
        sch.setHasTaken(true);
        sch.setConfirmToken(null);
        repo.save(sch);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<h3>✅ Đã xác nhận uống ngày " + sch.getPillDate() + "</h3>");
    }

    @GetMapping("/pill/{pillId}")
    public List<PillSchedule> getSchedule(@PathVariable Integer pillId) {
        return repo.findByPill_PillIdOrderByPillDate(pillId);
    }
}
