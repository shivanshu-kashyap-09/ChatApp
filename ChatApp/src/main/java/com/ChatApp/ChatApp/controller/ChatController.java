package com.ChatApp.ChatApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ChatApp.ChatApp.Entity.MessageEntity;
import com.ChatApp.ChatApp.Entity.MessageRequestEntity;
import com.ChatApp.ChatApp.service.ChatService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public MessageEntity sendMessage(@DestinationVariable String roomId, 
    		@Payload MessageRequestEntity request) {
        try {
            return chatService.sendMessage(roomId, request);
            
        } catch (Exception e) {
            log.error("Error occurred while sending message: ", e); 
        }
        return null;
    }
}
