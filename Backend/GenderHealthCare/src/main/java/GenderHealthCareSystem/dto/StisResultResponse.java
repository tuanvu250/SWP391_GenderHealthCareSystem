package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StisResultResponse {
    private Integer resultId;
    private Integer bookingId;
    private LocalDateTime resultDate;
    private String testCode;
    private String resultValue;
    private String referenceRange;
    private String resultText;
    private String note;
    private String pdfResultUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
