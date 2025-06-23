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

import java.util.List;

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

    /**
     * Gets all feedback for a specific service with ACTIVE status
     * 
     * @param serviceId The ID of the service
     * @return ResponseEntity with list of feedback for the service
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<ApiResponse<List<StisFeedbackResponse>>> getServiceFeedback(
            @PathVariable Integer serviceId) {
        try {
            List<StisFeedbackResponse> feedbackList = feedbackService.getServiceFeedback(serviceId);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách đánh giá dịch vụ", feedbackList, null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Updates an existing feedback by ID
     *
     * @param id  The ID of the feedback to update
     * @param req The feedback entity with updated information
     * @return ResponseEntity with the updated feedback or error message
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StisFeedback>> update(@PathVariable Integer id, @RequestBody StisFeedback req) {
        try {
            StisFeedback updated = feedbackService.update(id, req);
            ApiResponse<StisFeedback> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Cập nhật đánh giá thành công",
                    updated,
                    null);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<StisFeedback> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy đánh giá để cập nhật",
                    null,
                    "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    /**
     * Hides a feedback by setting its status to "HIDDEN"
     *
     * @param id The ID of the feedback to hide
     * @return ResponseEntity with the updated feedback or error message
     */
    @PutMapping("/{id}/hide")
    public ResponseEntity<ApiResponse<StisFeedback>> hideFeedback(@PathVariable Integer id) {
        try {
            StisFeedback updated = feedbackService.hideFeedback(id);
            ApiResponse<StisFeedback> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Đã ẩn đánh giá thành công",
                    updated,
                    null);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<StisFeedback> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy đánh giá để ẩn",
                    null,
                    "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    /**
     * Gets all feedback for the authenticated user with pagination and optional
     * filters
     *
     * @param page      The page number (0-based)
     * @param size      The page size
     * @param sort      The sort direction ("asc" or "desc")
     * @param serviceId Optional service ID to filter by (can be null)
     * @param rating    Optional rating to filter by (can be null)
     * @return ResponseEntity with paginated user feedback
     */
    @GetMapping("/user-feedback")
    public ResponseEntity<ApiResponse<PageResponse<StisFeedbackResponse>>> getUserFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) Integer serviceId,
            @RequestParam(required = false) Integer rating) {

        try {
            Page<StisFeedbackResponse> feedbackPage = feedbackService.getAllUserFeedback(page, size, sort, serviceId,
                    rating);

            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách đánh giá của người dùng",
                            mapToPageResponse(feedbackPage), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    @GetMapping("/average/{serviceId}")
    public ResponseEntity<Double> getAvgRating(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getAvgRating(serviceId));
    }

    /**
     * Gets the average rating across all feedback
     * 
     * @return The overall average rating
     */
    @GetMapping("/total-average")
    public ResponseEntity<Double> getTotalAvgRating() {
        return ResponseEntity.ok(feedbackService.getTotalAvgRating());
    }
}