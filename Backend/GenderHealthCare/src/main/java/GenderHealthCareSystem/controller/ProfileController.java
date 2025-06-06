package GenderHealthCareSystem.controller;


import GenderHealthCareSystem.dto.UserProfileResponse;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PutMapping("/me")
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UserProfileResponse req
    ) {
        Integer userId = ((Number) jwt.getClaim("userID")).intValue();
        Optional<Users> optional = userRepository.findById(userId);

        if (optional.isEmpty())
            return ResponseEntity.status(404).body(Map.of("message", "User not found!"));

        Users user = optional.get();
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getBirthDate() != null) user.setBirthDate(req.getBirthDate());

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
            @RequestParam("file") MultipartFile file
    ) throws IOException {
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

        // Upload file lên Cloudinary 
        String avatarUrl = cloudinaryService.uploadFile(file);

        user.setUserImageUrl(avatarUrl);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar updated successfully!",
                "userImageUrl", avatarUrl
        ));
    }

}


