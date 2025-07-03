package GenderHealthCareSystem.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "GenderHealthCareSystem";
    private static final String CREDENTIALS_FILE_PATH = "src/main/resources/google-credentials.json";

    public String createGoogleMeetLink(String summary, LocalDateTime startTime, LocalDateTime endTime) throws IOException {
        InputStream credentialsStream = getClass().getClassLoader().getResourceAsStream("google-credentials.json");

        if (credentialsStream == null) {
            throw new FileNotFoundException("Credentials file not found in resources");
        }

        GoogleCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream)
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar"));

        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        Calendar service;
        try {
            HttpRequestInitializer requestInitializer = httpRequest -> {
                httpRequest.setInterceptor(request -> request.getHeaders().setAuthorization("Bearer " + credentials.getAccessToken()));
            };
            service = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    jsonFactory,
                    requestInitializer)
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        } catch (GeneralSecurityException e) {
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

        event = service.events().insert("primary", event).execute();

        return event.getHangoutLink();
    }
}
