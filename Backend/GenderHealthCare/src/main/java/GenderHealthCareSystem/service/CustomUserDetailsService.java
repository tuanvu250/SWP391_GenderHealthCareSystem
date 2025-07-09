package GenderHealthCareSystem.service;


import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.util.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
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

        // Throw different exception messages based on account status
        switch (account.getAccountStatus()) {
            case ACTIVE:
                // Account is active, proceed normally
                break;
            case INACTIVE:
                throw new BadCredentialsException("Tài khoản chưa được kích hoạt. ");
            case SUSPENDED:
                throw new BadCredentialsException("Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");
            case DELETED:
                throw new BadCredentialsException("Tài khoản đã bị xóa. Vui lòng liên hệ quản trị viên nếu đây là lỗi.");
            case BANNED:
                throw new BadCredentialsException("Tài khoản đã bị cấm vĩnh viễn. Vui lòng liên hệ quản trị viên nếu đây là lỗi.");
            default:
                throw new BadCredentialsException("Tài khoản không hoạt động: " + account.getAccountStatus().toString());
        }

        return new CustomUserDetails(account);
    }
}
