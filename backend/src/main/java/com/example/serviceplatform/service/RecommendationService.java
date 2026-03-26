package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.ServiceItemResponse;
import com.example.serviceplatform.entity.Booking;
import com.example.serviceplatform.entity.ServiceItem;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.ServiceItemRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final ServiceItemRepository serviceItemRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public List<ServiceItemResponse> getRecommendations(String email) {
        List<ServiceItem> recommendedServices = new ArrayList<>();

        if (email != null && !email.isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                List<Booking> userBookings = bookingRepository.findByCustomerId(user.getId());
                
                if (!userBookings.isEmpty()) {
                    Set<String> categories = userBookings.stream()
                            .map(b -> b.getService().getCategory())
                            .collect(Collectors.toSet());

                    categories.forEach(category -> {
                        serviceItemRepository.findByCategory(category, org.springframework.data.domain.Pageable.unpaged())
                                .getContent().forEach(service -> {
                                    boolean alreadyBooked = userBookings.stream()
                                        .anyMatch(b -> b.getService().getId().equals(service.getId()));
                                    if (!alreadyBooked && !recommendedServices.contains(service)) {
                                        recommendedServices.add(service);
                                    }
                                });
                    });
                }
            }
        }
        
        // Fill short recommendations array with most popular services universally
        if (recommendedServices.size() < 5) {
            List<ServiceItem> allServices = serviceItemRepository.findAll();
            allServices.sort((s1, s2) -> {
                int count1 = bookingRepository.findByServiceId(s1.getId()).size();
                int count2 = bookingRepository.findByServiceId(s2.getId()).size();
                return Integer.compare(count2, count1);
            });
            
            for (ServiceItem s : allServices) {
                if (!recommendedServices.contains(s)) {
                    recommendedServices.add(s);
                }
                if (recommendedServices.size() >= 5) break;
            }
        }

        return recommendedServices.stream()
                .limit(5)
                .map(s -> ServiceItemResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .category(s.getCategory())
                        .price(s.getPrice())
                        .providerId(s.getProvider().getId())
                        .providerName(s.getProvider().getName())
                        .build())
                .collect(Collectors.toList());
    }
}
