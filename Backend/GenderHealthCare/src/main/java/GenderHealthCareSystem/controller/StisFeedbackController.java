package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.service.StisFeedbackService;
import GenderHealthCareSystem.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import static GenderHealthCareSystem.util.PageResponseUtil.mapToPageResponse;

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
    public ResponseEntity<ApiResponse<StisFeedback>> addFeedback(@RequestBody StisFeedbackRequest req) {
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

    /**
     * Gets the feedback history for the authenticated user
     * 
     * @param page The page number (0-based)
     * @param size The page size
     * @param sort The sort direction ("asc" or "desc")
     * @param jwt  The JWT token of the authenticated user
     * @return ResponseEntity with paginated feedback history
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PageResponse<StisFeedbackResponse>>> getFeedbackHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @AuthenticationPrincipal Jwt jwt) {

        try {
            int userId = Integer.parseInt(jwt.getClaimAsString("userID"));
            Page<StisFeedbackResponse> feedbackHistory = feedbackService.getUserFeedbackHistory(userId, page, size,
                    sort);

            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Lịch sử đánh giá", mapToPageResponse(feedbackHistory), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }
}