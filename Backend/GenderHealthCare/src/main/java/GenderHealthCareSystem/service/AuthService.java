package GenderHealthCareSystem.service;

import GenderHealthCareSystem.ExceptionHandler.UserAlreadyExistsException;
import GenderHealthCareSystem.dto.RegisterRequest;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.*;
import GenderHealthCareSystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository usersRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        if (accountRepository.findByUserName(request.getUserName()).isPresent() ||
                accountRepository.findByEmail(request.getEmail()).isPresent()||
                usersRepository.findByPhone(request.getPhone()).isPresent()) {
            StringBuilder errors = new StringBuilder();
            if (accountRepository.findByUserName(request.getUserName()).isPresent()) {
                errors.append("UserName đã tồn tại");
            }
            if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
                if (errors.length() > 0) {
                    errors.append(",");
                }
                errors.append("Email đã tồn tại");
            }
            if (usersRepository.findByPhone(request.getPhone()).isPresent()) {
                if (errors.length() > 0) {
                    errors.append(",");
                }
                errors.append("Số điện thoại đã tồn tại");
            }
            throw new UserAlreadyExistsException(errors.toString());
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setAddress(request.getAddress());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setRole(role);
        usersRepository.save(user);

        Account account = new Account();
        account.setUsers(user);
        account.setUserName(request.getUserName());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setAccountStatus(AccountStatus.ACTIVE);
        accountRepository.save(account);
    }
}
