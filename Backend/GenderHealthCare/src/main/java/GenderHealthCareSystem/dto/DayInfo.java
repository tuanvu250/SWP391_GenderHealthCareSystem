package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DayInfo {
    private LocalDate date;
    private DayType type;
}
