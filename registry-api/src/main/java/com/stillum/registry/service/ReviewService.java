package com.stillum.registry.service;

import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.Review;
import com.stillum.registry.entity.enums.ReviewStatus;
import com.stillum.registry.entity.enums.VersionState;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class ReviewService {

    @Transactional
    public Review assignReviewer(UUID versionId, UUID reviewerId) {
        ArtifactVersion version = ArtifactVersion.findById(versionId);
        if (version == null || version.state != VersionState.REVIEW) {
            return null;
        }
        
        Review review = new Review();
        review.versionId = versionId;
        review.reviewerId = reviewerId;
        review.status = ReviewStatus.PENDING;
        review.createdAt = LocalDateTime.now();
        review.persist();
        return review;
    }

    @Transactional
    public Review approveReview(UUID reviewId, String comment) {
        Review review = Review.findById(reviewId);
        if (review == null) {
            return null;
        }
        
        review.status = ReviewStatus.APPROVED;
        review.comment = comment;
        review.persist();
        
        ArtifactVersion version = ArtifactVersion.findById(review.versionId);
        if (version != null) {
            version.state = VersionState.APPROVED;
            version.persist();
        }
        
        return review;
    }

    @Transactional
    public Review rejectReview(UUID reviewId, String comment) {
        Review review = Review.findById(reviewId);
        if (review == null) {
            return null;
        }
        
        review.status = ReviewStatus.REJECTED;
        review.comment = comment;
        review.persist();
        
        ArtifactVersion version = ArtifactVersion.findById(review.versionId);
        if (version != null) {
            version.state = VersionState.DRAFT;
            version.persist();
        }
        
        return review;
    }

    public Review getReview(UUID reviewId) {
        return Review.findById(reviewId);
    }
}
