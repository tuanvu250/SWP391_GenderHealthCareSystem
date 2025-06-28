package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ChangePasswordRequest;
import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.service.AccountService;
import GenderHealthCareSystem.service.UserService;
import GenderHealthCareSystem.util.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public Users getUserById(@PathVariable int id) {
        // Logic to retrieve a user by ID
        return userService.getUserById(id);
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
                user.getUpdatedAt());
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
