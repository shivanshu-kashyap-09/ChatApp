package com.ChatApp.ChatApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ChatApp.ChatApp.Entity.ChatRoomEntity;
import com.ChatApp.ChatApp.service.ChatRoomService;
import com.ChatApp.ChatApp.service.UserService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat-room")
@Slf4j
@CrossOrigin("http://localhost:5173")
public class ChatRoomController {
	
	@Autowired
	private ChatRoomService chatRoomService;
	
	@PostMapping("/create-room/{userName}")
	public ResponseEntity<String> createRoom(@RequestBody ChatRoomEntity room,
			@PathVariable String userName) {
		try {
			String isRoom = chatRoomService.createRoom(room, userName);
			if(isRoom == "Room created Successfully.") {
				return new ResponseEntity<>(isRoom , HttpStatus.OK);
			}else if(isRoom == "Room already Exist!!") {
				return new ResponseEntity<>(isRoom , HttpStatus.BAD_REQUEST);
			}
		}catch(Exception e) {
			log.error("Error occured in create room.. : ",e);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping("/join-room/{userName}")
	public ResponseEntity<?> getRoom(@RequestBody ChatRoomEntity rooms, @PathVariable String userName) {
	    log.info("Received join-room request: Room={}, UserName={}", rooms, userName);

	    try {
	        String roomId = chatRoomService.getRoom(rooms, userName);
	        System.out.println(roomId);
	        if ("Empty".equals(roomId)) {
	            return new ResponseEntity<>("Room not exist", HttpStatus.NOT_FOUND);
	        } else if ("Exist".equals(roomId)) {
	            return new ResponseEntity<>("Already exist", HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("Joined", HttpStatus.OK);
	        }
	    } catch (Exception e) {
	        log.error("Error occurred in getRoom: ", e);
	        return new ResponseEntity<>("Error occurred while processing the request", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@PostMapping("remove-room/{userName}")
	public ResponseEntity<?> removeRoom(@PathVariable String userName , 
			@RequestBody String roomId) {
		try {
			System.out.println(roomId);
			System.out.println(userName);
			boolean isRemove = chatRoomService.removeRoom(userName, roomId);
			if(isRemove) {
				return new ResponseEntity<>(HttpStatus.OK);
			}
		}catch(Exception e) {
			log.error("Error occured in remove room : ",e);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/message/{roomId}")
	public ResponseEntity<?> getMessage(@PathVariable String roomId) {
		try {
			List<?> msg = chatRoomService.getMessage(roomId);
			if(msg != null) {
				return new ResponseEntity<>(msg,HttpStatus.OK);
			}
		}catch(Exception e) {
			log.error("Error occured in get msg.. : ",e);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/room-list/{email}")
    public ResponseEntity<?> roomList(@PathVariable String email) {
		try {
			List<?> list = chatRoomService.getRoomList(email);
	    	if(list != null) {
	    		return new ResponseEntity<>(list,HttpStatus.OK);
	    	}
		}catch(Exception e) {
			log.error("Error occured in room list: ",e);
		}
    	return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
