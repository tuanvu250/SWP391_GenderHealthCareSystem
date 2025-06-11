package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisBookingRequest;
import GenderHealthCareSystem.dto.StisBookingResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.StisService;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisServiceRepository;
import GenderHealthCareSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StisBookingService {


    private final StisBookingRepository stisBookingRepository;
    private final UserRepository userRepository;
    private final StisServiceRepository stisServiceRepository;

    public List<StisBookingResponse> getAllBookings() {
        return stisBookingRepository.findAll().stream().map(this::mapToResponse).toList();
    }


    public Optional<StisBookingResponse> getBookingById(Integer id) {
        return stisBookingRepository.findById(id).stream().map(this::mapToResponse).findFirst();
    }

    public StisBooking createBooking(StisBookingRequest booking) {
        StisBooking stisBooking = new StisBooking();
        stisBooking.setCustomer(this.userRepository.findById(booking.getCustomerId()).get());
        stisBooking.setStisService(this.stisServiceRepository.findById(booking.getServiceId()).get());
        stisBooking.setBookingDate(booking.getBookingDate());
        stisBooking.setStatus("Pending");
        stisBooking.setPaymentStatus("Chưa thanh toán");
        stisBooking.setPaymentMethod(booking.getPaymentMethod());
        stisBooking.setNote(booking.getNote());
        stisBooking.setCreatedAt(LocalDateTime.now());
        stisBooking.setUpdatedAt(LocalDateTime.now());

        return  stisBookingRepository.save(stisBooking);
    }

    public StisBooking updateBooking(StisBookingRequest newBooking, Integer id) {
        StisBooking stisBooking = this.stisBookingRepository.findById(id).get();
        if (newBooking.getBookingDate() != null) {
            stisBooking.setBookingDate(newBooking.getBookingDate());
        }
        stisBooking.setPaymentMethod(newBooking.getPaymentMethod());
        stisBooking.setNote(newBooking.getNote());

        return stisBookingRepository.save(stisBooking);
    }

    public void deleteBooking(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus("Deleted");
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsDone(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus("Done");
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsConfirmed(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus("Confirmed");
            stisBookingRepository.save(booking);
        }
    }

    public void markBookingAsCancelled(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setStatus("Cancelled");
            stisBookingRepository.save(booking);
        }
    }

    public List<StisBookingResponse> getBookingHistoryByCustomer(Integer customerId) {
        // Fetch booking history for a specific customer from the repository
        return stisBookingRepository.findByCustomer_UserId(customerId).stream().map(this::mapToResponse).toList();
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
        response.setBookingDate(booking.getBookingDate());
        response.setStatus(booking.getStatus());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setPaymentMethod(booking.getPaymentMethod());
        response.setNote(booking.getNote());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        return response;
    }

}




