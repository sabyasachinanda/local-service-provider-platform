package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByServiceId(Long serviceId);
    
    @Query("SELECT b FROM Booking b WHERE b.service.provider.id = :providerId")
    List<Booking> getProviderBookings(@Param("providerId") Long providerId);
}
