package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.service.StisFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stis-feedback")
@RequiredArgsConstructor
public class StisFeedbackController {
    private final StisFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<?> addFeedback(@RequestBody StisFeedbackRequest req) {
        try {
            return ResponseEntity.ok(feedbackService.createFeedback(req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<List<StisFeedback>> getByService(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getByService(serviceId));
    }
    @GetMapping("/average/{serviceId}")
    public ResponseEntity<Double> getAvgRating(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(feedbackService.getAvgRating(serviceId));
    }
}
