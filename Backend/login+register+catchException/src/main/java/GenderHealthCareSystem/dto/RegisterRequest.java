package GenderHealthCareSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate birthDate;
    private String address;
    private String email;
    private String userName;
    private String password;
    private Integer roleId;
}
