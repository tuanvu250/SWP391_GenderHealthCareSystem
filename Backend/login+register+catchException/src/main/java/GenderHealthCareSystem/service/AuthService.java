package GenderHealthCareSystem.service;

import GenderHealthCareSystem.ExceptionHandler.UserAlreadyExistsException;
import GenderHealthCareSystem.dto.LoginRequest;
import GenderHealthCareSystem.dto.RegisterRequest;
import GenderHealthCareSystem.model.*;
import GenderHealthCareSystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository usersRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder PasswordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        Optional<Role> role = roleRepository.findById(request.getRoleId());
        boolean isError = false;
        if (!role.isPresent()) {
            isError = true;
            throw new RuntimeException("Role not found");
        }
        List<String> errors = new ArrayList<>();
        if (accountRepository.findByUserName(request.getUserName()).isPresent()) {
            isError = true;

            errors.add("Username is already in use");
        }
        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            isError = true;
            errors.add("Email is already in use");
        }
        if (!errors.isEmpty()) {
            throw new UserAlreadyExistsException(String.join(", ", errors));
        }
        if (!isError) {
            Users user = new Users();
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());
            user.setGender(request.getGender());
            user.setBirthDate(request.getBirthDate());
            user.setAddress(request.getAddress());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setRole(role.get());
            usersRepository.save(user);


            Account account = new Account();
            account.setUsers(user);
            account.setUserName(request.getUserName());
            account.setEmail(request.getEmail());
            account.setPassword(PasswordEncoder.encode(request.getPassword())); // Add hashing for security
            accountRepository.save(account);
        }
    }


}
