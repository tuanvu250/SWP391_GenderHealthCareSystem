package GenderHealthCareSystem.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class StisResultRequest {
    private String testCode;
    private String resultValue;
    private String referenceRange;
    private String resultText;
    private String note;
    private MultipartFile pdfFile;
}
