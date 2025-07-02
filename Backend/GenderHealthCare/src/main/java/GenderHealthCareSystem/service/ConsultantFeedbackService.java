package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.ConsultantFeedbackRequest;
import GenderHealthCareSystem.dto.ConsultantFeedbackResponse;
import GenderHealthCareSystem.model.ConsultantFeedback;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.repository.ConsultantFeedbackRepository;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Simple Service for handling Consultant feedback operations without Specification
 */
@Service
@RequiredArgsConstructor
public class ConsultantFeedbackService {

    private final ConsultantFeedbackRepository feedbackRepo;
    private final ConsultationBookingRepository bookingRepo;

    /**
     * Create new feedback
     */
    @Transactional
    public ConsultantFeedbackResponse createFeedback(ConsultantFeedbackRequest request) {
        // Validate booking exists
        ConsultationBooking booking = bookingRepo.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        // Check if feedback already exists
        if (feedbackRepo.existsByConsultationBooking_BookingId(request.getBookingId())) {
            throw new IllegalArgumentException("Feedback đã tồn tại cho booking này");
        }

        // Create feedback
        ConsultantFeedback feedback = new ConsultantFeedback();
        feedback.setConsultationBooking(booking);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        ConsultantFeedback saved = feedbackRepo.save(feedback);
        return mapToResponse(saved);
    }

    /**
     * Get feedback by consultant with simple filtering
     */
    public Page<ConsultantFeedbackResponse> getConsultantFeedback(
            Integer consultantId, int page, int size, String sortBy, String direction, Integer rating) {

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
            Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ConsultantFeedback> feedbackPage;
        
        // Simple if/else logic
        if (rating != null) {
            feedbackPage = feedbackRepo.findByConsultationBooking_Consultant_UserIdAndRating(
                consultantId, rating, pageable);
        } else {
            feedbackPage = feedbackRepo.findByConsultationBooking_Consultant_UserId(
                consultantId, pageable);
        }

        return feedbackPage.map(this::mapToResponse);
    }

    /**
     * Get all feedback with simple filtering
     */
    public Page<ConsultantFeedbackResponse> getAllFeedback(
            int page, int size, String sortBy, String direction, Integer consultantId, Integer rating) {

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ConsultantFeedback> feedbacks;
        
        // Simple if/else logic
        if (consultantId != null && rating != null) {
            feedbacks = feedbackRepo.findByConsultationBooking_Consultant_UserIdAndRating(
                consultantId, rating, pageable);
        } else if (consultantId != null) {
            feedbacks = feedbackRepo.findByConsultationBooking_Consultant_UserId(
                consultantId, pageable);
        } else if (rating != null) {
            feedbacks = feedbackRepo.findByRating(rating, pageable);
        } else {
            feedbacks = feedbackRepo.findAll(pageable);
        }
        
        return feedbacks.map(this::mapToResponse);
    }

    /**
     * Update feedback
     */
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

    /**
     * Delete feedback - FIXED VERSION
     */
    @Transactional
    public void deleteFeedback(Integer feedbackId) {
        if (!feedbackRepo.existsById(feedbackId)) {
            throw new IllegalArgumentException("Feedback không tồn tại");
        }

        feedbackRepo.deleteByFeedbackId(feedbackId);
    }

    /**
     * Get average rating for consultant
     */
    public Double getAverageRating(Integer consultantId) {
        Double avg = feedbackRepo.getAverageRatingByConsultantId(consultantId);
        return avg != null ? avg : 0.0;
    }

    /**
     * Get total feedback count for consultant
     */
    public Long getFeedbackCount(Integer consultantId) {
        Long count = feedbackRepo.getCountByConsultantId(consultantId);
        return count != null ? count : 0L;
    }

    /**
     * Check if feedback exists for booking
     */
    public boolean feedbackExists(Integer bookingId) {
        return feedbackRepo.existsByConsultationBooking_BookingId(bookingId);
    }

    /**
     * Get feedback by booking ID
     */
    public ConsultantFeedbackResponse getFeedbackByBookingId(Integer bookingId) {
        ConsultantFeedback feedback = feedbackRepo.findByConsultationBooking_BookingId(bookingId);
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback không tồn tại cho booking này");
        }
        return mapToResponse(feedback);
    }



    /**
     * Get total average rating across all consultants
     */
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
        response.setBookingId(feedback.getConsultationBooking().getBookingId());
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());
        
        // Set consultant info
        if (feedback.getConsultationBooking().getConsultant() != null) {
            response.setConsultantName(feedback.getConsultationBooking().getConsultant().getFullName());
        }
        
        // Set customer info
        if (feedback.getConsultationBooking().getCustomer() != null) {
            response.setCustomerName(feedback.getConsultationBooking().getCustomer().getFullName());
        }
        
        return response;
    }
}
