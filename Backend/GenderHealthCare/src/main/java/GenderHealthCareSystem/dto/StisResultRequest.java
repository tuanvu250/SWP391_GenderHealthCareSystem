package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class StisResultRequest {
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
}
