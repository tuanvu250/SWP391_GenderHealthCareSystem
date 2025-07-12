package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.CreateUserRequest;
import GenderHealthCareSystem.dto.UpdateUserRequest;
import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Role;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.RoleRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Users getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public void saveUser(Users user) {
        userRepository.save(user);
    }

    @Transactional
    public void createUser(CreateUserRequest createRequest) {
        // Find the role
        Role role = roleRepository.findByRoleName(createRequest.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + createRequest.getRole()));

        // Create new user
        Users user = new Users();
        user.setFullName(createRequest.getFullName());
        user.setPhone(createRequest.getPhone());
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        System.out.println("Creating user with role: " + role.getRoleName());
        // Create new account
        Account account = new Account();
        account.setUserName(createRequest.getUsername());
        account.setEmail(createRequest.getEmail());
        account.setPassword(passwordEncoder.encode(createRequest.getPassword()));
        account.setAccountStatus(AccountStatus.ACTIVE);
        System.out.println("Creating account with username: " + createRequest.getUsername());
        // Save user first
        Users savedUser = userRepository.save(user);

        // Set user for account and save
        account.setUsers(savedUser);
        accountRepository.save(account);
        System.out.println("Account saved with user ID: " + savedUser.getUserId());
        // Return the created user info
    }

    public UserInfoResponse mapToResponse(Users user) {
        return new UserInfoResponse(
                user.getUserId(),
                user.getAccount().getAccountId(),
                user.getAccount().getUserName(),
                user.getAccount().getEmail(),
                user.getRole().getRoleName(),
                user.getFullName(),
                user.getPhone(),
                user.getGender(),
                user.getAddress(),
                user.getUserImageUrl(),
                user.getBirthDate(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getProvider(),
                user.getAccount().getAccountStatus()
        );
    }

    public Page<UserInfoResponse> searchUsers(String name, String email, String phone, int page, int size,
                                             String sortBy, String sort, LocalDateTime startDate,
                                             LocalDateTime endDate, String role, AccountStatus status) {
        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, direction, sortBy);

        Page<Users> usersPage = userRepository.searchUsers(name, email, phone, startDate, endDate, status, role, pageable);

        List<UserInfoResponse> userResponses = usersPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(userResponses, pageable, usersPage.getTotalElements());
    }

    @Transactional
    public UserInfoResponse updateUser(int userId, UpdateUserRequest updateRequest) {
        Users user = getUserById(userId);

        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getGender() != null) {
            user.setGender(updateRequest.getGender());
        }
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getBirthDate() != null) {
            user.setBirthDate(updateRequest.getBirthDate());
        }

        user.setUpdatedAt(LocalDateTime.now());

        Users updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public Map<String, Long> getUserCountsByRole() {
        List<Users> users = userRepository.findAll();

        Map<String, Long> roleCounts = users.stream()
                .filter(user -> user.getRole() != null) // Ensure role is not null
                .collect(Collectors.groupingBy(user -> user.getRole().getRoleName(), Collectors.counting()));

        roleCounts.put("Total", (long) users.size());

        return roleCounts;
    }
}
