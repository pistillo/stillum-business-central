package com.stillum.registry.service;

import com.stillum.registry.entity.Task;
import com.stillum.registry.entity.enums.TaskStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TaskService {

    @Transactional
    public void completeTask(UUID taskId) {
        Task task = Task.findById(taskId);
        if (task != null) {
            task.status = TaskStatus.COMPLETED;
            task.updatedAt = LocalDateTime.now();
            task.persist();
        }
    }

    @Transactional
    public void reassignTask(UUID taskId, UUID newAssigneeId) {
        Task task = Task.findById(taskId);
        if (task != null) {
            task.assigneeId = newAssigneeId;
            task.updatedAt = LocalDateTime.now();
            task.persist();
        }
    }

    public List<Task> getUserTasks(UUID userId, int page, int size) {
        return Task.find("assigneeId = ?1 and status != ?2", userId, TaskStatus.COMPLETED)
            .page(page, size)
            .list();
    }

    public Task getTask(UUID taskId) {
        return Task.findById(taskId);
    }
}
