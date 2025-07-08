package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public void saveUser(Users user) {
        userRepository.save(user);
    }
    public Users getUserById(int id) {
        Optional<Users> user= userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    public Page<UserInfoResponse> searchUsers(String name, String email, String phone, int page, int size, String sortBy, String sort, LocalDateTime startDate, LocalDateTime endDate, String role, AccountStatus status) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        }

        Page<Users> usersPage = userRepository.searchUsers(
                name, email, phone, startDate, endDate,  status,role, pageable);
        return usersPage.map(this::mapToResponse);
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
}
