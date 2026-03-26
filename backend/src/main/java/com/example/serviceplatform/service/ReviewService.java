package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.ReviewRequest;
import com.example.serviceplatform.dto.ReviewResponse;
import com.example.serviceplatform.entity.*;
import com.example.serviceplatform.exception.ApiException;
import com.example.serviceplatform.exception.ResourceNotFoundException;
import com.example.serviceplatform.repository.ReviewRepository;
import com.example.serviceplatform.repository.ServiceItemRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;

    public ReviewResponse addReview(ReviewRequest request, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new ApiException("Only customers can leave reviews", HttpStatus.FORBIDDEN);
        }

        ServiceItem serviceItem = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", request.getServiceId()));

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .customer(customer)
                .service(serviceItem)
                .build();

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    public List<ReviewResponse> getReviewsForService(Long serviceId) {
        return reviewRepository.findByServiceId(serviceId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .serviceId(review.getService().getId())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
