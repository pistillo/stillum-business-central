package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.ReviewStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
public class Review extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "version_id", nullable = false, columnDefinition = "UUID")
    public UUID versionId;

    @Column(name = "reviewer_id", columnDefinition = "UUID")
    public UUID reviewerId;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public ReviewStatus status;

    @Column(columnDefinition = "TEXT")
    public String comment;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ReviewStatus.PENDING;
        }
    }
}
