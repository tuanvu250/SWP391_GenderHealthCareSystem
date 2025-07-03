package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.*;
import GenderHealthCareSystem.service.QuestionCommentService;
import GenderHealthCareSystem.service.QuestionService;
import GenderHealthCareSystem.util.PageResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionCommentService questionCommentService;

    @PostMapping
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        
        Integer customerId = Integer.parseInt(jwt.getClaimAsString("userID"));
        QuestionResponse response = questionService.createQuestion(request, customerId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED, "Question created successfully", response, null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions;
        
        if (search != null && !search.trim().isEmpty()) {
            questions = questionService.searchQuestions(search, pageable);
        } else {
            questions = questionService.getAllQuestions(pageable);
        }
        
        PageResponse<QuestionResponse> pageResponse = PageResponseUtil.mapToPageResponse(questions);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Questions retrieved successfully", pageResponse, null));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> getPendingQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService.getPendingQuestions(pageable);
        PageResponse<QuestionResponse> pageResponse = PageResponseUtil.mapToPageResponse(questions);
        
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Pending questions retrieved successfully", pageResponse, null));
    }

    @GetMapping("/answered")
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> getAnsweredQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionResponse> questions = questionService.getAnsweredQuestions(pageable);
        PageResponse<QuestionResponse> pageResponse = PageResponseUtil.mapToPageResponse(questions);
        
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Answered questions retrieved successfully", pageResponse, null));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> getAllQuestionsForCustomerEndpoint(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        // Frontend muốn hiện tất cả câu hỏi, không filter theo customerId
        Page<QuestionResponse> questions = questionService.getAllQuestions(pageable);
        PageResponse<QuestionResponse> pageResponse = PageResponseUtil.mapToPageResponse(questions);

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "All questions retrieved successfully", pageResponse, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable Integer id) {
        QuestionResponse response = questionService.getQuestionById(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Question retrieved successfully", response, null));
    }


    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<QuestionCommentResponse>>> getQuestionComments(@PathVariable Integer id) {
        List<QuestionCommentResponse> comments = questionCommentService.getCommentsByQuestionId(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Comments retrieved successfully", comments, null));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('Customer', 'Consultant')")
    public ResponseEntity<ApiResponse<QuestionCommentResponse>> createComment(
            @PathVariable Integer id,
            @Valid @RequestBody QuestionCommentRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        request.setQuestionId(id); // Ensure question ID matches path parameter

        QuestionCommentResponse response = questionCommentService.createComment(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED, "Comment created successfully", response, null));
    }

    @PostMapping("/{id}/answer")
    @PreAuthorize("hasRole('Consultant')")
    public ResponseEntity<ApiResponse<QuestionResponse>> answerQuestion(
            @PathVariable Integer id,
            @Valid @RequestBody AnswerRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        
        Integer consultantId = Integer.parseInt(jwt.getClaimAsString("userID"));
        QuestionResponse response = questionService.answerQuestion(id, request.getAnswer(), consultantId);
        
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Question answered successfully", response, null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable Integer id,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        
        Integer customerId = Integer.parseInt(jwt.getClaimAsString("userID"));
        QuestionResponse response = questionService.updateQuestion(id, request, customerId);
        
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Question updated successfully", response, null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable Integer id,
            @AuthenticationPrincipal Jwt jwt) {

        Integer customerId = Integer.parseInt(jwt.getClaimAsString("userID"));
        questionService.deleteQuestion(id, customerId);

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Question permanently deleted", null, null));
    }
}
