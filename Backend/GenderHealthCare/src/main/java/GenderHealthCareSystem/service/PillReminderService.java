package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.PillRepository;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PillReminderService {
    private final PillRepository pillRepository;
    private final PillScheduleRepository scheduleRepository;
    private final JavaMailSender mailSender;
    private final AccountRepository accountRepository;

    /** Gửi mail & (optionally) in‑app notification mỗi ngày 07:00 */
    @Scheduled(cron = "0 0 7 * * *")
    public void sendReminders() {
        LocalDate today = LocalDate.now();
        for (Pills pill : pillRepository.findByIsActiveTrue()) {
            // Check schedule chưa uống hôm nay
            if (scheduleRepository
                    .findByPill_PillIdAndPillDateAndHasTakenFalse(pill.getPillId(), today)
                    .isEmpty()) continue;

            // DAILY luôn gửi, WEEKLY chỉ gửi khi đúng bội 7
            boolean send = pill.getNotificationFrequency() == Pills.NotificationFrequency.DAILY;
            if (!send && pill.getNotificationFrequency() == Pills.NotificationFrequency.WEEKLY) {
                long offset = ChronoUnit.DAYS.between(pill.getStartDate(), today);
                send = offset % 7 == 0;
            }
            if (!send) continue;

            // Lấy schedule để có token
            PillSchedule sch = scheduleRepository
                    .findByPill_PillIdAndPillDateAndHasTakenFalse(pill.getPillId(), today).get();

            String link = String.format(
                    "https://your-domain.com/pills/schedule/%d/confirm?token=%s",
                    sch.getScheduleId(), sch.getConfirmToken()
            );

            Optional<Account> optAcct = accountRepository.findByUsers_UserId(pill.getCustomer().getUserId());
            if (optAcct.isEmpty()) continue; // Không có tài khoản => bỏ qua
            String email = optAcct.get().getEmail();
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Nhắc uống thuốc ngày " + today);
            msg.setText(
                    "Chào " + pill.getCustomer().getFullName() + ",\n\n" +
                            "Bạn cần uống thuốc loại " + pill.getPillType() + " vào hôm nay.\n" +
                            "Nếu đã uống, click vào đây:\n" + link
            );
            mailSender.send(msg);
            // TODO: đẩy in‑app notification nếu cần
        }
    }
}