package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.repository.StisBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StisBookingService {

    @Autowired
    private StisBookingRepository stisBookingRepository;

    public List<StisBooking> getAllBookings() {
        return stisBookingRepository.findAll();
    }

    public Optional<StisBooking> getBookingById(Integer id) {
        return stisBookingRepository.findById(id);
    }

    public StisBooking createOrUpdateBooking(StisBooking booking) {
        return stisBookingRepository.save(booking);
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

    public List<StisBooking> getBookingHistoryByCustomer(Integer customerId) {
        // Fetch booking history for a specific customer from the repository
        return stisBookingRepository.findByCustomer_UserId(customerId);
    }
}
