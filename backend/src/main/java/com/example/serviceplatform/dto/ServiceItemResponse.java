package com.example.serviceplatform.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ServiceItemResponse {
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Long providerId;
    private String providerName;
}
