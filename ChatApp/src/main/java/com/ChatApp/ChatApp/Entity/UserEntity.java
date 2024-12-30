package com.ChatApp.ChatApp.Entity;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Document(collection = "User")
@Getter
 @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {	
	@Id
	private ObjectId id;
	
	private String userName;

	private String password;
	
	private String email;
	
	private String otp;
	
	private boolean verified;
	
	@DBRef
	private List<ChatRoomEntity> chatRoom = new ArrayList<>();
	
}
