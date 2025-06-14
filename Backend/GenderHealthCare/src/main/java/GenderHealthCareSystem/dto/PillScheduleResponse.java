package GenderHealthCareSystem.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillScheduleResponse {
    private Integer scheduleId;
    private LocalDate pillDate;
    private LocalTime timeOfDay;
    private String pillType;

}
