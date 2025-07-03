package GenderHealthCareSystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultantBookingRequest {

    @NotNull(message = "ConsultantID không được để trống")
    private Integer consultantId;

    @NotNull(message = "Ngày đặt không được để trống")
    private LocalDateTime bookingDate;
    private String note;
}
