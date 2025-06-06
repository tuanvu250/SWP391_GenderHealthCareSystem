package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.PillRequest;
import GenderHealthCareSystem.dto.PillResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.service.PillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pills")
public class PillController {

    @Autowired
    private PillService pillService;

    @PostMapping
    public ResponseEntity<ApiResponse<PillResponse>> createPill(@RequestBody PillRequest request) {
        PillResponse created = pillService.createPill(request);
        ApiResponse<PillResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Pill created successfully",
                created,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
