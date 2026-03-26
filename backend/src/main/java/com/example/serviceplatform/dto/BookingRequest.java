package com.example.serviceplatform.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Service Date is required")
    @FutureOrPresent(message = "Service date must be today or in the future")
    private LocalDate serviceDate;
}
