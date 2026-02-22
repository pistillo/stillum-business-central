package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.TaskStatus;
import com.stillum.registry.entity.enums.TaskType;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "instance_id", nullable = false, columnDefinition = "UUID")
    public UUID instanceId;

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    public UUID tenantId;

    @Column(nullable = false, length = 255)
    public String name;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public TaskType type;

    @Column(name = "assignee_id", columnDefinition = "UUID")
    public UUID assigneeId;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public TaskStatus status;

    @Column(name = "due_date", columnDefinition = "TIMESTAMP")
    public LocalDateTime dueDate;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    public LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = TaskStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
