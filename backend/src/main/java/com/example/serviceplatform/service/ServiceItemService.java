package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.ServiceItemRequest;
import com.example.serviceplatform.dto.ServiceItemResponse;
import com.example.serviceplatform.entity.Role;
import com.example.serviceplatform.entity.ServiceItem;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.exception.ApiException;
import com.example.serviceplatform.exception.ResourceNotFoundException;
import com.example.serviceplatform.repository.ServiceItemRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceItemService {
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;

    public ServiceItemResponse createService(ServiceItemRequest request, String userEmail) {
        User provider = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (provider.getRole() != Role.SERVICE_PROVIDER) {
            throw new ApiException("Only service providers can create services", HttpStatus.FORBIDDEN);
        }

        ServiceItem serviceItem = ServiceItem.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .provider(provider)
                .build();

        serviceItem = serviceItemRepository.save(serviceItem);
        return mapToResponse(serviceItem);
    }

    public Page<ServiceItemResponse> getAllServices(Pageable pageable) {
        return serviceItemRepository.findAll(pageable).map(this::mapToResponse);
    }
    
    public Page<ServiceItemResponse> searchAdvanced(String category, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Double rating, String name, Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<ServiceItem> spec = org.springframework.data.jpa.domain.Specification.where(
                com.example.serviceplatform.specification.ServiceItemSpecification.hasCategory(category))
                .and(com.example.serviceplatform.specification.ServiceItemSpecification.priceGreaterThanEqual(minPrice))
                .and(com.example.serviceplatform.specification.ServiceItemSpecification.priceLessThanEqual(maxPrice))
                .and(com.example.serviceplatform.specification.ServiceItemSpecification.hasAverageRatingGreaterThanEqual(rating));

        if (name != null && !name.isEmpty()) {
            spec = spec.and(com.example.serviceplatform.specification.ServiceItemSpecification.hasNameContaining(name));
        }

        return serviceItemRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    public ServiceItemResponse getServiceById(Long id) {
        ServiceItem serviceItem = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        return mapToResponse(serviceItem);
    }

    public List<ServiceItemResponse> getServicesByProvider(Long providerId) {
        return serviceItemRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteService(Long id, String userEmail) {
        ServiceItem serviceItem = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
                
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        
        if (!serviceItem.getProvider().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ApiException("You can only delete your own services", HttpStatus.FORBIDDEN);
        }
        
        serviceItemRepository.delete(serviceItem);
    }

    private ServiceItemResponse mapToResponse(ServiceItem serviceItem) {
        return ServiceItemResponse.builder()
                .id(serviceItem.getId())
                .name(serviceItem.getName())
                .category(serviceItem.getCategory())
                .price(serviceItem.getPrice())
                .providerId(serviceItem.getProvider().getId())
                .providerName(serviceItem.getProvider().getName())
                .build();
    }
}
