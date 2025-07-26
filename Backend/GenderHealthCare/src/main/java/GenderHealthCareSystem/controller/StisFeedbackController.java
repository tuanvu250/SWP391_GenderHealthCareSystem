package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.RatingStatisticsResponse;
import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.service.StisFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import static GenderHealthCareSystem.util.PageResponseUtil.mapToPageResponse;

import java.util.List;


@RestController
@RequestMapping("/api/stis-feedback")
@RequiredArgsConstructor
public class StisFeedbackController {
    private final StisFeedbackService feedbackService;

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

    @GetMapping("/average/{serviceId}")
    public ResponseEntity<Double> getAvgRating(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getAvgRating(serviceId));
    }

    @GetMapping("/total-average")
    public ResponseEntity<Double> getTotalAvgRating() {
        return ResponseEntity.ok(feedbackService.getTotalAvgRating());
    }

    @DeleteMapping("/delete/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Integer feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok("Feedback đã được xóa thành công!");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @CrossOrigin
    @GetMapping("/public-feedback")
    public ResponseEntity<ApiResponse<PageResponse<StisFeedbackResponse>>> getAllPublicFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) Integer serviceId,
            @RequestParam(required = false) Integer rating) {

        try {
            Page<StisFeedbackResponse> feedbackPage = feedbackService.getAllActiveFeedback(page, size, serviceId,
                    rating);
            return ResponseEntity.ok(
                    new ApiResponse<>(HttpStatus.OK, "Danh sách tất cả đánh giá", mapToPageResponse(feedbackPage),
                            null));
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


}