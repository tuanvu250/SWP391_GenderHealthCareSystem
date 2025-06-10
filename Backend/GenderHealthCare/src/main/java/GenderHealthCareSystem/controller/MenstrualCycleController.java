package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.MenstrualCycleRequest;
import GenderHealthCareSystem.dto.MenstrualCycleResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.service.MenstrualCycleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menstrual")
public class MenstrualCycleController {

    @Autowired
    private MenstrualCycleService cycleService;

    @PostMapping
    public ResponseEntity<ApiResponse<MenstrualCycleResponse>> createCycle(
            @RequestBody MenstrualCycleRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        // 1) Lấy userId từ JWT claim (ví dụ bạn có claim "userId" theo dạng String)
//        Integer userId = jwt.getClaim("userID");
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        // 2) Truyền request + userId vào service
        MenstrualCycleResponse createdCycle = cycleService.createMenstrualCycle(request, userId);

        ApiResponse<MenstrualCycleResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Menstrual cycle created successfully",
                createdCycle,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


}
