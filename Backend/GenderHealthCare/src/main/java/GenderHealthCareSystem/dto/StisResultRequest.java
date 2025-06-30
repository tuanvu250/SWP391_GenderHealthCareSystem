package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class StisResultRequest {
    private String testCode;
    private String resultValue;
    private String referenceRange;
    private String resultText;
    private String note;
}
