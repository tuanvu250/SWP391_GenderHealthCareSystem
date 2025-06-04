package GenderHealthCareSystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateProfileRequest {
    private String avatarUrl;
    private Integer experienceYears;
    private String introduction;
    private String languages;
    private String specialization;
}
