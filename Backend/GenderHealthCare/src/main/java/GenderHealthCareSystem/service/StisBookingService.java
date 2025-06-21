package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisBookingRequest;
import GenderHealthCareSystem.dto.StisBookingResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisServiceRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StisBookingService {


    private final StisBookingRepository stisBookingRepository;
    private final UserRepository userRepository;
    private final StisServiceRepository stisServiceRepository;
//
//    public List<StisBookingResponse> getAllBookings() {
//
//        return stisBookingRepository.findAll().stream().map(this::mapToResponse).toList();
//    }

    public Page<StisBookingResponse> findStisBooking(String name, Integer serviceID, StisBookingStatus status, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<StisBooking> stisBooking;
        System.out.println("Name: " + name + ", ServiceID: " + serviceID + ", Status: " + status);
        stisBooking = this.stisBookingRepository.findByCustomerNameAndServiceIdAndStatus(name, serviceID, status, pageable);
        return stisBooking.map(this::mapToResponse);
    }

    public Optional<StisBookingResponse> getBookingById(Integer id) {
        return stisBookingRepository.findById(id).stream().map(this::mapToResponse).findFirst();
    }
    public Optional<StisBooking> getBookingByIdNotForResponse(Integer id) {
        return stisBookingRepository.findById(id);
    }


    public StisBooking createBooking(StisBookingRequest booking) {
        StisBooking stisBooking = new StisBooking();
        stisBooking.setCustomer(this.userRepository.findById(booking.getCustomerId()).get());
        stisBooking.setStisService(this.stisServiceRepository.findById(booking.getServiceId()).get());
        LocalDateTime bookingDate = LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime());
        stisBooking.setBookingDate(bookingDate);
        stisBooking.setStatus(StisBookingStatus.PENDING);
        stisBooking.setPaymentStatus("UNPAID");
        stisBooking.setPaymentMethod(booking.getPaymentMethod());
        stisBooking.setNote(booking.getNote());
        stisBooking.setCreatedAt(LocalDateTime.now());
        stisBooking.setUpdatedAt(LocalDateTime.now());

        return stisBookingRepository.save(stisBooking);
    }

    public StisBooking updateBooking(StisBookingRequest newBooking, Integer id) {
        StisBooking stisBooking = this.stisBookingRepository.findById(id).get();
        if (newBooking.getBookingDate() != null && newBooking.getBookingTime() != null) {
            LocalDateTime bookingDate = LocalDateTime.of(newBooking.getBookingDate(), newBooking.getBookingTime());

            stisBooking.setBookingDate(bookingDate);
        }
        stisBooking.setPaymentMethod(newBooking.getPaymentMethod());
        stisBooking.setNote(newBooking.getNote());

        return stisBookingRepository.save(stisBooking);
    }
    public void saveBooking(StisBooking booking) {
        stisBookingRepository.save(booking);
    }

    public void deleteBooking(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus(StisBookingStatus.DELETED);
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsCompleted(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus(StisBookingStatus.COMPLETED);
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsConfirmed(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus(StisBookingStatus.CONFIRMED);
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsCancelled(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus(StisBookingStatus.CANCELLED);
            stisBookingRepository.save(booking);
        }
    }
    public void markBookingPaymentStatusAsCompleted(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setPaymentStatus("PAID");
            stisBookingRepository.save(booking);
        }
    }

//    public List<StisBookingResponse> getBookingHistoryByCustomer(Integer customerId) {
//        // Fetch booking history for a specific customer from the repository
//        return stisBookingRepository.findByCustomer_UserId(customerId).stream().map(this::mapToResponse).toList();
//    }
    public Page<StisBookingResponse> GetHistory(int ID, Integer serviceID, StisBookingStatus status, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<StisBooking> stisBooking;
        stisBooking = this.stisBookingRepository.getHistory(ID, serviceID, status, pageable);
        return stisBooking.map(this::mapToResponse);
    }


    public StisBookingResponse mapToResponse(StisBooking booking) {
        // Map properties from StisBooking to StisBookingResponse
        StisBookingResponse response = new StisBookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setCustomerId(booking.getCustomer().getUserId());
        response.setCustomerName(booking.getCustomer().getFullName());
        response.setServiceId(booking.getStisService().getServiceId());
        response.setServiceName(booking.getStisService().getServiceName());
        response.setServicePrice(booking.getStisService().getPrice());
        response.setStisInvoiceID(booking.getStisInvoice() != null ? booking.getStisInvoice().getInvoiceId() : null);
        response.setStisResultID(booking.getStisResult() != null ? booking.getStisResult().getResultId() : null);
        response.setStisFeedbackID(booking.getStisFeedback() != null ? booking.getStisFeedback().getFeedbackId() : null);
        response.setBookingDate(booking.getBookingDate().toLocalDate());
        response.setBookingTimeStart(booking.getBookingDate().toLocalTime());
        response.setBookingTimeEnd(booking.getBookingDate().toLocalTime().plusHours(1));
        response.setStatus(booking.getStatus());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setPaymentMethod(booking.getPaymentMethod());
        response.setNote(booking.getNote());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());

        return response;
    }

}




