package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ForgotPasswordRequest;
import GenderHealthCareSystem.dto.ResetPasswordRequest;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Gửi OTP
    @PostMapping("/forgot-password")
    public String sendOtp(@RequestBody ForgotPasswordRequest request) {
        String input = request.getUsernameOrEmail();

        Optional<Account> optional;
        if (input.contains("@")) {
            // Nếu có @ -> coi là email
            optional = accountRepository.findByEmail(input);
        } else {
            // Không có @ -> coi là username
            optional = accountRepository.findByUserName(input);
        }

        if (optional.isEmpty()) return "Username or Email not found!";
        Account account = optional.get();
        String otp = String.format("%06d", new Random().nextInt(999999));
        account.setResetOtp(otp);
        account.setResetOtpExpiry(LocalDateTime.now().plusMinutes(3));
        accountRepository.save(account);
        emailService.sendOtpEmail(account.getEmail(), otp); // vẫn gửi về email của account
        return "OTP sent to your email!";
    }


    // 2. Reset password
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        String input = request.getUsernameOrEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        Optional<Account> optional;
        if (input.contains("@")) {
            optional = accountRepository.findByEmail(input);
        } else {
            optional = accountRepository.findByUserName(input);
        }

        if (optional.isEmpty()) return "Username or Email not found!";
        Account account = optional.get();

        if (account.getResetOtp() == null || account.getResetOtpExpiry() == null) return "OTP chưa được gửi. Vui lòng gửi lại!";
        if (!account.getResetOtp().equals(otp)) return "Sai OTP!";
        if (account.getResetOtpExpiry().isBefore(LocalDateTime.now())) return "OTP đã hết hạn!";

        account.setPassword(passwordEncoder.encode(newPassword));
        account.setResetOtp(null);
        account.setResetOtpExpiry(null);
        accountRepository.save(account);
        return "Mật khẩu đã được cập nhật!";
    }

}
