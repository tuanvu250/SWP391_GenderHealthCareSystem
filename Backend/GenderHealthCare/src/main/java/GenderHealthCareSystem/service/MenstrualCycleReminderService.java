package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.MenstrualCycle;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.MenstrualCycleRepository;
import GenderHealthCareSystem.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenstrualCycleReminderService {

    private final MenstrualCycleRepository menstrualCycleRepository;
    private final AccountRepository accountRepository;
    private final EmailService emailService;

    @Scheduled(cron = "* * * * * *") // Chạy mỗi phút
    public void sendDailyFertilityNotifications() {
        System.out.println("[DEBUG] Starting sendDailyFertilityNotifications...");

        List<Account> accounts = accountRepository.findAll();
        System.out.println("[DEBUG] Total accounts: " + accounts.size());

        if (accounts.isEmpty()) {
            System.out.println("[DEBUG] No accounts to process.");
            return;
        }

        LocalDate today = LocalDate.now();
        System.out.println("[DEBUG] Today's date: " + today);

        for (Account account : accounts) {
            Integer userId = account.getUsers().getUserId();
            System.out.println("[DEBUG] Processing user ID: " + userId);

            Optional<MenstrualCycle> cycleOpt =
                    menstrualCycleRepository.findFirstByCustomerUserIdOrderByStartDateDesc(userId);

            if (cycleOpt.isEmpty()) {
                System.out.println("[DEBUG] No cycle found for user ID: " + userId);
                continue;
            }

            MenstrualCycle cycle = cycleOpt.get();
            System.out.println("[DEBUG] Found cycle for user ID: " + userId);

            LocalDate startDate = cycle.getStartDate();
            LocalDate endDate = cycle.getEndDate();
            int cycleLength = cycle.getCycleLength();
            int menstruationDays = (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;

            String userEmail = account.getEmail();
            System.out.println("[DEBUG] User email: " + userEmail);

            int numberOfCycles = 6;
            for (int i = 0; i < numberOfCycles; i++) {
                LocalDate cycleStart = startDate.plusDays((long) i * cycleLength);
                LocalDate ovulationDate = cycleStart.plusDays(cycleLength - 14);

                for (int day = 0; day < cycleLength; day++) {
                    LocalDate currentDate = cycleStart.plusDays(day);

                    if (day < menstruationDays) continue;

                    long dist = Math.abs(currentDate.toEpochDay() - ovulationDate.toEpochDay());

                    if (!(currentDate.isEqual(today) || currentDate.minusDays(1).isEqual(today))) {
                        continue;
                    }

                    String type = null;
                    String subject = "";
                    String content = "";

                    if (dist <= 1) {
                        type = "HIGH";
                        subject = "Thông báo: Giai đoạn khả năng mang thai cao";
                        content = "Bạn sắp bước vào giai đoạn khả năng mang thai cao từ "
                                + currentDate + " đến " + currentDate.plusDays(1);
                    } else if (dist <= 3) {
                        type = "MEDIUM";
                        subject = "Thông báo: Giai đoạn khả năng mang thai trung bình";
                        content = "Bạn sắp bước vào giai đoạn khả năng mang thai trung bình từ "
                                + currentDate + " đến " + currentDate.plusDays(2);
                    } else if (dist <= 5) {
                        type = "LOW";
                        subject = "Thông báo: Giai đoạn khả năng mang thai thấp";
                        content = "Bạn sắp bước vào giai đoạn khả năng mang thai thấp từ "
                                + currentDate + " đến " + currentDate.plusDays(4);
                    }

                    if (type == null) continue;

                    if (currentDate.equals(cycle.getLastNotificationDate())
                            && type.equalsIgnoreCase(cycle.getLastNotificationType())) {
                        System.out.println("[DEBUG] Already sent " + type + " for " + userEmail + " on " + currentDate);
                        continue;
                    }

                    try {
                        emailService.sendFertilityNotificationEmail(userEmail, subject, content);
                        System.out.println("[DEBUG] Sent " + type + " email to " + userEmail);

                        cycle.setLastNotificationDate(currentDate);
                        cycle.setLastNotificationType(type);
                        menstrualCycleRepository.save(cycle);
                    } catch (Exception e) {
                        System.out.println("[ERROR] Failed to send email to " + userEmail + ": " + e.getMessage());
                    }
                }
            }
        }
    }
}
