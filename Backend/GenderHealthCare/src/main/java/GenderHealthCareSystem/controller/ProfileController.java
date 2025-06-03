package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ProfileDTO;
import GenderHealthCareSystem.dto.UpdateProfileRequest;
import GenderHealthCareSystem.model.ConsultantProfile;
import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    // Lấy profile theo JWT (consultantId = UserID trong Users)
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        Optional<ConsultantProfile> optional = consultantProfileRepository.findByConsultant_UserId(consultantId);
        if (optional.isEmpty())
            return ResponseEntity.status(404).body(Map.of("message", "Profile not found!"));

        ConsultantProfile profile = optional.get();
        ProfileDTO dto = new ProfileDTO(
                profile.getProfileId(),
                profile.getAvatarUrl(),
                profile.getExperienceYears(),
                profile.getIntroduction(),
                profile.getLanguages(),
                profile.getSpecialization(),
                profile.getConsultant() != null ? profile.getConsultant().getUserId() : null
        );
        return ResponseEntity.ok(dto);
    }


    // Cập nhật profile
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdateProfileRequest req
    ) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        Optional<ConsultantProfile> optional = consultantProfileRepository.findByConsultant_UserId(consultantId);
        if (optional.isEmpty())
            return ResponseEntity.status(404).body(Map.of("message", "Profile not found!"));

        ConsultantProfile profile = optional.get();
        if (req.getAvatarUrl() != null) profile.setAvatarUrl(req.getAvatarUrl());
        if (req.getExperienceYears() != null) profile.setExperienceYears(req.getExperienceYears());
        if (req.getIntroduction() != null) profile.setIntroduction(req.getIntroduction());
        if (req.getLanguages() != null) profile.setLanguages(req.getLanguages());
        if (req.getSpecialization() != null) profile.setSpecialization(req.getSpecialization());

        consultantProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }

    
}
