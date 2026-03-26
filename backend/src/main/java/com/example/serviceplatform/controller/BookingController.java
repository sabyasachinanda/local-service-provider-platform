package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.ApiResponse;
import com.example.serviceplatform.dto.BookingRequest;
import com.example.serviceplatform.dto.BookingResponse;
import com.example.serviceplatform.entity.BookingStatus;
import com.example.serviceplatform.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.createBooking(request, authentication.getName()),
                "Booking created"));
    }

    @GetMapping("/customer")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getCustomerBookings(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.getBookingsForCustomer(authentication.getName()),
                "Customer bookings fetched"));
    }

    @GetMapping("/provider")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getProviderBookings(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.getBookingsForProvider(authentication.getName()),
                "Provider bookings fetched"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.updateBookingStatus(id, status, authentication.getName()),
                "Booking status updated"));
    }
}
