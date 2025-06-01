package ForgetPasswordApplication.controller;

import ForgetPasswordApplication.dto.UserInfoResponse;
import ForgetPasswordApplication.model.Users;
import ForgetPasswordApplication.service.UserService;
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
        this.userService.saveUser(user);
        return "User created successfully";
    }
    @GetMapping("/users/{id}")
    public Users getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @GetMapping("/users/me")
    public UserInfoResponse getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("sub");
        String email = jwt.getClaimAsString("email");
        String role = jwt.getClaimAsString("role");
        String fullName = jwt.getClaimAsString("fullName");
        String accountId = jwt.getClaimAsString("accountId");

        return new UserInfoResponse(
                Integer.parseInt(accountId),
                username,
                email,
                role,
                fullName
        );
    }
}
