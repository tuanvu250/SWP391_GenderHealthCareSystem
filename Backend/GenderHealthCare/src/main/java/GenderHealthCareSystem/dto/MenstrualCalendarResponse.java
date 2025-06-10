package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Response trả về cho frontend: thông tin chu kỳ và list từng ngày
 */
@Data
@AllArgsConstructor
public class MenstrualCalendarResponse {
    private Integer cycleId;           // ID chu kỳ
    private LocalDate startDate;       // Ngày bắt đầu hành kinh
    private Integer cycleLength;       // Độ dài chu kỳ
    private List<DayInfo> days;        // Danh sách ngày cùng loại
}
