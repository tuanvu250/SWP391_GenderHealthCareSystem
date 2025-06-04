package GenderHealthCareSystem.service;


import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.util.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Account account = accountRepository
                .findByUserNameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username/email: " + usernameOrEmail));
        if (!account.getStatus().equals("ACTIVE")) {
            throw new UsernameNotFoundException("Tài khoản không hoạt động");
        }
        return new CustomUserDetails(account);
    }
}
