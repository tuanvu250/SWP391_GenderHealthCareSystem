package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.UserAndBookingReport;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    @GetMapping("/user-and-booking")
    public ResponseEntity<ApiResponse<List<UserAndBookingReport>>> getUserAndBookingReport() {
        List<UserAndBookingReport> report = reportService.generateUserAndBookingReport();
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "User and Booking Report", report, null));
    }
}
