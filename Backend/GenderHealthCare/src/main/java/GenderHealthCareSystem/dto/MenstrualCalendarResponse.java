package GenderHealthCareSystem.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenstrualCalendarResponse {

    private Integer cycleId;
    private LocalDate startDate;
    private int cycleLength;
    private List<DayInfo> days;
}
