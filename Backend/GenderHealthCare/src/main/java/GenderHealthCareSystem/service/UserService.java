package GenderHealthCareSystem.service;

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

    public UserInfoResponse mapToResponse(Users user) {
        Account account = user.getAccount();
        return new UserInfoResponse(
            user.getUserId(),
            account != null ? account.getAccountId() : null,
            account != null ? account.getUserName() : null,
            account != null ? account.getEmail() : null,
            user.getRole() != null ? user.getRole().getRoleName() : null,
            user.getFullName(),
            user.getPhone(),
            user.getGender(),
            user.getAddress(),
            user.getUserImageUrl(),
            user.getBirthDate(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getProvider(),
            account != null ? account.getAccountStatus() : null
        );
    }

    public Page<UserInfoResponse> searchUsers(String name, String email, String phone, int page, int size,
                                             String sortBy, String sort, LocalDateTime startDate,
                                             LocalDateTime endDate, String role, AccountStatus status) {
        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Users> users = userRepository.searchUsers(name, email, phone, startDate, endDate, status, role, pageable);

        List<UserInfoResponse> userInfoResponses = users.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(userInfoResponses, pageable, users.getTotalElements());
    }

    @Transactional
    public UserInfoResponse updateUser(int userId, UpdateUserRequest updateRequest) {
        Users user = getUserById(userId);

        // Update user fields if provided
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

        if (updateRequest.getUserImageUrl() != null) {
            user.setUserImageUrl(updateRequest.getUserImageUrl());
        }

        if (updateRequest.getBirthDate() != null) {
            user.setBirthDate(updateRequest.getBirthDate());
        }

        // Update role if provided
        if (updateRequest.getRole() != null) {
            Role role = roleRepository.findByRoleName(updateRequest.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + updateRequest.getRole()));
            user.setRole(role);
        }
        if (updateRequest.getPassword() != null) {
            if (user.getAccount() == null) {
                throw new RuntimeException("User account not found for user ID: " + userId);
            }
            // Assuming you have a method to encode the password
            String encodedPassword = passwordEncoder.encode(updateRequest.getPassword());
            user.getAccount().setPassword(encodedPassword);
        }

        // Update account fields if provided
        if (user.getAccount() != null) {
            if (updateRequest.getUsername() != null) {
                user.getAccount().setUserName(updateRequest.getUsername());
            }

            if (updateRequest.getEmail() != null) {
                user.getAccount().setEmail(updateRequest.getEmail());
            }

            if (updateRequest.getStatus() != null) {
                user.getAccount().setAccountStatus(updateRequest.getStatus());
            }
        }

        // Update the updatedAt timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save the updated user
        Users updatedUser = userRepository.save(user);

        // Return the updated user info
        return mapToResponse(updatedUser);
    }


}
