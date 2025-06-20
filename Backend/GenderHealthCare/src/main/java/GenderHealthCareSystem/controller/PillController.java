package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.PillRequest;
import GenderHealthCareSystem.dto.PillResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.model.Pills;
import GenderHealthCareSystem.service.PillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pills")
public class PillController {

    @Autowired
    private PillService pillService;
    @PostMapping
    public ResponseEntity<ApiResponse<PillResponse>> createPill(
            @RequestBody PillRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        // Cách 1: Lấy từ claim "userId" nếu bạn có lưu lúc tạo JWT
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));

        // Cách 2: Hoặc lấy từ subject nếu bạn đặt subject = userId
        // Integer userId = Integer.valueOf(jwt.getSubject());

        PillResponse created = pillService.createPill(request, userId);
        ApiResponse<PillResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Pill created successfully",
                created,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/update-frequency")
    public ResponseEntity<ApiResponse<Void>> updateNotificationFrequency(
            @RequestParam Integer pillId,
            @RequestParam Pills.NotificationFrequency frequency,
            @AuthenticationPrincipal Jwt jwt) {

        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        pillService.updateNotificationFrequencyByUser(pillId, frequency, userId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Notification frequency updated successfully",
                null,
                null
        );
        return ResponseEntity.ok(response);
    }

}
