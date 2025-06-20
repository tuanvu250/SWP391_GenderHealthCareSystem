package GenderHealthCareSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("OTP for Password Reset");
        message.setText("Mã OTP của bạn là: " + otp + " OTP có hiệu lực trong 3 phút.");
        mailSender.send(message);
    }

    public void sendFertilityNotificationEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            logger.info("[DEBUG] Attempting to send email to: {}", to);
            logger.info("[DEBUG] Email subject: {}", subject);
            logger.info("[DEBUG] Email content: {}", text);
            mailSender.send(message);
            logger.info("[DEBUG] Email successfully sent to: {}", to);
        } catch (Exception e) {
            logger.error("[ERROR] Failed to send email to: {}", to, e);
        }
    }
}
