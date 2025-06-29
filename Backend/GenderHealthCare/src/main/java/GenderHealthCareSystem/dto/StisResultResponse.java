package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StisResultResponse {
    private Integer resultId;
    private Integer bookingId;
    private LocalDateTime resultDate;
    private String hivCombo;
    private String syphilisRpr;
    private String chlamydiaNaat;
    private String gonorrheaNaat;
    private String hsvIgm;
    private String hbsAg;
    private String antiHcv;
    private String hpvDna;
    private String resultText;
    private String note;
    private String pdfResultUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
