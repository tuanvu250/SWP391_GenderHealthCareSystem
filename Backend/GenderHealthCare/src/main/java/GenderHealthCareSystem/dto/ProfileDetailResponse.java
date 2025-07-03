package GenderHealthCareSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileDetailResponse {
    private String detailType;
    private String title;
    private String organization;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String description;
    private LocalDate issuedDate;
}
