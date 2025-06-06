package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.MenstrualCycleRequest;
import GenderHealthCareSystem.dto.MenstrualCycleResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.service.MenstrualCycleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menstrual")
public class MenstrualCycleController {

    @Autowired
    private MenstrualCycleService cycleService;

    @PostMapping
    public ResponseEntity<ApiResponse<MenstrualCycleResponse>> createCycle(@RequestBody MenstrualCycleRequest request) {
        MenstrualCycleResponse createdCycle = cycleService.createMenstrualCycle(request);

        ApiResponse<MenstrualCycleResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Menstrual cycle created successfully",
                createdCycle,
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
