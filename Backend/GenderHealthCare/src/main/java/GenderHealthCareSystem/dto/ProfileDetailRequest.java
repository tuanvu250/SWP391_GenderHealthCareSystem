package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileDetailRequest {
    private String detailType; // WORK, EDU, CERT
    private String title;
    private String organization;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String description;
    private LocalDate issuedDate;
}
