package com.example.serviceplatform.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AnalyticsResponse {
    private long totalUsers;
    private long totalBookings;
    private BigDecimal totalRevenue;
}
