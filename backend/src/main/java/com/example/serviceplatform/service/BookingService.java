package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.BookingRequest;
import com.example.serviceplatform.dto.BookingResponse;
import com.example.serviceplatform.entity.*;
import com.example.serviceplatform.exception.ApiException;
import com.example.serviceplatform.exception.ResourceNotFoundException;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.ServiceItemRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new ApiException("Only customers can book services", HttpStatus.FORBIDDEN);
        }

        ServiceItem serviceItem = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", request.getServiceId()));

        Booking booking = Booking.builder()
                .customer(customer)
                .service(serviceItem)
                .status(BookingStatus.PENDING)
                .serviceDate(request.getServiceDate())
                .paid(false)
                .build();

        booking = bookingRepository.save(booking);

        notificationService.sendNotification(
            serviceItem.getProvider().getId(),
            "New booking request from " + customer.getName() + " for " + serviceItem.getName()
        );

        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsForCustomer(String userEmail) {
        User customer = userRepository.findByEmail(userEmail).orElseThrow();
        return bookingRepository.findByCustomerId(customer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsForProvider(String userEmail) {
        User provider = userRepository.findByEmail(userEmail).orElseThrow();
        return bookingRepository.getProviderBookings(provider.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        User user = userRepository.findByEmail(userEmail).orElseThrow();

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isProvider = booking.getService().getProvider().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCustomer && !isProvider && !isAdmin) {
            throw new ApiException("You do not have permission to update this booking", HttpStatus.FORBIDDEN);
        }

        if (isCustomer && (newStatus != BookingStatus.CANCELLED && newStatus != BookingStatus.COMPLETED)) {
            throw new ApiException("Customers can only cancel or complete bookings", HttpStatus.BAD_REQUEST);
        }

        if (isProvider && (newStatus == BookingStatus.CANCELLED)) {
             throw new ApiException("Providers cannot cancel bookings, they can reject them", HttpStatus.BAD_REQUEST);
        }

        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);

        notificationService.sendNotification(
            booking.getCustomer().getId(),
            "Your booking for " + booking.getService().getName() + " is now " + newStatus
        );

        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .serviceId(booking.getService().getId())
                .serviceName(booking.getService().getName())
                .status(booking.getStatus())
                .serviceDate(booking.getServiceDate())
                .paid(booking.getPaid())
                .amount(booking.getService().getPrice())
                .build();
    }
}
