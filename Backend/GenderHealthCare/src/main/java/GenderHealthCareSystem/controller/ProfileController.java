package GenderHealthCareSystem.controller;


import GenderHealthCareSystem.dto.UserProfileResponse;
import GenderHealthCareSystem.model.Users;
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

        return ResponseEntity.ok(Map.of("message", "User profile updated successfully!"));
    }
    

}


