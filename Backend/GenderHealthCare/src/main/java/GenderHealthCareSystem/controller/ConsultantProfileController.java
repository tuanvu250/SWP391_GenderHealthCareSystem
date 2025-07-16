package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ConsultantProfileResponse;
import GenderHealthCareSystem.dto.ConsultantSearchRequest;
import GenderHealthCareSystem.model.ConsultantProfile;
import GenderHealthCareSystem.dto.ConsultantProfileRequest;
import GenderHealthCareSystem.service.ConsultantProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

@RestController
@RequestMapping("/api/consultant/profile")
public class ConsultantProfileController {

    private final ConsultantProfileService service;

    public ConsultantProfileController(ConsultantProfileService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Consultant','Manager','Admin')")
    // API để tạo hồ sơ chuyên gia tư vấn
    public ResponseEntity<?> create(@RequestBody ConsultantProfileRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        return ResponseEntity.ok(service.create(consultantId, req));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('Consultant','Manager','Admin')")
    // API để cập nhật hồ sơ chuyên gia tư vấn
    public ResponseEntity<?> update(@RequestBody ConsultantProfileRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
            return ResponseEntity.ok(service.update(consultantId, req));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('Consultant')")
    // API để xóa hồ sơ chuyên gia tư vấn
    public ResponseEntity<?> delete(@AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        service.delete(consultantId);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping
    // API để lấy hồ sơ chuyên gia tư vấn của người dùng đang đăng nhập
    public ResponseEntity<?> get(@AuthenticationPrincipal Jwt jwt) {
        Integer consultantId = ((Number) jwt.getClaim("userID")).intValue();
        return ResponseEntity.ok(service.get(consultantId));
    }


        @GetMapping("/all")
        @PreAuthorize("hasAnyRole('Customer', 'Manager', 'Admin')")
        // API để lấy tất cả hồ sơ chuyên gia tư vấn
        public ResponseEntity<?> getAll() {
            return ResponseEntity.ok(service.getAllConsultants());
        }

        @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Customer','Manager','Admin')")
    // API để lấy hồ sơ chuyên gia tư vấn theo ID
    public ResponseEntity<?> getConsultantProfile(@PathVariable Integer id) {
        try {
            var profile = service.get(id);
            return ResponseEntity.ok(profile);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}/employment-status")
    @PreAuthorize("hasAnyRole('Manager', 'Admin')")
    // API để cập nhật trạng thái làm việc của chuyên gia tư vấn
    public ResponseEntity<?> updateEmploymentStatus(@PathVariable Integer id, @RequestParam Boolean employmentStatus) {
        try {
            String result = service.updateEmploymentStatus(id, employmentStatus);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}/hourly-rate")
    @PreAuthorize("hasAnyRole('Manager', 'Admin')")
    // API để cập nhật mức phí theo giờ của chuyên gia tư vấn
    public ResponseEntity<?> updateHourlyRate(@PathVariable Integer id, @RequestParam Double hourlyRate) {
        try {
            String result = service.updateHourlyRate(id, hourlyRate);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }



    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('Manager', 'Customer')")
    // API để lấy danh sách chuyên gia tư vấn đang hoạt động
    public ResponseEntity<List<ConsultantProfileResponse>> getActiveConsultants() {
        List<ConsultantProfileResponse> activeConsultants = service.getActiveConsultants();
        return ResponseEntity.ok(activeConsultants);
    }


}
