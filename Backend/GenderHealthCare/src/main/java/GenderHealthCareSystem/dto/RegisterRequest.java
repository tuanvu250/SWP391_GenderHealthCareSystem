package GenderHealthCareSystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    private String phone;
    private String gender;
    private LocalDate birthDate;
    private String address;
    @Email
    private String email;
    private String userName;
    private String password;
    private Integer roleId;
}
