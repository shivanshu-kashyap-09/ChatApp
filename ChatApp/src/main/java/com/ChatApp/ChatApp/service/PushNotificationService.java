package com.ChatApp.ChatApp.service;

import com.ChatApp.ChatApp.Entity.PushSubscription;
import com.ChatApp.ChatApp.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Security;
import java.util.List;

@Service
public class PushNotificationService {

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    @Value("${vapid.subject}")
    private String subject;

    private final PushSubscriptionRepository repository;
    private PushService pushService;

    public PushNotificationService(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        pushService = new PushService(publicKey, privateKey, subject);
    }

    public void subscribe(PushSubscription pushSubscription) {
        // Remove existing subscription with same endpoint to avoid duplicates
        repository.deleteByEndpoint(pushSubscription.getEndpoint());
        repository.save(pushSubscription);
    }

    public void sendNotification(String userEmail, String title, String message) {
        List<PushSubscription> subscriptions = repository.findByUserEmail(userEmail);
        for (PushSubscription sub : subscriptions) {
            try {
                Subscription subscription = new Subscription(
                        sub.getEndpoint(),
                        new Subscription.Keys(sub.getP256dh(), sub.getAuth())
                );

                String payload = String.format("{\"title\":\"%s\", \"body\":\"%s\"}", title, message);
                Notification notification = new Notification(subscription, payload);
                pushService.send(notification);
            } catch (Exception e) {
                System.err.println("Error sending push notification: " + e.getMessage());
                if (e.getMessage() != null && (e.getMessage().contains("410") || e.getMessage().contains("404"))) {
                    repository.deleteByEndpoint(sub.getEndpoint());
                }
            }
        }
    }
}
