package GenderHealthCareSystem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
public class ConsultantFeedbackRequest {
    @NotNull(message = "Consultant ID không được để trống")
    private Integer consultantId;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Rating phải từ 1 đến 5")
    private Integer rating;

    private String comment;

    private Integer bookingId;
}
