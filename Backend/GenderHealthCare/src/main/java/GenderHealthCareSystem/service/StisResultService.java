package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.StisResultRequest;
import GenderHealthCareSystem.dto.StisResultResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.enums.StisBookingStatus;
import GenderHealthCareSystem.model.StisResult;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisResultRepository;
import GenderHealthCareSystem.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StisResultService {

    private final StisBookingRepository stisBookingRepository;
    private final StisResultRepository stisResultRepository;

    @Transactional
    public StisResult createResult(Integer bookingId, StisResultRequest req) {
        StisBooking booking = stisBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy booking!"));

        switch (booking.getStatus()) {
            case CONFIRMED:
                // Không cần kiểm tra booking.getStisResult() nữa vì mối quan hệ đã thay đổi
                // thành OneToMany
                break;
            case COMPLETED:
                // Kiểm tra xem đã có kết quả chưa
                List<StisResult> existingResults = stisResultRepository.findAllByStisBooking_BookingId(bookingId);
                if (!existingResults.isEmpty()) {
                    // Nếu đã có kết quả, cập nhật kết quả đầu tiên
                    StisResult result = existingResults.get(0);
                    result.setTestCode(req.getTestCode());
                    result.setResultValue(req.getResultValue());
                    result.setReferenceRange(req.getReferenceRange());
                    result.setResultText(req.getResultText());
                    result.setNote(req.getNote());
                    result.setUpdatedAt(LocalDateTime.now());
                    return stisResultRepository.save(result);
                }
                // Nếu chưa có kết quả mặc dù booking COMPLETED, cho phép tạo mới
                break;
            case PENDING:
                throw new IllegalStateException("Không thể trả kết quả cho booking đang chờ xác nhận (PENDING)!");
            case CANCELLED:
                throw new IllegalStateException("Booking đã bị huỷ (CANCELLED), không thể trả kết quả!");
            case NO_SHOW:
                throw new IllegalStateException("Booking khách không đến (NO_SHOW), không thể trả kết quả!");
            case DENIED:
                throw new IllegalStateException("Booking không đủ điều kiện (DENIED), không thể trả kết quả!");
            case DELETED:
                throw new IllegalStateException("Booking đã bị xóa (DELETED), không thể trả kết quả!");
            default:
                throw new IllegalStateException("Trạng thái booking không hợp lệ!");
        }

        StisResult result = new StisResult();
        result.setStisBooking(booking);
        result.setResultDate(LocalDateTime.now());
        result.setTestCode(req.getTestCode());
        result.setResultValue(req.getResultValue());
        result.setReferenceRange(req.getReferenceRange());
        result.setResultText(req.getResultText());
        result.setNote(req.getNote());
        result.setCreatedAt(LocalDateTime.now());
        result.setUpdatedAt(LocalDateTime.now());
        stisResultRepository.save(result);
        booking.setStatus(StisBookingStatus.COMPLETED);
        stisBookingRepository.save(booking);
        return result;
    }

    @Transactional
    public List<StisResult> createMultipleResults(Integer bookingId, List<StisResultRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("Danh sách kết quả không được để trống!");
        }

        StisBooking booking = stisBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy booking!"));

        // Kiểm tra trạng thái booking
        switch (booking.getStatus()) {
            case CONFIRMED:
                // OK để tạo kết quả
                break;
            case COMPLETED:
                // Nếu đã COMPLETED, kiểm tra xem có kết quả nào chưa
                List<StisResult> existingResults = stisResultRepository.findAllByStisBooking_BookingId(bookingId);
                if (!existingResults.isEmpty()) {
                    // Nếu đã có kết quả, xóa tất cả kết quả cũ
                    stisResultRepository.deleteAll(existingResults);
                    stisResultRepository.flush();
                }
                break;
            case PENDING:
                throw new IllegalStateException("Không thể trả kết quả cho booking đang chờ xác nhận (PENDING)!");
            case CANCELLED:
                throw new IllegalStateException("Booking đã bị huỷ (CANCELLED), không thể trả kết quả!");
            case NO_SHOW:
                throw new IllegalStateException("Booking khách không đến (NO_SHOW), không thể trả kết quả!");
            case DENIED:
                throw new IllegalStateException("Booking không đủ điều kiện (DENIED), không thể trả kết quả!");
            case DELETED:
                throw new IllegalStateException("Booking đã bị xóa (DELETED), không thể trả kết quả!");
            default:
                throw new IllegalStateException("Trạng thái booking không hợp lệ!");
        }

        // Tạo danh sách kết quả mới
        List<StisResult> results = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (StisResultRequest req : requests) {
            StisResult result = new StisResult();
            result.setStisBooking(booking);
            result.setResultDate(now);
            result.setTestCode(req.getTestCode());
            result.setResultValue(req.getResultValue());
            result.setReferenceRange(req.getReferenceRange());
            result.setResultText(req.getResultText());
            result.setNote(req.getNote());
            result.setCreatedAt(now);
            result.setUpdatedAt(now);
            results.add(result);
        }

        // Lưu tất cả kết quả
        results = stisResultRepository.saveAll(results);

        // Cập nhật trạng thái booking
        booking.setStatus(StisBookingStatus.COMPLETED);
        stisBookingRepository.save(booking);

        return results;
    }

    @Transactional
    public StisResult updateResult(Integer resultId, StisResultRequest req) {
        StisResult result = stisResultRepository.findById(resultId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Không tìm thấy kết quả xét nghiệm với ID: " + resultId));

        // Chỉ cập nhật các trường không null
        if (StringUtils.hasText(req.getTestCode())) {
            result.setTestCode(req.getTestCode());
        }

        if (StringUtils.hasText(req.getResultValue())) {
            result.setResultValue(req.getResultValue());
        }

        if (StringUtils.hasText(req.getReferenceRange())) {
            result.setReferenceRange(req.getReferenceRange());
        }

        if (StringUtils.hasText(req.getResultText())) {
            result.setResultText(req.getResultText());
        }

        if (StringUtils.hasText(req.getNote())) {
            result.setNote(req.getNote());
        }

        result.setUpdatedAt(LocalDateTime.now());
        return stisResultRepository.save(result);
    }

    @Transactional
    public void deleteResult(Integer resultId) {
        StisResult result = stisResultRepository.findById(resultId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Không tìm thấy kết quả xét nghiệm với ID: " + resultId));

        // Nếu có quan hệ với booking, xử lý trước khi xóa
        StisBooking booking = result.getStisBooking();
        if (booking != null) {
            // Kiểm tra xem có còn kết quả nào khác không
            List<StisResult> remainingResults = stisResultRepository
                    .findAllByStisBooking_BookingId(booking.getBookingId());
            if (remainingResults.size() <= 1) {
                // Nếu đây là kết quả cuối cùng, đặt lại trạng thái booking về CONFIRMED
                booking.setStatus(StisBookingStatus.CONFIRMED);
                stisBookingRepository.save(booking);
            }
        }

        // Xóa các mối quan hệ trước khi xóa đối tượng
        result.setStisBooking(null);
        stisResultRepository.saveAndFlush(result);

        // Thực hiện xóa với force
        stisResultRepository.deleteById(resultId);
        stisResultRepository.flush();
    }

    public Optional<StisResult> getResultById(Integer resultId) {
        return stisResultRepository.findById(resultId);
    }

    public StisResultResponse mapToResponse(StisResult entity) {
        StisResultResponse res = new StisResultResponse();
        res.setResultId(entity.getResultId());
        res.setBookingId(entity.getStisBooking().getBookingId());
        res.setResultDate(entity.getResultDate());
        res.setTestCode(entity.getTestCode());
        res.setResultValue(entity.getResultValue());
        res.setReferenceRange(entity.getReferenceRange());
        res.setResultText(entity.getResultText());
        res.setNote(entity.getNote());
        res.setPdfResultUrl(entity.getPdfResultUrl());
        res.setCreatedAt(entity.getCreatedAt());
        res.setUpdatedAt(entity.getUpdatedAt());
        return res;
    }

    public Optional<StisResultResponse> getResultByBookingId(Integer bookingId) {
        List<StisResult> results = stisResultRepository.findAllByStisBooking_BookingId(bookingId);
        if (results.isEmpty()) {
            return Optional.empty();
        }
        // Trả về kết quả đầu tiên nếu có nhiều kết quả
        return Optional.of(mapToResponse(results.get(0)));
    }

    public List<StisResultResponse> getAllResultsByBookingId(Integer bookingId) {
        List<StisResult> results = stisResultRepository.findAllByStisBooking_BookingId(bookingId);
        return results.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StisResult updateResultPdf(Integer resultId, String pdfUrl) {
        StisResult result = stisResultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy kết quả với ID: " + resultId));

        result.setPdfResultUrl(pdfUrl);
        result.setUpdatedAt(LocalDateTime.now());
        return stisResultRepository.saveAndFlush(result);
    }

    public PageResponse<StisResultResponse> getAllResults(Pageable pageable) {
        Page<StisResult> resultsPage = stisResultRepository.findAll(pageable);
        Page<StisResultResponse> responsePages = resultsPage.map(this::mapToResponse);
        return PageResponseUtil.mapToPageResponse(responsePages);
    }

    /**
     * Kiểm tra xem booking có tồn tại không
     * 
     * @param bookingId ID của booking cần kiểm tra
     * @return true nếu booking tồn tại, false nếu không
     */
    public boolean bookingExists(Integer bookingId) {
        return stisBookingRepository.existsById(bookingId);
    }

    /**
     * Cập nhật URL PDF cho các kết quả của booking
     * Nếu updateAll=true, cập nhật tất cả các kết quả
     * Nếu updateAll=false:
     * - Nếu không có kết quả nào có PDF, cập nhật cho kết quả đầu tiên
     * - Nếu đã có ít nhất một kết quả có PDF, không cập nhật
     *
     * @param bookingId ID của booking cần cập nhật PDF
     * @param pdfUrl    URL của file PDF đã upload
     * @param updateAll true để cập nhật tất cả kết quả, false để chỉ cập nhật kết
     *                  quả đầu tiên nếu chưa có PDF
     * @return Danh sách các kết quả đã được cập nhật
     */
    @Transactional
    public List<StisResultResponse> updatePdfUrlForBooking(Integer bookingId, String pdfUrl, boolean updateAll) {
        List<StisResult> results = stisResultRepository.findAllByStisBooking_BookingId(bookingId);

        if (results.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy kết quả xét nghiệm cho booking này!");
        }

        LocalDateTime now = LocalDateTime.now();

        if (updateAll) {
            // Cập nhật PDF cho tất cả các kết quả
            for (StisResult result : results) {
                result.setPdfResultUrl(pdfUrl);
                result.setUpdatedAt(now);
            }
            stisResultRepository.saveAll(results);
        } else {
            // Kiểm tra xem có kết quả nào đã có PDF chưa
            boolean hasPdf = results.stream()
                    .anyMatch(r -> r.getPdfResultUrl() != null && !r.getPdfResultUrl().isEmpty());

            if (!hasPdf) {
                // Nếu không có kết quả nào có PDF, cập nhật cho kết quả đầu tiên
                StisResult firstResult = results.get(0);
                firstResult.setPdfResultUrl(pdfUrl);
                firstResult.setUpdatedAt(now);
                stisResultRepository.save(firstResult);
            }
        }

        // Trả về danh sách kết quả đã cập nhật
        return getAllResultsByBookingId(bookingId);
    }

    /**
     * Cập nhật URL PDF cho các kết quả của booking
     * Phương thức overload cho phương thức cũ, mặc định không cập nhật tất cả
     * 
     * @param bookingId ID của booking cần cập nhật PDF
     * @param pdfUrl    URL của file PDF đã upload
     * @return Danh sách các kết quả đã được cập nhật
     */
    @Transactional
    public List<StisResultResponse> updatePdfUrlForBooking(Integer bookingId, String pdfUrl) {
        return updatePdfUrlForBooking(bookingId, pdfUrl, false);
    }
}
