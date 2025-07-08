package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.*;
import GenderHealthCareSystem.service.ConsultantBookingService;
import GenderHealthCareSystem.service.ConsultantInvoiceService;
import GenderHealthCareSystem.util.PageResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class ConsultantBookingController {

    private final ConsultantBookingService bookingService;
    private final ConsultantInvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ConsultantBookingResponse>> createBooking(
            @RequestBody @Valid ConsultantBookingRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        // Lấy customerId từ token JWT, không dùng giá trị từ client
        int customerId = Integer.parseInt(jwt.getClaimAsString("userID"));
        ConsultantBookingResponse response = bookingService.createBooking(request,customerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }



    // 3. Consultant: view all bookings with customer info
    @GetMapping("/consultant/schedule")
    public ResponseEntity<ApiResponse<List<ConsultantBookingDetailResponse>>> getConsultantSchedule(
            @AuthenticationPrincipal Jwt jwt) {
        int consultantId = Integer.parseInt(jwt.getClaimAsString("userID"));
        String role = jwt.getClaimAsString("role");
        if (!"CONSULTANT".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Bạn không có quyền truy cập lịch tư vấn."));
        }
        List<ConsultantBookingDetailResponse> schedule = bookingService.getScheduleForConsultant(consultantId);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    @GetMapping("/calendar/{consultantId}")
    public ResponseEntity<?> getConsultantCalendar(@PathVariable Integer consultantId) {
        var calendar = bookingService.getConsultantCalendar(consultantId);
        return ResponseEntity.ok(ApiResponse.success(calendar));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PageResponse<ConsultantBookingResponse>>> getBookingHistory(
            @RequestParam(required = false) Integer consultantId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @AuthenticationPrincipal Jwt jwt
    ) {
        int customerId = Integer.parseInt(jwt.getClaimAsString("userID"));
        LocalDateTime start = startDate != null && !startDate.isEmpty() ? LocalDateTime.parse(startDate) : null;
        LocalDateTime end = endDate != null && !endDate.isEmpty() ? LocalDateTime.parse(endDate) : null;

        Page<ConsultantBookingResponse> history = bookingService.getHistory(
                customerId, consultantId, start, end, page, size, sort
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK,
                        "Fetched booking history",
                        PageResponseUtil.mapToPageResponse(history),
                        null
                )
        );
    }
    @PutMapping("/cancel/{bookingId}")
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<RefundResponse> cancelBooking(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal Jwt jwt) {

        Integer customerId = ((Number) jwt.getClaim("userID")).intValue();
        String msg = invoiceService.requestRefund(bookingId, customerId);
        Double amount = invoiceService.getInvoiceByBooking(bookingId)
                .map(inv -> inv.getRefundAmount())
                .orElse(0.0);
        String status = invoiceService.getInvoiceByBooking(bookingId)
                .map(inv -> inv.getRefundStatus())
                .orElse("UNKNOWN");

        return ResponseEntity.ok(new RefundResponse(msg, amount, status));
    }

    /**
     * Customer đổi lịch tư vấn đã thanh toán
     */
    @PutMapping("/reschedule")
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<Map<String, String>> reschedule(
            @RequestBody RescheduleRequest req,
            @AuthenticationPrincipal Jwt jwt) {

        Integer customerId = ((Number) jwt.getClaim("userID")).intValue();
        String result = invoiceService.rescheduleBooking(
                req.getBookingId(), customerId, req.getNewBookingDate());
        return ResponseEntity.ok(Map.of("message", result));
    }

    @PutMapping("/update-meeting-link/{bookingId}")
    @PreAuthorize("hasRole('Staff')")
    public ResponseEntity<?> updateMeetingLink(
            @PathVariable Integer bookingId,
            @RequestParam String meetingLink) {
        try {
            invoiceService.updateMeetingLink(bookingId, meetingLink);
            return ResponseEntity.ok("Meeting link updated successfully.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<ApiResponse<String>> updateBookingStatus(
            @PathVariable Integer bookingId,
            @RequestParam String status,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            int consultantId = Integer.parseInt(jwt.getClaimAsString("userID"));
            bookingService.updateBookingStatus(bookingId, consultantId, status);
            return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully."));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("An error occurred while updating the booking status."));
        }
    }
}