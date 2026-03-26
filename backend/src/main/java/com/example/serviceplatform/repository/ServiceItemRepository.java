package com.example.serviceplatform.repository;

import com.example.serviceplatform.entity.ServiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long>, JpaSpecificationExecutor<ServiceItem> {
    Page<ServiceItem> findByCategory(String category, Pageable pageable);
    Page<ServiceItem> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<ServiceItem> findByProviderId(Long providerId);
}
