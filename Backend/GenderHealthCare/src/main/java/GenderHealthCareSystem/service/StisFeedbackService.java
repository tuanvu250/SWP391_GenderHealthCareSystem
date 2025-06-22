package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisFeedbackRepository;
import GenderHealthCareSystem.repository.StisServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StisFeedbackService {
    private final StisFeedbackRepository feedbackRepo;
    private final StisBookingRepository bookingRepo;
    private final StisServiceRepository serviceRepo;

    @PersistenceContext
    private EntityManager entityManager;

    public StisFeedback createFeedback(StisFeedbackRequest req) {
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
        feedback.setRating(req.getRating());
        feedback.setComment(req.getComment());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setStisService(booking.getStisService()); // mapping service

        return feedbackRepo.save(feedback);
    }

    public List<StisFeedback> getByService(Integer serviceId) {
        return feedbackRepo.findByStisService_ServiceId(serviceId);
    }

    public double getAvgRating(Integer serviceId) {
        List<StisFeedback> feedbacks = feedbackRepo.findByStisService_ServiceId(serviceId);
        if (feedbacks.isEmpty())
            return 0;
        return feedbacks.stream().mapToInt(StisFeedback::getRating).average().orElse(0);
    }

    public StisFeedback updateFeedback(Integer feedbackId, StisFeedbackRequest req) {
        StisFeedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại!"));

        // Chỉ cập nhật những field được cung cấp, giữ nguyên các field khác
        if (req.getRating() != null) {
            feedback.setRating(req.getRating());
        }
        if (req.getComment() != null) {
            feedback.setComment(req.getComment());
        }

        return feedbackRepo.save(feedback);
    }

    @Transactional
    public void deleteFeedback(Integer feedbackId) {
        StisFeedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback không tồn tại!"));

        entityManager.remove(feedback);
        entityManager.flush();
    }
}
