package GenderHealthCareSystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RescheduleRequest {
    private Integer bookingId;
    private LocalDateTime newBookingDate;
}
