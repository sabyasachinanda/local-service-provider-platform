package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.ApiResponse;
import com.example.serviceplatform.dto.PaymentRequest;
import com.example.serviceplatform.entity.Booking;
import com.example.serviceplatform.entity.Payment;
import com.example.serviceplatform.exception.ResourceNotFoundException;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.PaymentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @PostMapping("/pay")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@Valid @RequestBody PaymentRequest request) throws InterruptedException {
        // Verify booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        // Simulate payment gateway delay physically
        Thread.sleep(1000);

        // Save mock payment record natively
        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();

        payment = paymentRepository.save(payment);

        booking.setPaid(true);
        bookingRepository.save(booking);

        return ResponseEntity.ok(ApiResponse.success(payment, "Payment successfully processed via Mock Gateway"));
    }
}
