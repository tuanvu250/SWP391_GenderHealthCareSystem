package GenderHealthCareSystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url");
    }


    public String getPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) return null;
        try {
            String[] parts = url.split("/");
            int uploadIndex = -1;
            for (int i = 0; i < parts.length; i++) {
                if ("upload".equals(parts[i])) {
                    uploadIndex = i;
                    break;
                }
            }
            if (uploadIndex == -1 || uploadIndex + 2 > parts.length) return null;
            StringBuilder publicId = new StringBuilder();
            for (int i = uploadIndex + 1; i < parts.length; i++) {
                if (i == uploadIndex + 1 && parts[i].startsWith("v")) continue;
                if (publicId.length() > 0) publicId.append("/");
                publicId.append(parts[i]);
            }
            int dot = publicId.lastIndexOf(".");
            if (dot != -1) publicId.setLength(dot);
            return publicId.toString();
        } catch (Exception e) {
            return null;
        }
    }

    // (nếu muốn) Thêm luôn hàm xóa file:
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            // Xử lý lỗi nếu cần
        }
    }
}
