package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReport {
    private YearMonth month;
    private Double consultationRevenue;
    private Double stisTestingRevenue;
    private Double totalRevenue;
    private Integer consultationCount;
    private Integer stisTestingCount;
}
