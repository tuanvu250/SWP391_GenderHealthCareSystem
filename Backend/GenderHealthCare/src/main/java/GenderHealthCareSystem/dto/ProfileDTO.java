package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Integer profileId;
    private String avatarUrl;
    private Integer experienceYears;
    private String introduction;
    private String languages;
    private String specialization;
    private Integer consultantId;
}
