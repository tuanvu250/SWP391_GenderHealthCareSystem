package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.StisResultRequest;
import GenderHealthCareSystem.dto.StisResultResponse;
import GenderHealthCareSystem.model.StisResult;
import GenderHealthCareSystem.service.StisResultService;
import GenderHealthCareSystem.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

        // API xử lý JSON request
        @PostMapping(value = "/return/{bookingId}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> returnResultJson(
                        @PathVariable Integer bookingId,
                        @RequestBody StisResultRequest req) {
                try {
                        StisResult result = stisResultService.createResult(bookingId, req);
                        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Tạo kết quả xét nghiệm thành công",
                                        stisResultService.mapToResponse(result), null));
                } catch (IllegalStateException | IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null,
                                                        "BAD_REQUEST"));
                }
        }

        // API xử lý form-data request
        @PostMapping(value = "/return/{bookingId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> returnResultFormData(
                        @PathVariable Integer bookingId,
                        @RequestParam("testCode") String testCode,
                        @RequestParam("resultValue") String resultValue,
                        @RequestParam("referenceRange") String referenceRange,
                        @RequestParam(value = "resultText", required = false) String resultText,
                        @RequestParam(value = "note", required = false) String note,
                        @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile) {
                try {
                        // Tạo StisResultRequest từ form data
                        StisResultRequest req = new StisResultRequest();
                        req.setTestCode(testCode);
                        req.setResultValue(resultValue);
                        req.setReferenceRange(referenceRange);
                        req.setResultText(resultText);
                        req.setNote(note);
                        req.setPdfFile(pdfFile);

                        // Tạo kết quả xét nghiệm
                        StisResult result = stisResultService.createResult(bookingId, req);

                        // Upload file PDF nếu có
                        if (pdfFile != null && !pdfFile.isEmpty()) {
                                String contentType = pdfFile.getContentType();
                                if (contentType == null || !contentType.equals("application/pdf")) {
                                        return ResponseEntity.badRequest()
                                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST,
                                                                        "Chỉ chấp nhận file PDF", null,
                                                                        "INVALID_FILE_TYPE"));
                                }

                                try {
                                        String pdfUrl = cloudinaryService.uploadFile(pdfFile);
                                        result = stisResultService.updateResultPdf(result.getResultId(), pdfUrl);
                                } catch (IOException e) {
                                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                        .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR,
                                                                        "Lỗi khi upload file: " + e.getMessage(), null,
                                                                        "UPLOAD_ERROR"));
                                }
                        }

                        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Tạo kết quả xét nghiệm thành công",
                                        stisResultService.mapToResponse(result), null));
                } catch (IllegalStateException | IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null,
                                                        "BAD_REQUEST"));
                }
        }

        // API cập nhật kết quả (cho phép cập nhật từng trường riêng lẻ)
        @PutMapping(value = "/{resultId}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> updateResult(
                        @PathVariable Integer resultId,
                        @RequestBody StisResultRequest req) {
                try {
                        StisResult result = stisResultService.updateResult(resultId, req);
                        return ResponseEntity.ok(new ApiResponse<>(
                                        HttpStatus.OK, "Cập nhật kết quả xét nghiệm thành công",
                                        stisResultService.mapToResponse(result), null));
                } catch (IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null,
                                                        "BAD_REQUEST"));
                }
        }

        // API xóa kết quả
        @DeleteMapping("/{resultId}")
        public ResponseEntity<?> deleteResult(@PathVariable Integer resultId) {
                try {
                        stisResultService.deleteResult(resultId);
                        return ResponseEntity.ok(new ApiResponse<>(
                                        HttpStatus.OK, "Xóa kết quả xét nghiệm thành công", null, null));
                } catch (IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null,
                                                        "BAD_REQUEST"));
                }
        }

        @GetMapping("/by-booking/{bookingId}")
        public ResponseEntity<?> getResultByBooking(@PathVariable Integer bookingId) {
                return stisResultService.getResultByBookingId(bookingId)
                                .<ResponseEntity<?>>map(ResponseEntity::ok)
                                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                                                .body("Không tìm thấy kết quả cho booking này!"));
        }

        @GetMapping("/all")
        public ResponseEntity<PageResponse<StisResultResponse>> getAllResults(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "resultId") String sortBy,
                        @RequestParam(defaultValue = "desc") String direction) {

                Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                                ? Sort.Direction.ASC
                                : Sort.Direction.DESC;

                Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
                PageResponse<StisResultResponse> results = stisResultService.getAllResults(pageable);

                return ResponseEntity.ok(results);
        }

        private ResponseEntity<ApiResponse<StisResultResponse>> createErrorResponse(
                        HttpStatus status, String message, String errorCode) {
                ApiResponse<StisResultResponse> response = new ApiResponse<>(status, message, null, errorCode);
                return ResponseEntity.status(status).body(response);
        }
}
