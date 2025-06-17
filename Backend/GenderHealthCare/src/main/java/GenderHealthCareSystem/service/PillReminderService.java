package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.PillSchedule;
import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.PillRepository;
import GenderHealthCareSystem.repository.PillScheduleRepository;
import jakarta.transaction.Transactional;
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
//    @Scheduled(cron = "0 * * * * *")
//    public void sendReminders() {
//        LocalDate today = LocalDate.now();
//        for (Pills pill : pillRepository.findByIsActiveTrue()) {
//            // Check schedule chưa uống hôm nay
//            if (scheduleRepository
//                    .findByPill_PillIdAndPillDateAndHasTakenFalse(pill.getPillId(), today)
//                    .isEmpty()) continue;
//
//            // DAILY luôn gửi, WEEKLY chỉ gửi khi đúng bội 7
//            boolean send = pill.getNotificationFrequency() == Pills.NotificationFrequency.DAILY;
//            if (!send && pill.getNotificationFrequency() == Pills.NotificationFrequency.WEEKLY) {
//                long offset = ChronoUnit.DAYS.between(pill.getStartDate(), today);
//                send = offset % 7 == 0;
//            }
//            if (!send) continue;
//
//            // Lấy schedule để có token
//            PillSchedule sch = scheduleRepository
//                    .findByPill_PillIdAndPillDateAndHasTakenFalse(pill.getPillId(), today).get();
//
//            String link = String.format(
//                    "http://localhost:8080/api/pills/schedule/%d/confirm?token=%s",
//                    sch.getScheduleId(), sch.getConfirmToken()
//            );
//
//            Optional<Account> optAcct = accountRepository.findByUsers_UserId(pill.getCustomer().getUserId());
//            if (optAcct.isEmpty()) continue; // Không có tài khoản => bỏ qua
//            String email = optAcct.get().getEmail();
//            SimpleMailMessage msg = new SimpleMailMessage();
//            msg.setTo(email);
//            msg.setSubject("Nhắc uống thuốc ngày " + today);
//            msg.setText(
//                    "Chào " + pill.getCustomer().getFullName() + ",\n\n" +
//                            "Bạn cần uống thuốc loại " + pill.getPillType() + " vào hôm nay.\n" +
//                            "Nếu đã uống, click vào đây:\n" + link
//            );
//            mailSender.send(msg);
//            System.out.println("📨 Đã gửi mail đến: " + email);
//            // TODO: đẩy in‑app notification nếu cần
//        }
//    }
    @Transactional
    @Scheduled(cron = "0 * * * * *") // Mỗi phút
    public void sendReminders() {
        LocalDate today = LocalDate.now();
        System.out.println("⏰ Bắt đầu kiểm tra gửi mail vào: " + today);

        for (Pills pill : pillRepository.findByIsActiveTrue()) {
            System.out.println("🔍 Đang xét pillID: " + pill.getPillId());

            Optional<PillSchedule> optSch = scheduleRepository
                    .findByPill_PillIdAndPillDateAndHasTakenFalse(pill.getPillId(), today);

            if (optSch.isEmpty()) {
                System.out.println("⛔ Không có lịch uống hôm nay chưa uống cho pillID: " + pill.getPillId());
                continue;
            }
            System.out.println("✅ Tìm thấy lịch uống hôm nay chưa uống.");

            boolean send = pill.getNotificationFrequency() == Pills.NotificationFrequency.DAILY;
            if (!send && pill.getNotificationFrequency() == Pills.NotificationFrequency.WEEKLY) {
                long offset = ChronoUnit.DAYS.between(pill.getStartDate(), today);
                send = offset % 7 == 0;
                System.out.println("📆 Tần suất weekly - offset: " + offset + ", gửi? " + send);
            }

            if (!send) {
                System.out.println("🚫 Không đến ngày gửi theo tần suất.");
                continue;
            }

            PillSchedule sch = optSch.get();

            Optional<Account> optAcct = accountRepository.findByUsers_UserId(pill.getCustomer().getUserId());
            if (optAcct.isEmpty()) {
                System.out.println("🚫 Không tìm thấy account với userID: " + pill.getCustomer().getUserId());
                continue;
            }

            String email = optAcct.get().getEmail();
            String link = String.format(
                    "http://localhost:8080/api/pills/schedule/%d/confirm?token=%s",
                    sch.getScheduleId(), sch.getConfirmToken()
            );

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Nhắc uống thuốc ngày " + today);
            msg.setText(
                    "Chào " + pill.getCustomer().getFullName() + ",\n\n" +
                            "Bạn cần uống thuốc loại " + pill.getPillType() + " vào hôm nay.\n" +
                            "Nếu đã uống, click vào đây:\n" + link
            );

            try {
                mailSender.send(msg);
                System.out.println("📨 Đã gửi mail đến: " + email);
            } catch (Exception e) {
                System.out.println("❌ Gửi mail thất bại: " + e.getMessage());
            }
        }
    }

}