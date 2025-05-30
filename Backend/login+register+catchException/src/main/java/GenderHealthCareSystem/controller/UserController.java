package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.service.UserService;
import GenderHealthCareSystem.util.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    public final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/users/create")
    public String createUser(@RequestBody Users user) {
        // Logic to create a user
        this.userService.saveUser(user);
        return "User created successfully";
    }
    @GetMapping("/users/{id}")
    public Users getUserById(@PathVariable int id) {
        // Logic to retrieve a user by ID
        return userService.getUserById(id);
    }

    @GetMapping("/users/me")
    public UserInfoResponse getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        // Trích xuất thông tin từ JWT claims
        String username = jwt.getClaimAsString("sub"); //
        String email = jwt.getClaimAsString("email");
        String role = jwt.getClaimAsString("role"); //
        String fullName = jwt.getClaimAsString("fullName");
        String accountId = jwt.getClaimAsString("accountId");

        return new UserInfoResponse(
                Integer.parseInt(accountId),       // accountId nếu không có trong JWT
                username,
                email,
                role,
                fullName
        );
    }
}
