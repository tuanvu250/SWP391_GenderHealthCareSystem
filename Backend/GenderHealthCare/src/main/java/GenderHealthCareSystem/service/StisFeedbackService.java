package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisFeedbackRequest;
import GenderHealthCareSystem.dto.StisFeedbackResponse;
import GenderHealthCareSystem.dto.RatingStatisticsResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisFeedback;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisFeedbackRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StisFeedbackService {

    private final StisFeedbackRepository feedbackRepo;
    private final StisBookingRepository bookingRepo;

    public StisFeedback createFeedback(StisFeedbackRequest req) {

        Integer userId = extractUserIdFromToken();

        StisBooking booking = validateAndGetBooking(req.getBookingId());

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

    public Page<StisFeedbackResponse> getUserFeedbackHistory(Integer userId, int page, int size, String sort) {

        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));

        Page<StisFeedback> feedbackPage = feedbackRepo.findByUserIdAndStatus(userId, "ACTIVE", pageable);

        return feedbackPage.map(this::mapToResponse);
    }

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

        // Add user information if available
        Users customer = feedback.getStisBooking().getCustomer();
        if (customer != null) {
            response.setUserId(customer.getUserId());
            response.setUserFullName(customer.getFullName());
            response.setUserImageUrl(customer.getUserImageUrl());
        }

        return response;
    }


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

    public List<StisFeedbackResponse> getServiceFeedback(Integer serviceId) {

        List<StisFeedback> feedbackList = feedbackRepo.findByStisService_ServiceIdAndStatus(serviceId, "ACTIVE");

        return feedbackList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StisFeedback update(Integer id, StisFeedback req) {
        StisFeedback existingFeedback = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá với ID: " + id));

        existingFeedback.setRating(req.getRating());
        existingFeedback.setComment(req.getComment());

        existingFeedback.setStatus("ACTIVE");

        existingFeedback.setUpdatedAt(LocalDateTime.now());

        return feedbackRepo.save(existingFeedback);
    }

    public StisFeedback hideFeedback(Integer id) {
        StisFeedback existingFeedback = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá với ID: " + id));

        existingFeedback.setStatus("HIDDEN");
        existingFeedback.setUpdatedAt(LocalDateTime.now());

        return feedbackRepo.save(existingFeedback);
    }

    public double getAvgRating(Integer serviceId) {
        List<StisFeedback> feedbacks = feedbackRepo.findByStisService_ServiceId(serviceId);
        if (feedbacks.isEmpty())
            return 0;
        return feedbacks.stream().mapToInt(StisFeedback::getRating).average().orElse(0);
    }

    public double getTotalAvgRating() {
        List<StisFeedback> allFeedbacks = feedbackRepo.findAll();
        if (allFeedbacks.isEmpty())
            return 0;
        return allFeedbacks.stream().mapToInt(StisFeedback::getRating).average().orElse(0);
    }

    public void deleteFeedback(Integer feedbackId) {
        feedbackRepo.deleteById(feedbackId);
    }

    public Page<StisFeedbackResponse> getAllActiveFeedback(int page, int size, Integer serviceId, Integer rating) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        Page<StisFeedback> feedbackPage;

        if (serviceId != null && rating != null) {

            feedbackPage = feedbackRepo.findByStisService_ServiceIdAndRatingAndStatus(serviceId, rating, "ACTIVE",
                    pageable);
        } else if (serviceId != null) {

            feedbackPage = feedbackRepo.findByStisService_ServiceIdAndStatus(serviceId, "ACTIVE", pageable);
        } else if (rating != null) {

            feedbackPage = feedbackRepo.findByRatingAndStatus(rating, "ACTIVE", pageable);
        } else {

            feedbackPage = feedbackRepo.findByStatus("ACTIVE", pageable);
        }

        return feedbackPage.map(this::mapToResponse);
    }

    public RatingStatisticsResponse getRatingStatistics() {
        Long totalRatings = feedbackRepo.countActiveRatings();
        Double averageRating = feedbackRepo.getAverageRating();

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