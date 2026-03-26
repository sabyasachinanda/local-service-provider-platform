package com.example.serviceplatform.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private Long customerId;
    private String customerName;
    private Long serviceId;
    private LocalDateTime createdAt;
}
