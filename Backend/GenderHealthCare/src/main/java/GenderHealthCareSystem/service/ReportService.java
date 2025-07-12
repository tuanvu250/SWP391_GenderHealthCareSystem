package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.DashboardResponse;
import GenderHealthCareSystem.dto.RevenueReport;
import GenderHealthCareSystem.dto.UserAndBookingReport;
import GenderHealthCareSystem.model.Invoice;
import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import GenderHealthCareSystem.repository.InvoiceRepository;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisInvoiceRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final UserRepository userRepository;
    private final StisBookingRepository stisBookingRepository;
    private final ConsultationBookingRepository consultationBookingRepository;
    private final StisInvoiceRepository stisInvoiceRepository;
    private final InvoiceRepository invoiceRepository;

    // Exchange rate for USD to VND conversion
    private static final double USD_TO_VND_RATE = 24000.0; // Example rate, should be updated with current rate

    // Method to generate a report of users and bookings
    public List<UserAndBookingReport> generateUserAndBookingReport() {
        List<UserAndBookingReport> reportList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < 7; i++) {
            UserAndBookingReport report = new UserAndBookingReport();
            report.setDate(now.toLocalDate());

            // Fetch the number of users registered on that date
            int usersCount = userRepository.countByCreatedAtBetween(
                    now.withHour(0).withMinute(0).withSecond(0),
                    now.withHour(23).withMinute(59).withSecond(59));
            report.setUsers(usersCount);

            // Fetch the number of STIs bookings on that date
            int stisBookingsCount = stisBookingRepository.countByBookingDateBetween(
                    now.withHour(0).withMinute(0).withSecond(0),
                    now.withHour(23).withMinute(59).withSecond(59));
            report.setBookings(stisBookingsCount);

            // Fetch the number of consultation bookings on that date
            int consultationBookingsCount = consultationBookingRepository.countByBookingDateBetween(
                    now.withHour(0).withMinute(0).withSecond(0),
                    now.withHour(23).withMinute(59).withSecond(59));
            report.setAppointments(consultationBookingsCount);
            now = now.minusDays(1);

            reportList.add(report);
        }
        return reportList;
    }

    /**
     * Generates monthly revenue reports for a specified number of months
     * @param numberOfMonths number of past months to include in the report
     * @return List of monthly revenue reports
     */
    public List<RevenueReport> generateMonthlyRevenueReport(int numberOfMonths) {
        List<RevenueReport> reports = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        for (int i = 0; i < numberOfMonths; i++) {
            YearMonth reportMonth = currentMonth.minusMonths(i);

            // Get start and end dates for the month
            LocalDateTime startOfMonth = reportMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = reportMonth.atEndOfMonth().atTime(23, 59, 59);

            // Generate report for this month
            RevenueReport monthReport = generateRevenueReportForMonth(reportMonth, startOfMonth, endOfMonth);
            reports.add(monthReport);
        }

        return reports;
    }

    /**
     * Generates a dashboard response with data for the specified number of days
     * @param days number of days to include in the report (default 31)
     * @return Dashboard data with statistics
     */
    public DashboardResponse getDashboardData(int days) {
        DashboardResponse dashboard = new DashboardResponse();

        List<String> dates = new ArrayList<>();
        List<Integer> consultingAppointments = new ArrayList<>();
        List<Integer> testingAppointments = new ArrayList<>();
        List<Long> totalRevenues = new ArrayList<>();
        List<Long> consultingRevenues = new ArrayList<>();
        List<Long> testingRevenues = new ArrayList<>();
        List<DashboardResponse.Detail> details = new ArrayList<>();

        LocalDate currentDate = LocalDate.now();

        // Initialize counters for total statistics
        int totalConsultingAppointments = 0;
        int totalTestingAppointments = 0;
        long totalConsultingRevenue = 0;
        long totalTestingRevenue = 0;

        // Generate data for each day (in reverse order - oldest to newest)
        for (int i = days - 1; i >= 0; i--) {
            LocalDate reportDate = currentDate.minusDays(i);
            dates.add(reportDate.toString());

            // Get start and end times for the day
            LocalDateTime startOfDay = reportDate.atStartOfDay();
            LocalDateTime endOfDay = reportDate.atTime(23, 59, 59);

            // Count appointments
            int consultingCount = consultationBookingRepository.countByBookingDateBetween(startOfDay, endOfDay);
            int testingCount = stisBookingRepository.countByBookingDateBetween(startOfDay, endOfDay);

            consultingAppointments.add(consultingCount);
            testingAppointments.add(testingCount);

            // Add to totals
            totalConsultingAppointments += consultingCount;
            totalTestingAppointments += testingCount;

            // Calculate revenue
            List<Invoice> consultationInvoices = invoiceRepository.findByPaidAtBetween(startOfDay, endOfDay);
            List<StisInvoice> stisInvoices = stisInvoiceRepository.findByPaidAtBetween(startOfDay, endOfDay);

            // Calculate revenue with currency conversion
            double consultingRevenue = calculateConsultationRevenue(consultationInvoices);
            double testingRevenue = calculateStisRevenue(stisInvoices);

            // Convert to long values
            long consultingRevenueLong = Math.round(consultingRevenue);
            long testingRevenueLong = Math.round(testingRevenue);
            long dailyTotalRevenue = consultingRevenueLong + testingRevenueLong;

            consultingRevenues.add(consultingRevenueLong);
            testingRevenues.add(testingRevenueLong);
            totalRevenues.add(dailyTotalRevenue);

            // Add to total revenue
            totalConsultingRevenue += consultingRevenueLong;
            totalTestingRevenue += testingRevenueLong;

            // Create daily detail object
            DashboardResponse.Detail dailyDetail = new DashboardResponse.Detail();
            dailyDetail.setDate(reportDate.toString());
            dailyDetail.setConsultingAppointments(consultingCount);
            dailyDetail.setTestingAppointments(testingCount);
            dailyDetail.setConsultingRevenue(consultingRevenueLong);
            dailyDetail.setTestingRevenue(testingRevenueLong);
            dailyDetail.setTotalRevenue(dailyTotalRevenue);

            details.add(dailyDetail);
        }

        // Create lists for total appointments
        List<Integer> totalAppointmentsList = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            totalAppointmentsList.add(consultingAppointments.get(i) + testingAppointments.get(i));
        }

        // Create the distribution
        DashboardResponse.Distribution distribution = new DashboardResponse.Distribution();
        distribution.setConsulting(totalConsultingAppointments);
        distribution.setTesting(totalTestingAppointments);

        // Create total statistics
        DashboardResponse.Totals totals = new DashboardResponse.Totals();
        totals.setTotalAppointments(totalConsultingAppointments + totalTestingAppointments);
        totals.setTotalConsultingAppointments(totalConsultingAppointments);
        totals.setTotalTestingAppointments(totalTestingAppointments);
        totals.setTotalConsultingRevenue(totalConsultingRevenue);
        totals.setTotalTestingRevenue(totalTestingRevenue);
        totals.setTotalRevenue(totalConsultingRevenue + totalTestingRevenue);

        // Create overview data
        DashboardResponse.Overview overview = new DashboardResponse.Overview();
        overview.setDates(dates);
        overview.setConsultingAppointments(consultingAppointments);
        overview.setTestingAppointments(testingAppointments);
        overview.setRevenue(totalRevenues);

        // Create revenue data
        DashboardResponse.Revenue revenue = new DashboardResponse.Revenue();
        revenue.setDates(dates);
        revenue.setConsulting(consultingRevenues);
        revenue.setTesting(testingRevenues);
        revenue.setTotal(totalRevenues);

        // Create appointment data
        DashboardResponse.Appointments appointments = new DashboardResponse.Appointments();
        appointments.setDates(dates);
        appointments.setConsulting(consultingAppointments);
        appointments.setTesting(testingAppointments);
        appointments.setTotal(totalAppointmentsList);

        // Set all data to the dashboard
        dashboard.setOverview(overview);
        dashboard.setRevenue(revenue);
        dashboard.setAppointments(appointments);
        dashboard.setDistribution(distribution);
        dashboard.setTotals(totals);
        dashboard.setDetails(details);

        return dashboard;
    }

    /**
     * Generates revenue report for a specific month
     */
    private RevenueReport generateRevenueReportForMonth(YearMonth month, LocalDateTime startDate, LocalDateTime endDate) {
        // Get all invoices for the month
        List<Invoice> consultationInvoices = invoiceRepository.findByPaidAtBetween(startDate, endDate);
        List<StisInvoice> stisInvoices = stisInvoiceRepository.findByPaidAtBetween(startDate, endDate);

        // Calculate consultation revenue (with currency conversion)
        double consultationRevenue = calculateConsultationRevenue(consultationInvoices);

        // Calculate STIs testing revenue (with currency conversion)
        double stisRevenue = calculateStisRevenue(stisInvoices);

        // Create and return the report
        RevenueReport report = new RevenueReport();
        report.setMonth(month);
        report.setConsultationRevenue(consultationRevenue);
        report.setStisTestingRevenue(stisRevenue);
        report.setTotalRevenue(consultationRevenue + stisRevenue);
        report.setConsultationCount(consultationInvoices.size());
        report.setStisTestingCount(stisInvoices.size());

        return report;
    }

    /**
     * Calculates total revenue from consultation invoices with currency conversion
     */
    private double calculateConsultationRevenue(List<Invoice> invoices) {
        return invoices.stream()
                .mapToDouble(invoice -> {
                    // Convert USD to VND if necessary
                    if (invoice.getCurrency() != null && invoice.getCurrency().equalsIgnoreCase("USD")) {
                        return invoice.getTotalAmount() * USD_TO_VND_RATE;
                    }
                    return invoice.getTotalAmount();
                })
                .sum();
    }

    /**
     * Calculates total revenue from STIs invoices with currency conversion
     */
    private double calculateStisRevenue(List<StisInvoice> invoices) {
        return invoices.stream()
                .mapToDouble(invoice -> {
                    // Convert USD to VND if necessary
                    if (invoice.getCurrency() != null && invoice.getCurrency().equalsIgnoreCase("USD")) {
                        return invoice.getTotalAmount() * USD_TO_VND_RATE;
                    }
                    return invoice.getTotalAmount();
                })
                .sum();
    }
}
