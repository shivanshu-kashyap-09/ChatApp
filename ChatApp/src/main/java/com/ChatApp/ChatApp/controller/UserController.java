package com.ChatApp.ChatApp.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ChatApp.ChatApp.Entity.UserEntity;
import com.ChatApp.ChatApp.service.UserService;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/user")
@CrossOrigin("http://localhost:5173")
public class UserController {
	
	@Autowired
	private UserService userService;

	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserEntity user) {
		try {
			boolean isSignup = userService.signup(user);
			if(isSignup) {
				return new ResponseEntity<>(HttpStatus.OK);
			}
		}catch(Exception e) {
			log.error("Error occure din signup : ",e);
		}
		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> user) {
	    try {
	        String email = user.get("email");
	        String password = user.get("password");
	        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
	            log.error("Email or password is missing.");
	            return new ResponseEntity<>("Email and password are required.", HttpStatus.BAD_REQUEST);
	        }
	        UserEntity isLogin = userService.login(email, password);
	        if (isLogin != null) {
	            return new ResponseEntity<>(isLogin, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("Invalid credentials.", HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        log.error("Error occurred during login: ", e);
	        return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/generate-otp")
	public ResponseEntity<?> generateOtpEmail(@RequestBody UserEntity user) {
	    try {
	        userService.generateAndSendOTP(user.getEmail());
	        return new ResponseEntity<>("OTP sent successfully.", HttpStatus.OK);
	        
	    } catch (MessagingException e) {
	        log.error("Error occurred while sending OTP: ", e);
	        return new ResponseEntity<>("Failed to send OTP. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
	    
	    } catch (Exception e) {
	        log.error("Unexpected error occurred: ", e);
	        return new ResponseEntity<>("An error occurred. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/verify")
	public ResponseEntity<?> verified(@RequestBody Map<String, String> user) {
	    try {
	        String email = user.get("email");
	        String otp = user.get("otp");
	        if (email == null || email.isEmpty() || otp == null || otp.isEmpty()) {
	            log.error("Email or OTP is missing.");
	            return new ResponseEntity<>("Email or OTP cannot be empty.", HttpStatus.BAD_REQUEST);
	        }
	        
	        boolean isVerified = userService.verifyAndSave(email, otp);
	        if (isVerified) {
	            return new ResponseEntity<>("Verified Successfully", HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("Incorrect OTP. Please try again.", HttpStatus.BAD_REQUEST);
	        }
	    } catch (Exception e) {
	        log.error("Error occurred in verification: ", e);
	        return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
}
