package com.stillum.publisher.repository;

import com.stillum.publisher.entity.Publication;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

@ApplicationScoped
public class PublicationRepository implements PanacheRepositoryBase<Publication, UUID> {
}

