package GenderHealthCareSystem.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
@Service
public class VnPayService {
    @Autowired
    private VnPayConfig config;

    public String createPaymentUrl(long amount, String orderInfo, String bookingID, String ip) throws UnsupportedEncodingException {
        String vnp_TxnRef = bookingID;//sua thanh booking id
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        Map<String, String> params = new HashMap<>();
//        params.put("vnp_BankCode", "NCB");
        params.put("vnp_Version", config.vnp_Version);
        params.put("vnp_Command", config.vnp_Command);
        params.put("vnp_TmnCode", config.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", vnp_TxnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", config.vnp_ReturnUrl);
        params.put("vnp_IpAddr", ip);
        params.put("vnp_CreateDate", vnp_CreateDate);

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String field : fieldNames) {
            String value = params.get(field);
            hashData.append(field).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
            query.append(field).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
        }

        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String secureHash = VnPayUtil.hmacSHA512(config.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return config.vnp_PayUrl + "?" + query;
    }

    public boolean validateReturnData(Map<String, String> fields, String secureHash) throws UnsupportedEncodingException {
        fields.remove("vnp_SecureHash");
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (String field : fieldNames) {
            String value = fields.get(field);
            hashData.append(field).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
        }
        hashData.setLength(hashData.length() - 1);

        String computedHash = VnPayUtil.hmacSHA512(config.vnp_HashSecret, hashData.toString());
        return computedHash.equals(secureHash);
    }
}
