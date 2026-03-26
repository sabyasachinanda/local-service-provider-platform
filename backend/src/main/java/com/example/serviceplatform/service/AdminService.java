package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.AnalyticsResponse;
import com.example.serviceplatform.dto.UserDto;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.exception.ResourceNotFoundException;
import com.example.serviceplatform.repository.BookingRepository;
import com.example.serviceplatform.repository.PaymentRepository;
import com.example.serviceplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus("SUCCESS");

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .build();
    }

    public org.springframework.data.domain.Page<UserDto> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setStatus(!user.getStatus());
        user = userRepository.save(user);
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
