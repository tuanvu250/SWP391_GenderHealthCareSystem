package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ConsultantBookingRequest;
import GenderHealthCareSystem.dto.ConsultantBookingResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.service.ConsultationBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class ConsultantBookingController {

    private final ConsultationBookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody ConsultantBookingRequest req,
            HttpServletRequest httpReq) {
        try {
            // Validate date format
            if (req.getBookingDate() == null) {
                throw new IllegalArgumentException("Invalid date format. Expected format: yyyy-MM-dd'T'HH:mm:ss");
            }

            Map<String,String> info = new HashMap<>();
            info.put("ip", httpReq.getRemoteAddr());
            ConsultantBookingResponse resp = bookingService.createBooking(req, info);
            return ResponseEntity.ok(ApiResponse.success(resp));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/payment-return")
    public ResponseEntity<?> paymentReturn(@RequestParam Map<String,String> params) {
        try {
            bookingService.confirmPayment(params);
            return ResponseEntity.ok(ApiResponse.success("Payment confirmed"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}/schedule")
    public ResponseEntity<?> getConsultantSchedule(@PathVariable Integer consultantId) {
        try {
            var schedule = bookingService.getConsultantSchedule(consultantId);
            return ResponseEntity.ok(ApiResponse.success(schedule));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}