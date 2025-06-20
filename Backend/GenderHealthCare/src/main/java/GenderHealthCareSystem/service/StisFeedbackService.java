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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StisFeedbackService {
    private final StisFeedbackRepository feedbackRepo;
    private final StisBookingRepository bookingRepo;
    private final StisServiceRepository serviceRepo;

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
        if (feedbacks.isEmpty()) return 0;
        return feedbacks.stream().mapToInt(StisFeedback::getRating).average().orElse(0);
    }
}
