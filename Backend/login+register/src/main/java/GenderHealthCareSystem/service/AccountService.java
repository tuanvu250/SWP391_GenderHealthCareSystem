package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void saveAccount(Account account) {
        account.setPassword(passwordEncoder.encode(account.getPassword())); // Hash the password
        accountRepository.save(account);
    }
}
