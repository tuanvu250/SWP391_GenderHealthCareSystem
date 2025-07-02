package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.QuestionCommentRequest;
import GenderHealthCareSystem.dto.QuestionCommentResponse;
import GenderHealthCareSystem.model.Question;
import GenderHealthCareSystem.model.QuestionComment;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.QuestionCommentRepository;
import GenderHealthCareSystem.repository.QuestionRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionCommentService {

    private final QuestionCommentRepository questionCommentRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Transactional
    public QuestionCommentResponse createComment(QuestionCommentRequest request, Integer userId) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + request.getQuestionId()));

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        QuestionComment comment = new QuestionComment();
        comment.setQuestion(question);
        comment.setUser(user);
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        // Removed status setting - all comments are visible by default

        QuestionComment savedComment = questionCommentRepository.save(comment);
        return mapToResponse(savedComment);
    }

    public List<QuestionCommentResponse> getCommentsByQuestionId(Integer questionId) {
        List<QuestionComment> comments = questionCommentRepository
                .findByQuestion_QuestionIdOrderByCreatedAtAsc(questionId);
        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<QuestionCommentResponse> getCommentsByQuestionId(Integer questionId, Pageable pageable) {
        Page<QuestionComment> comments = questionCommentRepository
                .findByQuestion_QuestionIdOrderByCreatedAtAsc(questionId, pageable);
        return comments.map(this::mapToResponse);
    }

    public Page<QuestionCommentResponse> getCommentsByUserId(Integer userId, Pageable pageable) {
        Page<QuestionComment> comments = questionCommentRepository
                .findByUser_UserIdOrderByCreatedAtDesc(userId, pageable);
        return comments.map(this::mapToResponse);
    }

    // Removed deleteComment method - comments cannot be hidden/deleted to maintain conversation integrity

    private QuestionCommentResponse mapToResponse(QuestionComment comment) {
        QuestionCommentResponse response = new QuestionCommentResponse();
        response.setCommentId(comment.getCommentId());
        response.setQuestionId(comment.getQuestion().getQuestionId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        // Removed status mapping - no longer needed

        // User information
        if (comment.getUser() != null) {
            response.setUserId(comment.getUser().getUserId());
            response.setUserFullName(comment.getUser().getFullName());
            response.setUserImageUrl(comment.getUser().getUserImageUrl());
        }

        return response;
    }
}
