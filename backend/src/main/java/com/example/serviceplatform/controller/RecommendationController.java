package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.ApiResponse;
import com.example.serviceplatform.dto.ServiceItemResponse;
import com.example.serviceplatform.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    
    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceItemResponse>>> getRecommendations(Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(ApiResponse.success(
                recommendationService.getRecommendations(email), 
                "Recommendations fetched"
        ));
    }
}
