package com.ChatApp.ChatApp.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ChatApp.ChatApp.Entity.ChatRoomEntity;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoomEntity , ObjectId>{
	
	ChatRoomEntity findByRoomId(String roomId);

}
