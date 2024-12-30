package com.ChatApp.ChatApp.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ChatApp.ChatApp.Entity.UserEntity;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, ObjectId> {
	
	public UserEntity getByEmail(String email);
	
	public UserEntity findByUserName(String userName);
}
