package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class ConsultantSearchRequest {
    private String keyword;
    private String detailType; // WORK, EDU, CERT
    private String organization;
    private String location;
    private Double minHourlyRate;
    private Double maxHourlyRate;
    private Integer minExperience;
    private Integer maxExperience;
    private String language;
    private Boolean isAvailable;
}
