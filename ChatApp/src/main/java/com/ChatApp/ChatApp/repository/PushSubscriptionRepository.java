package com.ChatApp.ChatApp.repository;

import com.ChatApp.ChatApp.Entity.PushSubscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PushSubscriptionRepository extends MongoRepository<PushSubscription, String> {
    List<PushSubscription> findByUserEmail(String userEmail);
    void deleteByEndpoint(String endpoint);
}
