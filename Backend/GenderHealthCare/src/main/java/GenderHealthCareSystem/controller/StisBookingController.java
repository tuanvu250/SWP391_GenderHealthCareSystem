package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.StisBookingRequest;
import GenderHealthCareSystem.dto.StisBookingResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.service.StisBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stis-bookings")
public class StisBookingController {

    @Autowired
    private StisBookingService stisBookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StisBookingResponse>>> getAllBookings() {
        List<StisBookingResponse> bookings = stisBookingService.getAllBookings();
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Fetched all bookings", bookings, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StisBookingResponse>> getBookingById(@PathVariable Integer id) {
        Optional<StisBookingResponse> booking = stisBookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking found", booking.get(), null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND, "Booking not found", null, "NOT_FOUND"));
        }
    }
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<StisBookingResponse>>> getBookingHistoryByCustomer(@AuthenticationPrincipal Jwt jwt) {
        // Fetch booking history for a specific customer
        List<StisBookingResponse> bookingHistory = stisBookingService.getBookingHistoryByCustomer(Integer.parseInt(jwt.getClaimAsString("userID")));
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Fetched booking history", bookingHistory, null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StisBooking>> createBooking(@RequestBody StisBookingRequest booking, @AuthenticationPrincipal Jwt jwt) {
        booking.setCustomerId(Integer.parseInt(jwt.getClaimAsString("userID")));
        StisBooking createdBooking = stisBookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED, "Booking created", createdBooking, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StisBooking>> updateBooking(@PathVariable Integer id, @RequestBody StisBookingRequest booking) {
        StisBooking updatedBooking = stisBookingService.updateBooking(booking, id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking updated", updatedBooking, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Integer id) {
        stisBookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking deleted", null, null));
    }

    @PutMapping("/{id}/mark-confirmed")
    public ResponseEntity<ApiResponse<Void>> markBookingAsConfirmed(@PathVariable Integer id) {
        stisBookingService.markBookingAsConfirmed(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking marked as confirmed", null, null));
    }

    @PutMapping("/{id}/mark-cancelled")
    public ResponseEntity<ApiResponse<Void>> markBookingAsCancelled(@PathVariable Integer id) {
        stisBookingService.markBookingAsCancelled(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking marked as cancelled", null, null));
    }

    @PutMapping("/{id}/mark-done")
    public ResponseEntity<ApiResponse<Void>> markBookingAsDone(@PathVariable Integer id) {
        stisBookingService.markBookingAsDone(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Booking marked as done", null, null));
    }



}



