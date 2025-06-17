package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillResponse {
    private Integer pillId;
    private String pillType;
    private LocalDate startDate;
    private LocalTime timeOfDay;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Integer customerId;
    private String notificationFrequency;

}
