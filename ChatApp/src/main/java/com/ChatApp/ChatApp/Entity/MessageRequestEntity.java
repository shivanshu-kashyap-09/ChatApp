package com.ChatApp.ChatApp.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequestEntity {
	
	 private String content;
	    private String sender;
	    private String roomId;

}
