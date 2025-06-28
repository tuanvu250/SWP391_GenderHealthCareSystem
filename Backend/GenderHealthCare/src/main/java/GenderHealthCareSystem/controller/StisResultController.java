package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.StisResultRequest;
import GenderHealthCareSystem.dto.StisResultResponse;
import GenderHealthCareSystem.model.StisResult;
import GenderHealthCareSystem.service.StisResultService;
import GenderHealthCareSystem.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/stis-results")
@RequiredArgsConstructor
public class StisResultController {

    private final StisResultService stisResultService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/return/{bookingId}")
    public ResponseEntity<?> returnResult(@PathVariable Integer bookingId, @RequestBody StisResultRequest req) {

        try {
            StisResult result = stisResultService.createResult(bookingId, req);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/by-booking/{bookingId}")
    public ResponseEntity<?> getResultByBooking(@PathVariable Integer bookingId) {
        return stisResultService.getResultByBookingId(bookingId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy kết quả cho booking này!"));
    }

    @PutMapping("/upload-pdf/{resultId}")
    public ResponseEntity<ApiResponse<StisResultResponse>> uploadResultPdf(
            @PathVariable Integer resultId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "File không được để trống", "FILE_EMPTY");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Chỉ chấp nhận file PDF", "INVALID_FILE_TYPE");
        }

        try {
            String pdfUrl = cloudinaryService.uploadFile(file);
            StisResult result = stisResultService.updateResultPdf(resultId, pdfUrl);
            StisResultResponse resultResponse = stisResultService.mapToResponse(result);

            return ResponseEntity.ok(new ApiResponse<>(
                    HttpStatus.OK, "Upload file PDF thành công", resultResponse, null));
        } catch (IOException e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Lỗi khi upload file: " + e.getMessage(), "UPLOAD_ERROR");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage(), "INVALID_REQUEST");
        }
    }

    private ResponseEntity<ApiResponse<StisResultResponse>> createErrorResponse(
            HttpStatus status, String message, String errorCode) {
        ApiResponse<StisResultResponse> response = new ApiResponse<>(status, message, null, errorCode);
        return ResponseEntity.status(status).body(response);
    }
}
