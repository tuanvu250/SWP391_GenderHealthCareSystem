package GenderHealthCareSystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(\\+84|0)[3|5|7|8|9]\\d{8}$", message = "Định dạng số điện thoại sai")
    private String phone;
    @NotBlank(message = "Giới tính không được để trống")
    private String gender;
    @PastOrPresent(message = "Ngày sinh không được ở tương lai")
    private LocalDate birthDate;
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String userName;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
    private Integer roleId;
}
