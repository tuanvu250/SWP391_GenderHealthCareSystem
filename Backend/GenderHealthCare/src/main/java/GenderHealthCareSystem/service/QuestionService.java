package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.QuestionRequest;
import GenderHealthCareSystem.dto.QuestionResponse;
import GenderHealthCareSystem.model.Question;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.QuestionRepository;
import GenderHealthCareSystem.repository.QuestionCommentRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final UserRepository userRepository;

    @Transactional
    public QuestionResponse createQuestion(QuestionRequest request, Integer customerId) {
        Users customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));

        Question question = new Question();
        question.setCustomer(customer);
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setCreatedAt(LocalDateTime.now());
        question.setStatus("PENDING");

        if (request.getConsultantId() != null) {
            Users consultant = userRepository.findById(request.getConsultantId())
                    .orElseThrow(() -> new RuntimeException("Consultant not found with ID: " + request.getConsultantId()));
            question.setConsultant(consultant);
        }

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    public Page<QuestionResponse> getAllQuestions(Pageable pageable) {
        Page<Question> questions = questionRepository.findByStatusOrderByCreatedAtDesc("PENDING", pageable);
        return questions.map(this::mapToResponse);
    }

    public Page<QuestionResponse> getPendingQuestions(Pageable pageable) {
        Page<Question> questions = questionRepository.findPendingQuestions(pageable);
        return questions.map(this::mapToResponse);
    }

    public Page<QuestionResponse> getAnsweredQuestions(Pageable pageable) {
        Page<Question> questions = questionRepository.findAnsweredQuestions(pageable);
        return questions.map(this::mapToResponse);
    }

    public QuestionResponse getQuestionById(Integer questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));
        return mapToResponse(question);
    }

    @Transactional
    public QuestionResponse answerQuestion(Integer questionId, String answer, Integer consultantId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (question.isAnswered()) {
            throw new RuntimeException("Question has already been answered");
        }

        Users consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found with ID: " + consultantId));

        question.setAnswer(answer);
        question.setAnswerBy(consultant);
        question.setAnsweredAt(LocalDateTime.now());
        question.setStatus("ANSWERED");

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    @Transactional
    public QuestionResponse updateQuestion(Integer questionId, QuestionRequest request, Integer customerId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (question.isAnswered()) {
            throw new RuntimeException("Cannot update answered question");
        }

        if (!question.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("You can only update your own questions");
        }

        question.setTitle(request.getTitle());
        question.setContent(request.getContent());

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    @Transactional
    public void deleteQuestion(Integer questionId, Integer customerId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (question.isAnswered()) {
            throw new RuntimeException("Cannot delete answered question");
        }

        if (!question.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("You can only delete your own questions");
        }

        questionCommentRepository.deleteByQuestion_QuestionId(questionId);
        questionRepository.deleteById(questionId);
    }

    @Transactional
    public void softDeleteQuestion(Integer questionId, Integer customerId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

        if (question.isAnswered()) {
            throw new RuntimeException("Cannot delete answered question");
        }

        if (!question.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("You can only delete your own questions");
        }

        question.setStatus("DELETED");
        questionRepository.save(question);
    }

    public Page<QuestionResponse> searchQuestions(String keyword, Pageable pageable) {
        Page<Question> questions = questionRepository.searchQuestions(keyword, "PENDING", pageable);
        return questions.map(this::mapToResponse);
    }

    private QuestionResponse mapToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setQuestionId(question.getQuestionId());
        response.setTitle(question.getTitle());
        response.setContent(question.getContent());
        response.setAnswer(question.getAnswer());
        response.setCreatedAt(question.getCreatedAt());
        response.setAnsweredAt(question.getAnsweredAt());
        response.setStatus(question.getStatus());
        response.setAnswered(question.isAnswered());

        if (question.getCustomer() != null) {
            response.setCustomerId(question.getCustomer().getUserId());
            response.setCustomerFullName(question.getCustomer().getFullName());
            response.setCustomerImageUrl(question.getCustomer().getUserImageUrl());
        }

        if (question.getConsultant() != null) {
            response.setConsultantId(question.getConsultant().getUserId());
            response.setConsultantFullName(question.getConsultant().getFullName());
            response.setConsultantImageUrl(question.getConsultant().getUserImageUrl());
        }

        if (question.getAnswerBy() != null) {
            response.setAnswerById(question.getAnswerBy().getUserId());
            response.setAnswerByFullName(question.getAnswerBy().getFullName());
            response.setAnswerByImageUrl(question.getAnswerBy().getUserImageUrl());
        }

        long commentCount = questionCommentRepository.countByQuestionId(question.getQuestionId());
        response.setCommentCount((int) commentCount);

        return response;
    }
}
