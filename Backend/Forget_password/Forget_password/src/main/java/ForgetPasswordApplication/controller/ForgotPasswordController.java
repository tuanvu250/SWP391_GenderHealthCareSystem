package ForgetPasswordApplication.controller;


import ForgetPasswordApplication.dto.ForgotPasswordRequest;
import ForgetPasswordApplication.model.Account;
import ForgetPasswordApplication.repository.AccountRepository;
import ForgetPasswordApplication.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

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

    @PostMapping("/forgot-password")
    public String sendOtp(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        Optional<Account> optional = accountRepository.findByEmail(email);
        if (optional.isEmpty()) return "Email not found!";
        Account account = optional.get();
        String otp = String.format("%06d", new Random().nextInt(999999));
        account.setResetOtp(otp);
        account.setResetOtpExpiry(LocalDateTime.now().plusMinutes(10));
        accountRepository.save(account);
        emailService.sendOtpEmail(account.getEmail(), otp);
        return "OTP sent to your email!";
    }


    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        Optional<Account> optional = accountRepository.findByEmail(email);
        if (optional.isEmpty()) return "Email not found!";
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
