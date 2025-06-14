package GenderHealthCareSystem.dto;

import GenderHealthCareSystem.model.Pills.NotificationFrequency;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PillRequest {
    private String pillType;
    private LocalDate startDate;
    private LocalTime timeOfDay;
    private Boolean isActive;
    private NotificationFrequency notificationFrequency;

}
