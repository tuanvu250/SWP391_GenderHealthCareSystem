package GenderHealthCareSystem.dto;

import GenderHealthCareSystem.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountStatusRequest {
    private AccountStatus accountStatus;
}
