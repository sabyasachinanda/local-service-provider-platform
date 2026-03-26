package com.example.serviceplatform.specification;

import com.example.serviceplatform.entity.Review;
import com.example.serviceplatform.entity.ServiceItem;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ServiceItemSpecification {

    public static Specification<ServiceItem> hasCategory(String category) {
        return (root, query, cb) -> category == null || category.isEmpty() ? cb.conjunction() : cb.equal(root.get("category"), category);
    }

    public static Specification<ServiceItem> hasNameContaining(String name) {
        return (root, query, cb) -> name == null || name.isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ServiceItem> priceGreaterThanEqual(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<ServiceItem> priceLessThanEqual(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null ? cb.conjunction() : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<ServiceItem> hasAverageRatingGreaterThanEqual(Double rating) {
        return (root, query, cb) -> {
            if (rating == null) return cb.conjunction();
            Subquery<Double> subquery = query.subquery(Double.class);
            Root<Review> reviewRoot = subquery.from(Review.class);
            // JPA treats numeric averages as Double natively
            subquery.select(cb.avg(reviewRoot.get("rating").as(Double.class)));
            subquery.where(cb.equal(reviewRoot.get("service").get("id"), root.get("id")));
            return cb.greaterThanOrEqualTo(subquery, rating);
        };
    }
}
