package com.ChatApp.ChatApp.controller;

import com.ChatApp.ChatApp.Entity.PushSubscription;
import com.ChatApp.ChatApp.service.PushNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final PushNotificationService pushNotificationService;

    public NotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody PushSubscription subscription) {
        pushNotificationService.subscribe(subscription);
        return ResponseEntity.ok("Subscribed successfully");
    }
}
