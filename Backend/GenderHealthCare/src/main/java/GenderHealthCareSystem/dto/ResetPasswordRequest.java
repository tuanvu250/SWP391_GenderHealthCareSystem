package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String usernameOrEmail;
    private String otp;
    private String newPassword;
}

