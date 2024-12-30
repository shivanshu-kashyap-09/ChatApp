package com.ChatApp.ChatApp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ChatApp.ChatApp.Entity.ChatRoomEntity;
import com.ChatApp.ChatApp.Entity.MessageEntity;
import com.ChatApp.ChatApp.Entity.MessageRequestEntity;
import com.ChatApp.ChatApp.repository.ChatRoomRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
//    @Autowired
//    private MessageEntity messageEntity;

    public MessageEntity sendMessage(String roomId, MessageRequestEntity request) {
        try {
            ChatRoomEntity room = chatRoomRepository.findByRoomId(roomId);
            if (room == null) {
                throw new RuntimeException("Room not found!");
            }
            
            MessageEntity messageEntity = new MessageEntity();
            messageEntity.setSender(request.getSender());
            messageEntity.setContent(request.getContent());
            messageEntity.setSendTime(LocalDateTime.now());
            
            if (room.getMessage() != null) {
                room.getMessage().add(messageEntity);
            } else {
                room.setMessage(new ArrayList<>());
                room.getMessage().add(messageEntity);
            }
            
            chatRoomRepository.save(room);

            return messageEntity;
        } catch (Exception e) {
            log.error("Error Occured in send message : ", e);
            return null;
        }
    }
}
