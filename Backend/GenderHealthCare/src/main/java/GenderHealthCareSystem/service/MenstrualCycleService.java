package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.MenstrualCycleRequest;
import GenderHealthCareSystem.dto.MenstrualCycleResponse;
import GenderHealthCareSystem.model.MenstrualCycle;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.MenstrualCycleRepository;
import GenderHealthCareSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MenstrualCycleService {

    @Autowired
    private MenstrualCycleRepository menstrualCycleRepository;

    @Autowired
    private UserRepository userRepository;

    public MenstrualCycleResponse createMenstrualCycle(MenstrualCycleRequest request) {
        Users user = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setCustomer(user);
        cycle.setStartDate(request.getStartDate());
        cycle.setEndDate(request.getEndDate());
        cycle.setCycleLength(request.getCycleLength());
        cycle.setNote(request.getNote());
        cycle.setCreatedAt(LocalDateTime.now());

        MenstrualCycle savedCycle = menstrualCycleRepository.save(cycle);

        // Chuyển đổi entity thành DTO để trả về
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
}
