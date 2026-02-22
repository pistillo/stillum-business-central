package com.stillum.registry.service;

import com.stillum.registry.entity.Notification;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class NotificationService {

    @Transactional
    public Notification createNotification(UUID tenantId, UUID userId, String type, String title, 
                                           String message, String entityType, UUID entityId) {
        Notification notification = new Notification();
        notification.tenantId = tenantId;
        notification.userId = userId;
        notification.type = type;
        notification.title = title;
        notification.message = message;
        notification.entityType = entityType;
        notification.entityId = entityId;
        notification.read = false;
        notification.createdAt = LocalDateTime.now();
        notification.persist();
        return notification;
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = Notification.findById(notificationId);
        if (notification != null) {
            notification.read = true;
            notification.persist();
        }
    }

    public List<Notification> getUserNotifications(UUID userId, boolean unreadOnly, int page, int size) {
        String query = "userId = ?1";
        Object[] params = {userId};
        
        if (unreadOnly) {
            query += " and read = false";
        }
        
        return Notification.find(query + " order by createdAt desc", params)
            .page(page, size)
            .list();
    }
}
