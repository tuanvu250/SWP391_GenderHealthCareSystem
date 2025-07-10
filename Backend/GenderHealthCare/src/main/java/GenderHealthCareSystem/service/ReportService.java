package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.UserAndBookingReport;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.UserRepository;
import jdk.jfr.Registered;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final UserRepository userRepository;
    private final StisBookingRepository stisBookingRepository;
    private final ConsultationBookingRepository consultationBookingRepository;
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
}
