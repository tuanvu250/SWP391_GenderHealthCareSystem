package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.service.StisFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling STI service feedback operations
 */
@RestController
@RequestMapping("/api/stis-feedback")
@RequiredArgsConstructor
public class StisFeedbackController {
    private final StisFeedbackService feedbackService;

    /**
     * Creates a new feedback for an STI service booking
     * 
     * @param req The feedback request containing bookingId, rating, and comment
     * @return ResponseEntity with the created feedback or error message
     */
    @PostMapping
    public ResponseEntity<?> addFeedback(@RequestBody StisFeedbackRequest req) {
        try {
            StisFeedback feedback = feedbackService.createFeedback(req);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Đánh giá đã được ghi nhận", feedback, null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null, "BAD_REQUEST"));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(HttpStatus.CONFLICT, ex.getMessage(), null, "CONFLICT"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống", null, "SERVER_ERROR"));
        }
    }
}