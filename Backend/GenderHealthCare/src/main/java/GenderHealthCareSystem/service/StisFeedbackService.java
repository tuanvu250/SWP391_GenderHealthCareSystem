package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisFeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StisFeedbackService {
    private final StisFeedbackRepository feedbackRepo;
    private final StisBookingRepository bookingRepo;

    @PersistenceContext
    private EntityManager entityManager;

    // Create
    public StisFeedbackResponse createFeedbackResponse(StisFeedbackRequest req) {
        StisFeedback feedback = createFeedback(req);
        return convert(feedback);
    }

    private StisFeedback createFeedback(StisFeedbackRequest req) {
        StisBooking booking = bookingRepo.findById(req.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại!"));

        if (booking.getStatus() != StisBookingStatus.COMPLETED) {
            throw new IllegalStateException("Chỉ được đánh giá khi booking đã COMPLETED!");
        }
        if (feedbackRepo.existsByStisBooking_BookingId(req.getBookingId())) {
            throw new IllegalStateException("Booking này đã đánh giá rồi!");
        }

        StisFeedback feedback = new StisFeedback();
        feedback.setStisBooking(booking);
        feedback.setUserId(booking.getCustomer().getUserId());
        feedback.setRating(req.getRating());
        feedback.setComment(req.getComment());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setStisService(booking.getStisService());

        return feedbackRepo.save(feedback);
    }

    // Read
    public List<StisFeedbackResponse> getByServiceResponse(Integer serviceId) {
        List<StisFeedback> feedbacks = feedbackRepo.findByStisService_ServiceId(serviceId);
        return feedbacks.stream().map(this::convert).collect(Collectors.toList());
    }

    public List<StisFeedbackResponse> getByUserResponse(Integer userId) {
        List<StisFeedback> feedbacks = feedbackRepo.findByUserId(userId);
        return feedbacks.stream().map(this::convert).collect(Collectors.toList());
    }

    public double getAvgRating(Integer serviceId) {
        List<StisFeedback> feedbacks = feedbackRepo.findByStisService_ServiceId(serviceId);
        if (feedbacks.isEmpty())
            return 0;
        return feedbacks.stream().mapToInt(StisFeedback::getRating).average().orElse(0);
    }

    // Update
    public StisFeedbackResponse updateFeedbackResponse(Integer feedbackId, StisFeedbackRequest req) {
        StisFeedback feedback = updateFeedback(feedbackId, req);
        return convert(feedback);
    }

    private StisFeedback updateFeedback(Integer feedbackId, StisFeedbackRequest req) {
        StisFeedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại!"));

        if (req.getRating() != null) {
            feedback.setRating(req.getRating());
        }
        if (req.getComment() != null) {
            feedback.setComment(req.getComment());
        }

        return feedbackRepo.save(feedback);
    }

    // Delete
    @Transactional
    public void deleteFeedback(Integer feedbackId) {
        StisFeedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại!"));

        entityManager.remove(feedback);
        entityManager.flush();
    }

    // Utility
    private StisFeedbackResponse convert(StisFeedback feedback) {
        StisFeedbackResponse response = new StisFeedbackResponse();
        response.setFeedbackId(feedback.getFeedbackId());
        response.setUserId(feedback.getUserId());
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());
        return response;
    }
}
