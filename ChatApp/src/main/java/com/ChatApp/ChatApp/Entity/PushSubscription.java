package com.ChatApp.ChatApp.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "push_subscriptions")
public class PushSubscription {
    @Id
    private String id;
    private String userEmail;
    private String endpoint;
    private String p256dh;
    private String auth;
}
