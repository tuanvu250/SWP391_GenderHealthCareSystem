package GenderHealthCareSystem.dto;

import GenderHealthCareSystem.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String gender;
    private String address;
    private String userImageUrl;
    private LocalDate birthDate;
    private AccountStatus status;
    private String password; // Optional, for updating password
}
