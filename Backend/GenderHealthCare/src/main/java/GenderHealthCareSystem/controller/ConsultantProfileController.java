package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.model.ConsultantProfile;
import GenderHealthCareSystem.dto.ConsultantProfileRequest;
import GenderHealthCareSystem.service.ConsultantProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api/consultant/profile")
public class ConsultantProfileController {

    private final ConsultantProfileService service;

    public ConsultantProfileController(ConsultantProfileService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('Consultant')")
    public ResponseEntity<?> create(@RequestBody ConsultantProfileRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        return ResponseEntity.ok(service.create(consultantId, req));
    }

    @PutMapping
    @PreAuthorize("hasRole('Consultant')")
    public ResponseEntity<?> update(@RequestBody ConsultantProfileRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
            return ResponseEntity.ok(service.update(consultantId, req));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('Consultant')")
    public ResponseEntity<?> delete(@AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        service.delete(consultantId);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping
    public ResponseEntity<?> get(@AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        return ResponseEntity.ok(service.get(consultantId));
    }
}
