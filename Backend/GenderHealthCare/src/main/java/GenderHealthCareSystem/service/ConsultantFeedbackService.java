package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.ConsultantFeedbackRequest;
import GenderHealthCareSystem.dto.ConsultantFeedbackResponse;
import GenderHealthCareSystem.dto.RatingStatisticsResponse;
import GenderHealthCareSystem.model.ConsultantFeedback;
import GenderHealthCareSystem.model.ConsultantProfile;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.ConsultantFeedbackRepository;
import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Simple Service for handling Consultant feedback operations without Specification
 */
@Service
@RequiredArgsConstructor
public class ConsultantFeedbackService {

    private final ConsultantFeedbackRepository feedbackRepo;
    private final ConsultationBookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ConsultantProfileRepository profileRepo;

    /**
     * Create new feedback
     */
    @Transactional
    public ConsultantFeedbackResponse createFeedback(ConsultantFeedbackRequest request) {
        Integer customerId;
        try {
            customerId = extractUserIdFromToken();
            if (customerId == null) {
                throw new IllegalArgumentException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Token không hợp lệ. Vui lòng đăng nhập lại.");
        }

        ConsultantProfile consultantProfile = profileRepo.findByConsultantUserId(request.getConsultantId())
                .orElseThrow(() -> new IllegalArgumentException("Consultant profile không tồn tại"));

        Users customer = userRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer không tồn tại"));

        if (feedbackRepo.existsByCustomer_UserIdAndConsultantProfile_Consultant_UserId(customerId, request.getConsultantId())) {
            throw new IllegalArgumentException("Bạn đã đánh giá consultant này rồi");
        }

        ConsultantFeedback feedback = new ConsultantFeedback();
        feedback.setConsultantProfile(consultantProfile);
        feedback.setCustomer(customer);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        if (request.getBookingId() != null) {
            ConsultationBooking booking = bookingRepo.findById(request.getBookingId()).orElse(null);
            feedback.setConsultationBooking(booking);
        }

        ConsultantFeedback saved = feedbackRepo.save(feedback);
        return mapToResponse(saved);
    }

    private Integer extractUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken) {
            Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
            return jwt.getClaim("userId");
        }
        throw new IllegalStateException("Không thể xác thực người dùng");
    }


    public Page<ConsultantFeedbackResponse> getConsultantFeedback(
            Integer consultantId, int page, int size, String sortBy, String direction, Integer rating) {

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
            Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ConsultantFeedback> feedbackPage;

        if (rating != null) {
            feedbackPage = feedbackRepo.findByConsultantProfile_Consultant_UserIdAndRating(consultantId, rating, pageable);
        } else {
            feedbackPage = feedbackRepo.findByConsultantProfile_Consultant_UserId(consultantId, pageable);
        }

        return feedbackPage.map(this::mapToResponse);
    }

    public Page<ConsultantFeedbackResponse> getMyFeedback(int page, int size, String sortBy, String direction, Integer rating) {
        Integer consultantId = extractUserIdFromToken();
        return getConsultantFeedback(consultantId, page, size, sortBy, direction, rating);
    }

    public Page<ConsultantFeedbackResponse> getMyPostedFeedback(int page, int size, String sortBy, String direction) {
        Integer customerId = extractUserIdFromToken();

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
            Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ConsultantFeedback> feedbackPage = feedbackRepo.findByCustomer_UserId(customerId, pageable);
        return feedbackPage.map(this::mapToResponse);
    }


    public Page<ConsultantFeedbackResponse> getAllFeedback(
            int page, int size, String sortBy, String direction, Integer consultantId, Integer rating) {

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ConsultantFeedback> feedbacks;

        if (consultantId != null && rating != null) {
            feedbacks = feedbackRepo.findByConsultantProfile_Consultant_UserIdAndRating(consultantId, rating, pageable);
        } else if (consultantId != null) {
            feedbacks = feedbackRepo.findByConsultantProfile_Consultant_UserId(consultantId, pageable);
        } else if (rating != null) {
            feedbacks = feedbackRepo.findByRating(rating, pageable);
        } else {
            feedbacks = feedbackRepo.findAll(pageable);
        }

        return feedbacks.map(this::mapToResponse);
    }


    @Transactional
    public ConsultantFeedbackResponse updateFeedback(Integer feedbackId, ConsultantFeedbackRequest request) {
        ConsultantFeedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại"));

        // Update fields
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        ConsultantFeedback updated = feedbackRepo.save(feedback);
        return mapToResponse(updated);
    }


    @Transactional
    public void deleteFeedback(Integer feedbackId) {
        if (!feedbackRepo.existsById(feedbackId)) {
            throw new IllegalArgumentException("Feedback không tồn tại");
        }

        feedbackRepo.deleteByFeedbackId(feedbackId);
    }


    public Double getAverageRating(Integer consultantId) {
        Double avg = feedbackRepo.getAverageRatingByConsultantId(consultantId);
        return avg != null ? avg : 0.0;
    }


    public Long getFeedbackCount(Integer consultantId) {
        Long count = feedbackRepo.getCountByConsultantId(consultantId);
        return count != null ? count : 0L;
    }


    public boolean feedbackExists(Integer bookingId) {
        return feedbackRepo.existsByConsultationBooking_BookingId(bookingId);
    }


    public ConsultantFeedbackResponse getFeedbackByBookingId(Integer bookingId) {
        ConsultantFeedback feedback = feedbackRepo.findByConsultationBooking_BookingId(bookingId);
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback không tồn tại cho booking này");
        }
        return mapToResponse(feedback);
    }




    public Double getTotalAverageRating() {
        Double avg = feedbackRepo.getTotalAverageRating();
        return avg != null ? avg : 0.0;
    }

    /**
     * Map entity to response DTO
     */
    private ConsultantFeedbackResponse mapToResponse(ConsultantFeedback feedback) {
        ConsultantFeedbackResponse response = new ConsultantFeedbackResponse();
        response.setFeedbackId(feedback.getFeedbackId());
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());

        if (feedback.getConsultantProfile() != null && feedback.getConsultantProfile().getConsultant() != null) {
            response.setConsultantId(feedback.getConsultantProfile().getConsultant().getUserId());
            response.setConsultantName(feedback.getConsultantProfile().getConsultant().getFullName());
        }

        if (feedback.getCustomer() != null) {
            response.setCustomerId(feedback.getCustomer().getUserId());
            response.setCustomerName(feedback.getCustomer().getFullName());
            response.setCustomerImageUrl(feedback.getCustomer().getUserImageUrl());
        }

        if (feedback.getConsultationBooking() != null) {
            response.setBookingId(feedback.getConsultationBooking().getBookingId());
            response.setBookingDate(feedback.getConsultationBooking().getBookingDate());
        }

        return response;
    }

    public RatingStatisticsResponse getRatingStatistics() {
        Long totalRatings = feedbackRepo.countAllRatings();
        Double averageRating = feedbackRepo.getTotalAverageRating();

        Map<Integer, Long> ratingCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            Long count = feedbackRepo.countByRating(i);
            ratingCounts.put(i, count != null ? count : 0L);
        }

        return new RatingStatisticsResponse(
            totalRatings != null ? totalRatings : 0L,
            averageRating != null ? averageRating : 0.0,
            ratingCounts
        );
    }




}
