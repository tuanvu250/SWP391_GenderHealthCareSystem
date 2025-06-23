package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisFeedbackRepository;
import GenderHealthCareSystem.repository.StisServiceRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

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
        feedback.setStatus("ACTIVE");

        LocalDateTime now = LocalDateTime.now();
        feedback.setCreatedAt(now);
        feedback.setUpdatedAt(now);
        feedback.setStisService(booking.getStisService());
        feedback.setUserId(userId);

        return feedbackRepo.save(feedback);
    }

    /**
     * Gets the feedback history for a specific user with pagination
     *
     * @param userId The ID of the user
     * @param page   The page number (0-based)
     * @param size   The page size
     * @param sort   The sort direction ("asc" or "desc")
     * @return Page of StisFeedbackResponse DTOs
     */
    public Page<StisFeedbackResponse> getUserFeedbackHistory(Integer userId, int page, int size, String sort) {
        // Create pageable object with sort direction
        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));

        // Get feedback page from repository - only ACTIVE status
        Page<StisFeedback> feedbackPage = feedbackRepo.findByUserIdAndStatus(userId, "ACTIVE", pageable);

        // Map to response DTOs
        return feedbackPage.map(this::mapToResponse);
    }

    /**
     * Maps a StisFeedback entity to a StisFeedbackResponse DTO
     * 
     * @param feedback The feedback entity to map
     * @return The mapped response DTO
     */
    private StisFeedbackResponse mapToResponse(StisFeedback feedback) {
        StisFeedbackResponse response = new StisFeedbackResponse();
        response.setFeedbackId(feedback.getFeedbackId());
        response.setBookingId(feedback.getStisBooking().getBookingId());
        response.setBookingDate(feedback.getStisBooking().getBookingDate());
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());
        response.setUpdatedAt(feedback.getUpdatedAt());
        response.setServiceName(feedback.getStisService().getServiceName());
        response.setStatus(feedback.getStatus());
        return response;
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

    /**
     * Gets all feedback for a specific service with ACTIVE status
     *
     * @param serviceId The ID of the service
     * @return List of StisFeedbackResponse DTOs
     */
    public List<StisFeedbackResponse> getServiceFeedback(Integer serviceId) {
        // Get feedback list from repository - only ACTIVE status
        List<StisFeedback> feedbackList = feedbackRepo.findByStisService_ServiceIdAndStatus(serviceId, "ACTIVE");

        // Map to response DTOs
        return feedbackList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

}