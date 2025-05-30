package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.LoginRequest;
import GenderHealthCareSystem.dto.RegisterRequest;
import GenderHealthCareSystem.model.*;
import GenderHealthCareSystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository usersRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder PasswordEncoder;
    @Transactional
    public void register(RegisterRequest request) {
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

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
        account.setPassword(PasswordEncoder.encode(request.getPassword())); // Add hashing for security
        accountRepository.save(account);
    }
    public String login(LoginRequest request) {
        Account account = accountRepository.findByUserNameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid username or email"));

        if (!PasswordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return "Login successful"; // Có thể return token nếu dùng JWT
    }

}
