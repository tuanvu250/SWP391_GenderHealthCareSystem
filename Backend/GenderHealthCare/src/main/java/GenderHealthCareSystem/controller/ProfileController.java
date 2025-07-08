package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.UserInfoResponse;
import GenderHealthCareSystem.dto.UserProfileResponse;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = ((Number) jwt.getClaim("userID")).intValue();

        Optional<Account> optionalAcc = accountRepository.findByUsers_UserId(userId);

        if (optionalAcc.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found!"));
        }

        Account account = optionalAcc.get();
        Users user = account.getUsers();

        UserInfoResponse dto = new UserInfoResponse(
                user.getUserId(),
                account.getAccountId(),
                account.getUserName(),
                account.getEmail(),
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
                account.getAccountStatus());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UserProfileResponse req) {
        Integer userId = ((Number) jwt.getClaim("userID")).intValue();
        Optional<Users> optional = userRepository.findById(userId);

        if (optional.isEmpty())
            return ResponseEntity.status(404).body(Map.of("message", "User not found!"));

        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            // Kiểm tra định dạng email
            String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
            if (!req.getEmail().matches(emailRegex)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email không đúng định dạng!"));
            }
            // Kiểm tra email đã tồn tại cho user khác chưa
            Optional<Account> accOpt = accountRepository.findByEmail(req.getEmail());
            if (accOpt.isPresent() && !accOpt.get().getUsers().getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại!"));
            }
        }

        if (req.getPhone() != null && !req.getPhone().isEmpty()) {
            // Kiểm tra định dạng phone (bắt đầu bằng 0, 10-11 số)
            String phoneRegex = "^(0[0-9]{9,10})$";
            if (!req.getPhone().matches(phoneRegex)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Số điện thoại không đúng định dạng!"));
            }
            // Kiểm tra phone đã tồn tại cho user khác chưa
            Optional<Users> phoneOpt = userRepository.findByPhone(req.getPhone());
            if (phoneOpt.isPresent() && !phoneOpt.get().getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Số điện thoại đã tồn tại!"));
            }
        }

        Users user = optional.get();
        if (req.getFullName() != null)
            user.setFullName(req.getFullName());
        if (req.getGender() != null)
            user.setGender(req.getGender());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getAddress() != null)
            user.setAddress(req.getAddress());
        if (req.getBirthDate() != null)
            user.setBirthDate(req.getBirthDate());

        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Cập nhật email ở bảng Account (nếu có thay đổi)
        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            Optional<Account> optionalAcc = accountRepository.findByUsers_UserId(userId);
            if (optionalAcc.isPresent()) {
                Account account = optionalAcc.get();
                account.setEmail(req.getEmail());
                accountRepository.save(account);
            }
        }

        return ResponseEntity.ok(Map.of("message", "User profile updated successfully!"));
    }

    @Autowired
    private CloudinaryService cloudinaryService;

    @PutMapping("/me/avatar")
    public ResponseEntity<?> updateAvatar(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) throws IOException {
        Integer userId = ((Number) jwt.getClaim("userID")).intValue();
        Optional<Users> optional = userRepository.findById(userId);

        if (optional.isEmpty())
            return ResponseEntity.status(404).body(Map.of("message", "User not found!"));

        Users user = optional.get();

        // Nếu đã có avatar cũ, xóa nó trên Cloudinary
        if (user.getUserImageUrl() != null) {
            String publicId = cloudinaryService.getPublicIdFromUrl(user.getUserImageUrl());
            if (publicId != null) {
                cloudinaryService.deleteFile(publicId);
            }
        }

        String avatarUrl = cloudinaryService.uploadFile(file);

        user.setUserImageUrl(avatarUrl);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar updated successfully!",
                "userImageUrl", avatarUrl));
    }

}
