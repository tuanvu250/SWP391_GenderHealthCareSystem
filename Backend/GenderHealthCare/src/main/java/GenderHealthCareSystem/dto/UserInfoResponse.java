package GenderHealthCareSystem.dto;

import GenderHealthCareSystem.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private Integer userId; // ID of the user
    private Integer accountId; // ID of the account
    private String username; // Username of the account
    private String email; // Email of the account
    private String role; // Role name associated with the user
    private String fullName; // Full name of the user
    private String phone; // Phone number of the user
    private String gender; // Gender of the user
    private String address; // Address of the user
    private String userImageUrl; // Profile image URL
    private LocalDate birthDate; // Date of birth (formatted as a string, can be LocalDate if needed)
    private LocalDateTime createdAt; // Record creation timestamp (formatted as a string)
    private LocalDateTime updatedAt; // Record update timestamp (formatted as a string)
    private String provider; // OAuth provider (e.g., GOOGLE, FACEBOOK)
    private AccountStatus status; // Account status (e.g., ACTIVE, INACTIVE, SUSPENDED)

}
