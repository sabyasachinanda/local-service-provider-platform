package com.example.serviceplatform.dto;

import com.example.serviceplatform.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long serviceId;
    private String serviceName;
    private BookingStatus status;
    private LocalDate serviceDate;
    private Boolean paid;
    private java.math.BigDecimal amount;
}
