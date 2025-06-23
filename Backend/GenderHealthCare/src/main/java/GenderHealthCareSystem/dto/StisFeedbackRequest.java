package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class StisFeedbackRequest {
    private Integer bookingId;
    private Integer rating;
    private String comment;
}