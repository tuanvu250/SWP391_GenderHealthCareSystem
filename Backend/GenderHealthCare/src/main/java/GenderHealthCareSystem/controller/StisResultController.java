package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.StisResultRequest;
import GenderHealthCareSystem.dto.StisResultResponse;
import GenderHealthCareSystem.model.StisResult;
import GenderHealthCareSystem.service.StisResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stis-results")
@RequiredArgsConstructor
public class StisResultController {

    private final StisResultService stisResultService;

    @PostMapping("/return/{bookingId}")
    public ResponseEntity<?> returnResult(@PathVariable Integer bookingId, @RequestBody StisResultRequest req) {

        try {
            StisResult result = stisResultService.createResult(bookingId, req);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/by-booking/{bookingId}")
    public ResponseEntity<?> getResultByBooking(@PathVariable Integer bookingId) {
        return stisResultService.getResultByBookingId(bookingId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy kết quả cho booking này!"));
    }
}

