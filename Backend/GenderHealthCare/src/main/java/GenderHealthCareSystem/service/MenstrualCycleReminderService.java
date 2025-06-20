package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.MenstrualCycle;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.MenstrualCycleRepository;
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
    private final MenstrualCalendarService menstrualCalendarService;
    private final AccountRepository accountRepository;

    @Scheduled(cron = "0 * * * * *") // Chạy hàng ngày lúc 8:00 sáng
    public void sendDailyFertilityNotifications() {
        System.out.println("[DEBUG] Starting sendDailyFertilityNotifications...");

        // Lấy tất cả các user từ AccountRepository
        List<Account> accounts = accountRepository.findAll();

        if (accounts.isEmpty()) {
            System.out.println("[DEBUG] No users found to process.");
            return;
        }
        System.out.println("[DEBUG] Found " + accounts.size() + " users to process.");

        for (Account account : accounts) {
            // Kiểm tra user có chu kỳ kinh nguyệt hay không
            Optional<MenstrualCycle> cycleOptional = menstrualCycleRepository.findFirstByCustomerUserIdOrderByStartDateDesc(account.getUsers().getUserId());

            if (cycleOptional.isEmpty()) {
                System.out.println("[DEBUG] No menstrual cycle found for user ID: " + account.getUsers().getUserId() + ". Skipping notification.");
                continue; // Bỏ qua nếu không có chu kỳ kinh nguyệt
            }

            MenstrualCycle cycle = cycleOptional.get();
            LocalDate startDate = cycle.getStartDate();
            int cycleLength = cycle.getCycleLength();
            int menstruationDays = (int) (cycle.getEndDate().toEpochDay() - cycle.getStartDate().toEpochDay()) + 1;

            String email = account.getEmail();
            System.out.println("[DEBUG] Sending notifications to email: " + email);

            menstrualCalendarService.sendFertilityNotifications(
                email,
                startDate,
                cycleLength,
                menstruationDays
            );
        }
    }
}
