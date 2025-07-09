package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.ConsultantFeedbackRequest;
import GenderHealthCareSystem.dto.ConsultantFeedbackResponse;
import GenderHealthCareSystem.dto.ConsultantFeedbackCreateResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.RatingStatisticsResponse;
import GenderHealthCareSystem.service.ConsultantFeedbackService;
import GenderHealthCareSystem.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/consultant-feedback")
@RequiredArgsConstructor
public class ConsultantFeedbackController {

    private final ConsultantFeedbackService feedbackService;


    @PostMapping
    public ResponseEntity<ApiResponse<ConsultantFeedbackCreateResponse>> createFeedback(@RequestBody @Valid ConsultantFeedbackRequest req) {
        try {
            ConsultantFeedbackResponse feedback = feedbackService.createFeedback(req);
            ConsultantFeedbackCreateResponse response = new ConsultantFeedbackCreateResponse(
                    feedback.getFeedbackId(),
                    feedback.getBookingId(),
                    feedback.getRating(),
                    feedback.getComment(),
                    feedback.getCreatedAt()
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Đánh giá tư vấn đã được ghi nhận", response, null));
        } catch (IllegalArgumentException ex) {
            if (ex.getMessage().contains("đã đánh giá") || ex.getMessage().contains("already rated")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse<>(HttpStatus.CONFLICT, ex.getMessage(), null, "CONFLICT"));
            }
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


    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<ConsultantFeedbackResponse>> getFeedbackByBooking(@PathVariable Integer bookingId) {
        try {
            ConsultantFeedbackResponse feedback = feedbackService.getFeedbackByBookingId(bookingId);
            if (feedback != null) {
                return ResponseEntity.ok(
                        new ApiResponse<>(HttpStatus.OK, "Lấy đánh giá thành công", feedback, null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá cho booking này", null, "NOT_FOUND"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Gets all feedback with pagination and filters
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ConsultantFeedbackResponse>>> getAllFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Integer consultantId,
            @RequestParam(required = false) Integer rating) {
        try {
            Page<ConsultantFeedbackResponse> feedbackPage = feedbackService.getAllFeedback(
                    page, size, sortBy, direction, consultantId, rating);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách tất cả đánh giá tư vấn",
                            mapToPageResponse(feedbackPage), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Gets feedback for a specific consultant
     */
    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<ApiResponse<PageResponse<ConsultantFeedbackResponse>>> getConsultantFeedback(
            @PathVariable Integer consultantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Integer rating) {
        try {
            Page<ConsultantFeedbackResponse> feedbackPage = feedbackService.getConsultantFeedback(
                    consultantId, page, size, sortBy, direction, rating);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách đánh giá tư vấn viên",
                            mapToPageResponse(feedbackPage), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    @GetMapping("/my-feedback")
    public ResponseEntity<ApiResponse<PageResponse<ConsultantFeedbackResponse>>> getMyFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Integer rating) {
        try {
            Page<ConsultantFeedbackResponse> feedbackPage = feedbackService.getMyFeedback(
                    page, size, sortBy, direction, rating);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách đánh giá của tôi",
                            mapToPageResponse(feedbackPage), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    @GetMapping("/my-posted-feedback")
    public ResponseEntity<ApiResponse<PageResponse<ConsultantFeedbackResponse>>> getMyPostedFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            Page<ConsultantFeedbackResponse> feedbackPage = feedbackService.getMyPostedFeedback(
                    page, size, sortBy, direction);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách feedback tôi đã đăng",
                            mapToPageResponse(feedbackPage), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Gets the average rating for a specific consultant
     *
     * @param consultantId The ID of the consultant
     * @return ResponseEntity with the average rating
     */
    @GetMapping("/average/{consultantId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getConsultantAverageRating(@PathVariable Integer consultantId) {
        try {
            double avgRating = feedbackService.getAverageRating(consultantId);
            long feedbackCount = feedbackService.getFeedbackCount(consultantId);

            Map<String, Object> result = new HashMap<>();
            result.put("consultantId", consultantId);
            result.put("averageRating", Math.round(avgRating * 100.0) / 100.0); // Round to 2 decimal places
            result.put("totalFeedbacks", feedbackCount);

            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Rating trung bình của tư vấn viên", result, null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Gets the total average rating across all consultants
     *
     * @return ResponseEntity with the overall average rating
     */
    @GetMapping("/total-average")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTotalAverageRating() {
        try {
            double totalAvgRating = feedbackService.getTotalAverageRating();

            Map<String, Object> result = new HashMap<>();
            result.put("totalAverageRating", Math.round(totalAvgRating * 100.0) / 100.0);

            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Rating trung bình tổng", result, null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }
    /**
     * Updates an existing feedback
     *
     * @param feedbackId The ID of the feedback to update
     * @param request The updated feedback data
     * @return ResponseEntity with updated feedback
     */
    @PutMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<ConsultantFeedbackResponse>> updateFeedback(
            @PathVariable Integer feedbackId,
            @RequestBody @Valid ConsultantFeedbackRequest request) {
        try {
            ConsultantFeedbackResponse updatedFeedback = feedbackService.updateFeedback(feedbackId, request);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Đánh giá đã được cập nhật", updatedFeedback, null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND, ex.getMessage(), null, "NOT_FOUND"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    /**
     * Deletes a feedback
     *
     * @param feedbackId The ID of the feedback to delete
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<String>> deleteFeedback(@PathVariable Integer feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Đánh giá đã được xóa", "Deleted successfully", null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND, ex.getMessage(), null, "NOT_FOUND"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    @GetMapping("/rating-statistics")
    public ResponseEntity<ApiResponse<RatingStatisticsResponse>> getRatingStatistics() {
        try {
            RatingStatisticsResponse statistics = feedbackService.getRatingStatistics();
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Thống kê rating tổng", statistics, null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null, "SERVER_ERROR"));
        }
    }

    private PageResponse<ConsultantFeedbackResponse> mapToPageResponse(Page<ConsultantFeedbackResponse> page) {
        return PageResponseUtil.mapToPageResponse(page);
    }
}
