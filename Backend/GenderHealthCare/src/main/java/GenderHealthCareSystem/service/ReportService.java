package GenderHealthCareSystem.service;

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

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

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
