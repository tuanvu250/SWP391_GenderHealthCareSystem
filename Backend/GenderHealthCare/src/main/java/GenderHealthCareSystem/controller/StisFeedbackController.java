package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.service.StisFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stis-feedback")
@RequiredArgsConstructor
public class StisFeedbackController {
    private final StisFeedbackService feedbackService;

    // Create
    @PostMapping
    public ResponseEntity<?> addFeedback(@RequestBody StisFeedbackRequest req) {
        try {
            return ResponseEntity.ok(feedbackService.createFeedbackResponse(req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Read
    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<List<StisFeedbackResponse>> getByService(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getByServiceResponse(serviceId));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<StisFeedbackResponse>> getByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(feedbackService.getByUserResponse(userId));
    }

    @GetMapping("/average/{serviceId}")
    public ResponseEntity<Double> getAvgRating(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getAvgRating(serviceId));
    }

    // Update
    @PutMapping("/update/{feedbackId}")
    public ResponseEntity<?> updateFeedback(@PathVariable Integer feedbackId, @RequestBody StisFeedbackRequest req) {
        try {
            return ResponseEntity.ok(feedbackService.updateFeedbackResponse(feedbackId, req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Delete
    @DeleteMapping("/delete/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Integer feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok("Feedback đã được xóa thành công!");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
