package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.DayInfo;
import GenderHealthCareSystem.dto.DayType;
import GenderHealthCareSystem.dto.MenstrualCalendarResponse;
import GenderHealthCareSystem.dto.MenstrualCycleRequest;
import GenderHealthCareSystem.dto.MenstrualCycleResponse;
import GenderHealthCareSystem.model.MenstrualCycle;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.MenstrualCycleRepository;
import GenderHealthCareSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MenstrualCycleService {

    @Autowired
    private MenstrualCycleRepository menstrualCycleRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Phần code hiện tại tạo chu kỳ ---
    public MenstrualCycleResponse createMenstrualCycle(MenstrualCycleRequest request, Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setCustomer(user);
        cycle.setStartDate(request.getStartDate());
        cycle.setEndDate(request.getEndDate());
        cycle.setCycleLength(request.getCycleLength());
        cycle.setNote(request.getNote());
        cycle.setCreatedAt(LocalDateTime.now());

        MenstrualCycle savedCycle = menstrualCycleRepository.save(cycle);

        return new MenstrualCycleResponse(
                savedCycle.getCycleId(),
                user.getUserId(),
                savedCycle.getStartDate(),
                savedCycle.getEndDate(),
                savedCycle.getCycleLength(),
                savedCycle.getNote(),
                savedCycle.getCreatedAt()
        );
    }

    // : lấy chu kỳ gần nhất của user ---
    public MenstrualCycleResponse getLatestCycleForUser(Integer userId) {
        MenstrualCycle cycle = menstrualCycleRepository
                .findFirstByCustomerUserIdOrderByStartDateDesc(userId)
                .orElseThrow(() -> new RuntimeException("No cycle found for user " + userId));

        return new MenstrualCycleResponse(
                cycle.getCycleId(),
                userId,
                cycle.getStartDate(),
                cycle.getEndDate(),
                cycle.getCycleLength(),
                cycle.getNote(),
                cycle.getCreatedAt()
        );
    }
}