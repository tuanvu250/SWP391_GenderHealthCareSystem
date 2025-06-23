package GenderHealthCareSystem.payment;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PayPalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public APIContext apiContext() throws PayPalRESTException {
        Map<String, String> config = new HashMap<>();
        config.put("mode", mode); // "sandbox" hoặc "live"

        OAuthTokenCredential authTokenCredential = new OAuthTokenCredential(clientId, clientSecret, config);
        APIContext context = new APIContext(authTokenCredential.getAccessToken());
        context.setConfigurationMap(config);
        return context;
    }

}