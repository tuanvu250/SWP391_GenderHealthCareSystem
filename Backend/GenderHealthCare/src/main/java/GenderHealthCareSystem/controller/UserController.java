package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.ChangePasswordRequest;
import GenderHealthCareSystem.dto.CreateUserRequest;
import GenderHealthCareSystem.dto.UpdateUserRequest;
import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.service.AccountService;
import GenderHealthCareSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody CreateUserRequest createRequest) {
//        try {
            userService.createUser(createRequest);
            return new ResponseEntity<>(
                    new ApiResponse<>(HttpStatus.CREATED, "User created successfully", null, null),
                    HttpStatus.CREATED
            );
//        }catch (Exception e) {
//            return new ResponseEntity<>(
//                    new ApiResponse<>(HttpStatus.BAD_REQUEST, "Failed to create user", null, e.getMessage()),
//                    HttpStatus.BAD_REQUEST
//            );
//        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable int id) {
        try {
            UserInfoResponse user = userService.mapToResponse(userService.getUserById(id));
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "User retrieved successfully", user, null));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(HttpStatus.NOT_FOUND, "User not found", null, e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable int id, @RequestBody UpdateUserRequest updateRequest) {
        try {
            UserInfoResponse updatedUser = userService.updateUser(id, updateRequest);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "User updated successfully", updatedUser, null));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(HttpStatus.BAD_REQUEST, "Failed to update user", null, e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal Jwt jwt, @RequestBody ChangePasswordRequest request) {
        String accountId = jwt.getClaimAsString("accountId");
        if (accountId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        }
        return accountService.changePassword(Integer.parseInt(accountId), request);
}
    @GetMapping
    public ResponseEntity<ApiResponse<?>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) AccountStatus status
    ) {
        try {
            Page<UserInfoResponse> users = userService.searchUsers(
                    name, email, phone, page, size, sortBy, sort, startDate, endDate, role, status
            );
            return ResponseEntity.ok(new ApiResponse<>(
                    HttpStatus.OK, "Users retrieved successfully", users, null
            ));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve users", null, e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/counts-by-role")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUserCountsByRole() {
        try {
            Map<String, Long> roleCounts = userService.getUserCountsByRole();
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "User counts retrieved successfully", roleCounts, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve user counts", null, e.getMessage()));
        }
    }
}
