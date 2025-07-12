package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.DashboardResponse;
import GenderHealthCareSystem.dto.RevenueReport;
import GenderHealthCareSystem.dto.UserAndBookingReport;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/monthly-revenue")
    public ResponseEntity<ApiResponse<List<RevenueReport>>> getMonthlyRevenueReport(
            @RequestParam(value = "months", defaultValue = "6") int numberOfMonths) {
        List<RevenueReport> revenueReports = reportService.generateMonthlyRevenueReport(numberOfMonths);
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Monthly Revenue Report with VND conversion",
                revenueReports,
                null));
    }

    /**
     * Get dashboard data with comprehensive statistics
     * @param days number of days to include in the report (default 31)
     * @return Dashboard data with detailed statistics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @RequestParam(value = "days", defaultValue = "31") int days) {
        DashboardResponse dashboard = reportService.getDashboardData(days);
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Dashboard Data",
                dashboard,
                null));
    }
}
