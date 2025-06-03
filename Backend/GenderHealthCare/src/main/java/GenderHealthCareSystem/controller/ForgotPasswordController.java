package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ForgotPasswordRequest;
import GenderHealthCareSystem.dto.ResetPasswordRequest;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
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

    // 1. Gửi OTP về email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendOtp(@RequestBody ResetPasswordRequest request) {
        String input = request.getUsernameOrEmail();
        Optional<Account> optional = input.contains("@")
                ? accountRepository.findByEmail(input)
                : accountRepository.findByUserName(input);

        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Username or Email not found!"));
        }

        Account account = optional.get();
        String otp = String.format("%06d", new Random().nextInt(1000000));
        account.setResetOtp(otp);
        account.setResetOtpExpiry(LocalDateTime.now().plusMinutes(3));
        account.setOtpVerified(false);
        accountRepository.save(account);

        // Gửi OTP qua email, không trả về OTP trong response
        emailService.sendOtpEmail(account.getEmail(), otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email!"));
    }

    // 2. Xác thực OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody ResetPasswordRequest request) {
        String input = request.getUsernameOrEmail();
        String otp = request.getOtp();

        Optional<Account> optional = input.contains("@")
                ? accountRepository.findByEmail(input)
                : accountRepository.findByUserName(input);

        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Username or Email not found!"));
        }

        Account account = optional.get();
        if (account.getResetOtp() == null || account.getResetOtpExpiry() == null) {
            return ResponseEntity.status(400).body(Map.of("message", "OTP chưa được gửi. Vui lòng gửi lại!"));
        }
        if (!account.getResetOtp().equals(otp)) {
            return ResponseEntity.status(400).body(Map.of("message", "Sai OTP!"));
        }
        if (account.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("message", "OTP đã hết hạn!"));
        }

        account.setOtpVerified(true);
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("message", "OTP valid! Please enter new password."));
    }

    // 3. Đổi mật khẩu (chỉ đổi nếu đã xác thực OTP)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String input = request.getUsernameOrEmail();

        Optional<Account> optional = input.contains("@")
                ? accountRepository.findByEmail(input)
                : accountRepository.findByUserName(input);

        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Username or Email not found!"));
        }

        Account account = optional.get();
        if (account.getOtpVerified() == null || !account.getOtpVerified()) {
            return ResponseEntity.status(400).body(Map.of("message", "Vui lòng xác thực OTP trước khi đổi mật khẩu!"));
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        account.setResetOtp(null);
        account.setResetOtpExpiry(null);
        account.setOtpVerified(false); // reset lại trạng thái
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("message", "Mật khẩu đã được cập nhật!"));
    }
}


