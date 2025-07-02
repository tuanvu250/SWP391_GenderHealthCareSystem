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
import java.util.List;

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
                        @RequestBody List<StisResultRequest> reqs) {
                try {
                        List<StisResult> results = stisResultService.createMultipleResults(bookingId, reqs);
                        List<StisResultResponse> responseList = results.stream()
                                        .map(stisResultService::mapToResponse)
                                        .toList();
                        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Tạo kết quả xét nghiệm thành công",
                                        responseList, null));
                } catch (IllegalStateException | IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, ex.getMessage(), null,
                                                        "BAD_REQUEST"));
                }
        }

        // API upload PDF cho booking (chỉ gán vào result đầu tiên)
        @PutMapping(value = "/upload-pdf/{bookingId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> uploadPdfForBooking(
                        @PathVariable Integer bookingId,
                        @RequestParam("pdfFile") MultipartFile pdfFile) {
                try {
                        // Kiểm tra file PDF
                        if (pdfFile == null || pdfFile.isEmpty()) {
                                return ResponseEntity.badRequest()
                                                .body(new ApiResponse<>(HttpStatus.BAD_REQUEST,
                                                                "File PDF không được để trống", null,
                                                                "MISSING_FILE"));
                        }

                        String contentType = pdfFile.getContentType();
                        if (contentType == null || !contentType.equals("application/pdf")) {
                                return ResponseEntity.badRequest()
                                                .body(new ApiResponse<>(HttpStatus.BAD_REQUEST,
                                                                "Chỉ chấp nhận file PDF", null,
                                                                "INVALID_FILE_TYPE"));
                        }

                        // Upload file lên Cloudinary
                        String pdfUrl = cloudinaryService.uploadFile(pdfFile);

                        // Cập nhật PDF cho result đầu tiên của booking
                        List<StisResultResponse> updatedResults = stisResultService
                                        .updatePdfUrlForBooking(bookingId, pdfUrl, false);

                        return ResponseEntity.ok(new ApiResponse<>(
                                        HttpStatus.OK,
                                        "Upload file PDF thành công",
                                        updatedResults,
                                        null));
                } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Lỗi khi upload file: " + e.getMessage(), null,
                                                        "UPLOAD_ERROR"));
                } catch (IllegalArgumentException ex) {
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
                List<StisResultResponse> results = stisResultService.getAllResultsByBookingId(bookingId);

                if (results.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new ApiResponse<>(HttpStatus.NOT_FOUND,
                                                        "Không tìm thấy kết quả cho booking này!", null, "NOT_FOUND"));
                }

                return ResponseEntity.ok(new ApiResponse<>(
                                HttpStatus.OK,
                                "Lấy danh sách kết quả xét nghiệm thành công",
                                results,
                                null));
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
