package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisFeedbackRepository;
import GenderHealthCareSystem.repository.StisServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for handling STI service feedback operations
 */
@Service
@RequiredArgsConstructor
public class StisFeedbackService {
    private final StisFeedbackRepository feedbackRepo;
    private final StisBookingRepository bookingRepo;
    private final StisServiceRepository serviceRepo;

    /**
     * Creates a new feedback for a completed STI service booking
     * 
     * @param req The feedback request containing bookingId, rating, and comment
     * @return The created feedback entity
     * @throws IllegalStateException    if authentication fails or booking status is
     *                                  invalid
     * @throws IllegalArgumentException if booking doesn't exist
     */
    public StisFeedback createFeedback(StisFeedbackRequest req) {
        // Extract user ID from JWT token
        Integer userId = extractUserIdFromToken();

        // Get and validate the booking
        StisBooking booking = validateAndGetBooking(req.getBookingId());

        // Create and save the feedback
        StisFeedback feedback = new StisFeedback();
        feedback.setStisBooking(booking);
        feedback.setRating(req.getRating());
        feedback.setComment(req.getComment());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setStisService(booking.getStisService());
        feedback.setUserId(userId);

        return feedbackRepo.save(feedback);
    }

    /**
     * Extracts the user ID from the JWT token in the security context
     * 
     * @return The user ID as an Integer
     * @throws IllegalStateException if authentication fails
     */
    private Integer extractUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken)) {
            throw new IllegalStateException("Xác thực không hợp lệ. Vui lòng đăng nhập lại.");
        }

        JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
        Jwt jwt = jwtToken.getToken();
        Long userIdLong = jwt.getClaim("userID");
        return userIdLong.intValue();
    }

    /**
     * Validates and retrieves the booking by ID
     * 
     * @param bookingId The ID of the booking to validate
     * @return The validated booking entity
     * @throws IllegalArgumentException if booking doesn't exist
     * @throws IllegalStateException    if booking is not completed or already has
     *                                  feedback
     */
    private StisBooking validateAndGetBooking(Integer bookingId) {
        StisBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại!"));

        if (booking.getStatus() != StisBookingStatus.COMPLETED) {
            throw new IllegalStateException("Chỉ được đánh giá khi booking đã COMPLETED!");
        }

        if (feedbackRepo.existsByStisBooking_BookingId(bookingId)) {
            throw new IllegalStateException("Booking này đã đánh giá rồi!");
        }

        return booking;
    }
}