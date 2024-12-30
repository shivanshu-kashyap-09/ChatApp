package com.ChatApp.ChatApp.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;

import com.ChatApp.ChatApp.Entity.UserEntity;
import com.ChatApp.ChatApp.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	   @Autowired
	    private JavaMailSender javaMailSender;
	
	 private static final int OTP_VALIDATION = 5;
	
	private ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>(); 
    private ConcurrentHashMap<String, LocalDateTime> otpTimestampStorage = new ConcurrentHashMap<>(); 
	
	public boolean signup(UserEntity user) {
		try {
			 String email = user.getEmail(); 
		        if(email != null){
		            user.setVerified(true);
		            if (user != null) { 
		                userRepository.save(user);
		        	    return true;
		           }
		        }
		}catch(Exception e) {
			log.error("Error occured in signup : ",e);
		}
		return false;
	}
	
	public UserEntity login(String email , String password) {
		try {
			UserEntity userEmail = userRepository.getByEmail(email);
			
			if(email != null) {		
				String userPassword = userEmail.getPassword();
				if(password != userPassword) {
					return userEmail;
				}
			}
		}catch(Exception e) {
			log.error("Error oCcured in login : ",e);
		}
		return null;
	}

	public void generateAndSendOTP(String email) throws MessagingException {
        if (email != null) {
            String emailOtp = generateOtp();
            otpStorage.put(email, emailOtp);
            otpTimestampStorage.put(email, LocalDateTime.now());
            sendEmail(email, "ChatApp", "Your ChatApp verification OTP is: " + emailOtp);
        }
    }
	
	private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
	
	private void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        javaMailSender.send(message);
    }
	
	public boolean verifyAndSave(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        LocalDateTime otpGeneratedTime = otpTimestampStorage.get(email);

        if (storedOtp != null && storedOtp.equals(otp) && otpGeneratedTime != null &&
                otpGeneratedTime.isAfter(LocalDateTime.now().minusMinutes(OTP_VALIDATION))) {
                otpStorage.remove(email);
                otpTimestampStorage.remove(email);
                return true;
            }
        return false;
    }

	public void saveRoom(UserEntity user) {
		userRepository.save(user);	
	}
	
	public UserEntity findByUserName(String userName) {
		return userRepository.findByUserName(userName);
	}
	
	public UserEntity getByEmail(String email) {
		return userRepository.getByEmail(email);
	}
}
