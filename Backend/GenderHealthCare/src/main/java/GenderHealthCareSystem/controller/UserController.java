package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.ChangePasswordRequest;
import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.service.AccountService;
import GenderHealthCareSystem.service.UserService;
import GenderHealthCareSystem.util.CustomUserDetails;
import GenderHealthCareSystem.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {
    public final UserService userService;
    public final AccountService accountService;

    @PostMapping("/create")
    public String createUser(@RequestBody Users user) {
        // Logic to create a user
        this.userService.saveUser(user);
        return "User created successfully";
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable int id) {
        // Logic to retrieve a user by ID
       return new ResponseEntity<>(
                new ApiResponse<>(HttpStatus.OK, "User found", userService.mapToResponse(userService.getUserById(id)), null),
                HttpStatus.OK
        );
    }

    @GetMapping("/me")
    public UserInfoResponse getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        // Trích xuất thông tin từ JWT claims
        String username = jwt.getClaimAsString("sub"); //
        String email = jwt.getClaimAsString("email");
        String role = jwt.getClaimAsString("role"); //
        String fullName = jwt.getClaimAsString("fullName");
        String accountId = jwt.getClaimAsString("accountId");
        Users user = accountService.findByUserId(Integer.parseInt(accountId)).getUsers();

        return new UserInfoResponse(
                user.getUserId(),
                Integer.parseInt(accountId),
                username,
                email,
                role,
                fullName,
                user.getPhone(),
                user.getGender(),
                user.getAddress(),
                user.getUserImageUrl(),
                user.getBirthDate(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getProvider(),
                user.getAccount().getAccountStatus());

    }
    @GetMapping("/Search")
    public ResponseEntity<ApiResponse<?>> searchUser(@RequestParam(required = false) String name,
                                                  @RequestParam(required = false) String email,
                                                  @RequestParam(required = false) String phone,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "5") int size,
                                                  @RequestParam(required = false) LocalDateTime startDate,
                                                  @RequestParam(required = false) LocalDateTime endDate,
                                                  @RequestParam(required = false) String role,
                                                  @RequestParam(required = false) AccountStatus status,
                                                  @RequestParam(defaultValue = "createdAt") String sortBy,
                                                  @RequestParam(defaultValue = "desc") String sort) {
        Set<String> ALLOWED_SORT_FIELDS = Set.of(
                "createdAt", "updatedAt", "fullName", "birthDate", "email", "phone"
        );
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(HttpStatus.BAD_REQUEST, "Invalid sort field, please use these fields: createdAt, updatedAt, fullName, birthDate, email, phone", null, "INVALID_SORT_FIELD"));
        }
        Page<UserInfoResponse> userInfoResponsePage= userService.searchUsers(name, email, phone, page, size, sortBy, sort, startDate, endDate, role, status);

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK,userInfoResponsePage.getTotalElements() > 0 ? "Users found" : "No users found", PageResponseUtil.mapToPageResponse(userInfoResponsePage), null));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal Jwt jwt, @RequestBody ChangePasswordRequest request) {
        String accountId = jwt.getClaimAsString("accountId");
        if (accountId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        return accountService.changePassword(Integer.parseInt(accountId), request);
    }
}
