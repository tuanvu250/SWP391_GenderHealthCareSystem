package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.PillRequest;
import GenderHealthCareSystem.dto.PillResponse;

import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.PillRepository;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.service.PillScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PillService {

    @Autowired
    private PillRepository pillRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PillScheduleService scheduleService;

    /**
     * Tạo mới thuốc và lưu vào DB
     *
     * @param request  thông tin thuốc từ client
     * @param userId   ID của người dùng
     * @return thông tin thuốc đã được lưu
     */

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

        // Generate pill schedule after saving the pill
        scheduleService.generateSchedule(saved);

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

    public void updateNotificationFrequencyByUser(Integer pillId, Pills.NotificationFrequency frequency, Integer userId) {
        Pills pill = pillRepository.findById(pillId)
                .orElseThrow(() -> new RuntimeException("Pill not found"));

        if (!pill.getCustomer().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this pill");
        }

        pill.setNotificationFrequency(frequency);
        pillRepository.save(pill);
    }

}
