package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.PillRequest;
import GenderHealthCareSystem.dto.PillResponse;

import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.PillRepository;
import GenderHealthCareSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PillService {

    @Autowired
    private PillRepository pillRepository;

    @Autowired
    private UserRepository userRepository;

    public PillResponse createPill(PillRequest request, Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pills pill = new Pills();
        pill.setPillType(request.getPillType());
        pill.setStartDate(request.getStartDate());
        pill.setTimeOfDay(request.getTimeOfDay());
        pill.setIsActive(request.getIsActive());
        pill.setCreatedAt(LocalDateTime.now());
        pill.setCustomer(user);
        pill.setNotificationFrequency(request.getNotificationFrequency());

        Pills saved = pillRepository.save(pill);

        return new PillResponse(
                saved.getPillId(),
                saved.getPillType(),
                saved.getStartDate(),
                saved.getTimeOfDay(),
                saved.getIsActive(),
                saved.getCreatedAt(),
                saved.getCustomer().getUserId(),
                saved.getNotificationFrequency().name()
        );
    }

}
