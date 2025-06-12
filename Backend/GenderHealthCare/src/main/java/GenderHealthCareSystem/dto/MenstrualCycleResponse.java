package GenderHealthCareSystem.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenstrualCycleResponse {

    private Integer cycleId;
    private Integer customerId;    // chỉ giữ ID, không trả toàn bộ object customer
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer cycleLength;
    private String note;
    private LocalDateTime createdAt;
}
