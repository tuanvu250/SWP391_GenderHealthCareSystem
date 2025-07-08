package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultantBookingReminder {

    private final ConsultationBookingRepository bookingRepository;
    private final JavaMailSender mailSender;

    @Scheduled(cron = "0 */5 * * * *") // Chạy mỗi 5 phút
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusMinutes(30); // Nhắc nhở trước 30 phút

        List<ConsultationBooking> upcomingBookings = bookingRepository.findByBookingDateBetween(now, reminderTime);

        for (ConsultationBooking booking : upcomingBookings) {
            String customerEmail = booking.getCustomer().getAccount().getEmail();
            String subject = "Nhắc nhở buổi tư vấn sắp diễn ra";
            String message = String.format(
                "Xin chào %s,\n\nBuổi tư vấn của bạn với chuyên gia %s sẽ diễn ra vào lúc %s.\n\nGhi chú: %s\n\nVui lòng chuẩn bị sẵn sàng.",
                booking.getCustomer().getFullName(),
                booking.getConsultant().getFullName(),
                booking.getBookingDate().toString(),
                booking.getNote() != null ? booking.getNote() : "Không có ghi chú"
            );

            sendEmail(customerEmail, subject, message);
        }
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Không thể gửi email tới: " + to + ", lỗi: " + e.getMessage());
        }
    }
}
