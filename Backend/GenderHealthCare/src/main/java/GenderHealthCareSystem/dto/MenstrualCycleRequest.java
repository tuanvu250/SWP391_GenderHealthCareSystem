package GenderHealthCareSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MenstrualCycleRequest {

    private LocalDate startDate;
    private LocalDate endDate;
    private Integer cycleLength;
    private String note;

}
