package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import GenderHealthCareSystem.dto.ChangePasswordRequest;
import java.util.Map;
import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Account findByUserId(int id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }
    public void saveAccount(Account account) {
        account.setPassword(passwordEncoder.encode(account.getPassword())); // Hash the password
        accountRepository.save(account);
    }

    public ResponseEntity<?> changePassword(Integer accountId, ChangePasswordRequest request) {
        Optional<Account> optionalAccount = accountRepository.findById(accountId);

        if (optionalAccount.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Tài khoản không tồn tại"));
        }

        Account account = optionalAccount.get();

        // Kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("message", "Mật khẩu cũ không chính xác"));
        }

        // Cập nhật mật khẩu mới
        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }
}
