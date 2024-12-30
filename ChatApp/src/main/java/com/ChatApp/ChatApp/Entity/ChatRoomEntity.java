package com.ChatApp.ChatApp.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "chat-room-app")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomEntity {
	
	@Id
	private ObjectId id;
	
	private String roomId;
	
	private List<MessageEntity> message = new ArrayList<>();

	@Override
	public boolean equals(Object o) {
	    if (this == o) return true;
	    if (o == null || getClass() != o.getClass()) return false;
	    ChatRoomEntity that = (ChatRoomEntity) o;
	    return Objects.equals(roomId, that.roomId);
	}

	@Override
	public int hashCode() {
	    return Objects.hash(roomId);
	}

}
