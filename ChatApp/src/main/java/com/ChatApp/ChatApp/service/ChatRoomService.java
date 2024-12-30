package com.ChatApp.ChatApp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ChatApp.ChatApp.Entity.ChatRoomEntity;
import com.ChatApp.ChatApp.Entity.MessageEntity;
import com.ChatApp.ChatApp.Entity.UserEntity;
import com.ChatApp.ChatApp.repository.ChatRoomRepository;
// import com.ChatApp.ChatApp.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatRoomService {

	@Autowired
	private ChatRoomRepository chatRoomRepository;
	
	@Autowired
	private UserService userService;
	
	public String createRoom(ChatRoomEntity room, String userName) {
		try {
			UserEntity user = userService.findByUserName(userName);
				if(chatRoomRepository.findByRoomId(room.getRoomId()) != null) {
					return "Room already Exist!!";
				}
				ChatRoomEntity saved = chatRoomRepository.save(room);
				user.getChatRoom().add(saved);
				userService.saveRoom(user);
		}catch(Exception e) {
			log.error("Error occured in create Room : ",e);
		}
		return "Room created Successfully.";
	}

	public String getRoom(ChatRoomEntity room, String userName) {
	    try {
	        UserEntity user = userService.findByUserName(userName);
	        ChatRoomEntity saved = chatRoomRepository.findByRoomId(room.getRoomId());

	        if (saved != null) {
	            // Check if user already has the room
	            if (user.getChatRoom().stream().anyMatch(r -> r.getRoomId().equals(saved.getRoomId()))) {
	                return "Exist";
	            } else {
	                user.getChatRoom().add(saved);
	                userService.saveRoom(user);
	                return room.getRoomId();
	            }
	        }
	    } catch (Exception e) {
	        log.error("Error occurred in getRoom: ", e);
	    }
	    return "Empty";
	}


	public List<?> getMessage(String roomId) {
		try {
			ChatRoomEntity room = chatRoomRepository.findByRoomId(roomId);
			if(room != null) {
				List<MessageEntity> msg = room.getMessage();
				return msg;
			}
		}catch(Exception e) {
			log.error("Error occured in get message : ",e);
		}
		return null;
	}
	
	public List<?> getRoomList(String email) {
		try {
			UserEntity user = userService.getByEmail(email);
			List<?> roomList = user.getChatRoom();
			if(roomList != null) {
				return roomList;
			}
		}catch(Exception e) {
			log.error("Error occured in roomlist : ",e);
		}
		return null;
	}
	
	public boolean removeRoom(String userName, String roomId) {
	    try {
	        UserEntity user = userService.findByUserName(userName);
	        ChatRoomEntity existRoom = chatRoomRepository.findByRoomId(roomId);
	        
	        if (user != null && existRoom != null && user.getChatRoom() != null) {
	            boolean isRemoved = user.getChatRoom().removeIf(
	                room -> room.getRoomId().equals(existRoom.getRoomId())
	            );
	            
	            if (isRemoved) {
	                userService.saveRoom(user);
	                return true;
	            }
	        }
	    } catch (Exception e) {
	        log.error("Error occurred in remove room: ", e);
	    }
	    return false;
	}

}





