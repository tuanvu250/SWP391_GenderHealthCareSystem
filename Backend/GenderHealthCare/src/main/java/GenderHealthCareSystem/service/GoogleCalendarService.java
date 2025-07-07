package GenderHealthCareSystem.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GoogleCalendarService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleCalendarService.class);
    private static final String APPLICATION_NAME = "GenderHealthCareSystem";
    private static final String CREDENTIALS_FILE_PATH = "src/main/resources/google-credentials.json";

    public String createGoogleMeetLink(String summary, LocalDateTime startTime, LocalDateTime endTime) throws IOException {
        logger.info("Starting to create Google Meet link for event: {}", summary);

        // Load credentials from the file
        InputStream credentialsStream = new FileInputStream(CREDENTIALS_FILE_PATH);

        GoogleCredentials credentials;
        try {
            credentials = ServiceAccountCredentials.fromStream(credentialsStream)
                    .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar"));
            logger.info("Successfully loaded Google credentials");
        } catch (IOException e) {
            logger.error("Failed to load Google credentials", e);
            throw e;
        }

        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        Calendar service;
        try {
            service = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    jsonFactory,
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
            logger.info("Google Calendar service initialized successfully");
        } catch (GeneralSecurityException e) {
            logger.error("Failed to initialize Google Calendar service", e);
            throw new IOException("Failed to initialize Google Calendar service", e);
        }

        Event event = new Event()
                .setSummary(summary)
                .setDescription("Consultation Booking");

        EventDateTime start = new EventDateTime()
                .setDateTime(new DateTime(startTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().toString());
        event.setStart(start);

        EventDateTime end = new EventDateTime()
                .setDateTime(new DateTime(endTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().toString());
        event.setEnd(end);

        // Add conference data for Google Meet
        ConferenceData conferenceData = new ConferenceData()
                .setCreateRequest(new CreateConferenceRequest()
                        .setRequestId(UUID.randomUUID().toString()));
        event.setConferenceData(conferenceData);

        try {
            event = service.events().insert("primary", event)
                    .setConferenceDataVersion(1) // Required to enable Google Meet
                    .execute();
            logger.info("Event created successfully with ID: {}", event.getId());
            logger.info("Full event details: {}", event); // Log full event details
        } catch (IOException e) {
            logger.error("Failed to create event in Google Calendar", e);
            throw e;
        }

        // Log thêm thông tin về yêu cầu conferenceData
        logger.info("Requesting conference data creation with requestId: {}", conferenceData.getCreateRequest().getRequestId());

        // Log phản hồi từ API nếu conferenceData không được tạo
        if (event.getConferenceData() == null) {
            logger.warn("Conference data creation failed. No conference data returned by API.");
        } else {
            logger.info("Conference data created successfully: {}", event.getConferenceData());
        }

        String meetLink = event.getHangoutLink();
        if (meetLink == null || meetLink.isEmpty()) {
            logger.warn("Google Meet link is not available for the event");
        } else {
            logger.info("Google Meet link created successfully: {}", meetLink);
        }

        return meetLink;
    }
}
