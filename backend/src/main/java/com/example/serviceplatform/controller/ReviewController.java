package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.ApiResponse;
import com.example.serviceplatform.dto.ReviewRequest;
import com.example.serviceplatform.dto.ReviewResponse;
import com.example.serviceplatform.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @Valid @RequestBody ReviewRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.addReview(request, authentication.getName()),
                "Review added"));
    }

    @GetMapping("/services/{serviceId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getServiceReviews(@PathVariable Long serviceId) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.getReviewsForService(serviceId),
                "Reviews fetched"));
    }
}
