package com.ChatApp.ChatApp.Entity;

import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageEntity {

	private String id;
	
	private String sender;
	
	private String content;
	
	private LocalDateTime sendTime;
	
	private MessageEntity(String sender , String content) {
		this.sender = sender;
		this.content = content;
		this.sendTime = LocalDateTime.now();
	}
}
