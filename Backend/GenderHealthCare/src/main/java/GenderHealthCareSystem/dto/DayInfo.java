package GenderHealthCareSystem.dto;

import GenderHealthCareSystem.enums.DayType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DayInfo {
    private LocalDate date;
    private DayType type;
}
