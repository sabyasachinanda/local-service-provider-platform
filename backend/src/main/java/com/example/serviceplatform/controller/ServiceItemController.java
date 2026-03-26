package com.example.serviceplatform.controller;

import com.example.serviceplatform.dto.ApiResponse;
import com.example.serviceplatform.dto.ServiceItemRequest;
import com.example.serviceplatform.dto.ServiceItemResponse;
import com.example.serviceplatform.service.ServiceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceItemController {
    private final ServiceItemService serviceItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ServiceItemResponse>>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Double rating,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(serviceItemService.searchAdvanced(category, minPrice, maxPrice, rating, name, pageable), "Services fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceItemResponse>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(serviceItemService.getServiceById(id), "Service fetched"));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<ServiceItemResponse>>> getServicesByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(ApiResponse.success(serviceItemService.getServicesByProvider(providerId), "Provider services fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceItemResponse>> createService(
            @Valid @RequestBody ServiceItemRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                serviceItemService.createService(request, authentication.getName()),
                "Service created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long id,
            Authentication authentication) {
        serviceItemService.deleteService(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Service deleted successfully"));
    }
}
