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
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StisBookingService {

    private final StisBookingRepository stisBookingRepository;
    private final UserRepository userRepository;
    private final StisServiceRepository stisServiceRepository;
    //
    // public List<StisBookingResponse> getAllBookings() {
    //
    // return
    // stisBookingRepository.findAll().stream().map(this::mapToResponse).toList();
    // }

    public Page<StisBookingResponse> findStisBooking(String name, Integer serviceID, StisBookingStatus status,
            LocalDateTime startDateTime, LocalDateTime endDateTime, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<StisBooking> stisBooking;
        System.out.println("Name: " + name + ", ServiceID: " + serviceID + ", Status: " + status);
        stisBooking = this.stisBookingRepository.findByCustomerNameAndServiceIdAndStatus(name, serviceID, status,
                startDateTime, endDateTime, pageable);
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
        if (this.stisBookingRepository.countByUserIdAndBookingDate(booking.getCustomerId(),
                booking.getBookingDate().atStartOfDay(), booking.getBookingDate().atTime(LocalTime.MAX)) > 0) {
            throw new RuntimeException("Bạn đã có lịch hẹn trong ngày này. Vui lòng chọn ngày khác.");
        }
        if (this.isBookingLimitExceeded(booking.getServiceId(),
                LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime()))) {
            throw new RuntimeException(
                    "Số lượng đặt lịch đã vượt quá giới hạn cho dịch vụ này trong khoảng thời gian đã chọn.");
        }

        stisBooking.setCustomer(this.userRepository.findById(booking.getCustomerId()).get());
        stisBooking.setStisService(this.stisServiceRepository.findById(booking.getServiceId()).get());
        LocalDateTime bookingDate = LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime());
        stisBooking.setBookingDate(bookingDate);
        stisBooking.setStatus(StisBookingStatus.CONFIRMED);
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
        StisBooking booking = stisBookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setStatus(StisBookingStatus.CANCELLED);
        stisBookingRepository.save(booking);
    }

    public void markBookingAsNoShow(Integer id) {
        StisBooking booking = stisBookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setStatus(StisBookingStatus.NO_SHOW);
        stisBookingRepository.save(booking);
    }

    public void markBookingAsDenied(Integer id) {
        StisBooking booking = stisBookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setStatus(StisBookingStatus.DENIED);
        stisBookingRepository.save(booking);
    }

    public void markBookingPaymentStatusAsCompleted(Integer id) {
        Optional<StisBooking> bookingOptional = stisBookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            StisBooking booking = bookingOptional.get();
            booking.setPaymentStatus("PAID");
            stisBookingRepository.save(booking);
        }
    }

    // public List<StisBookingResponse> getBookingHistoryByCustomer(Integer
    // customerId) {
    // // Fetch booking history for a specific customer from the repository
    // return
    // stisBookingRepository.findByCustomer_UserId(customerId).stream().map(this::mapToResponse).toList();
    // }
    public Page<StisBookingResponse> GetHistory(int ID, Integer serviceID, StisBookingStatus status,
            LocalDateTime startDateTime, LocalDateTime endDateTime, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<StisBooking> stisBooking;
        stisBooking = this.stisBookingRepository.getHistory(ID, serviceID, startDateTime, endDateTime, status,
                pageable);
        return stisBooking.map(this::mapToResponse);
    }

    public boolean isBookingLimitExceeded(Integer serviceId, LocalDateTime bookingDateTime) {
        Integer limit = this.stisServiceRepository.findById(serviceId).get().getMaxBookingsPerSlot();
        LocalDateTime startOfSlot = bookingDateTime.withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfSlot = startOfSlot.plusHours(1);
        long bookingCount = stisBookingRepository.countBookingsInTimeSlot(serviceId, startOfSlot, endOfSlot);
        System.out.println("Booking Count: " + bookingCount + ", Limit: " + limit);
        return bookingCount >= limit;
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
