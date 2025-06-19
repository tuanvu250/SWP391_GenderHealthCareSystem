package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.StisResultRequest;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.StisBookingStatus;
import GenderHealthCareSystem.model.StisResult;
import GenderHealthCareSystem.repository.StisBookingRepository;
import GenderHealthCareSystem.repository.StisResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StisResultService {

    private final StisBookingRepository stisBookingRepository;
    private final StisResultRepository stisResultRepository;

    public StisResult createResult(Integer bookingId, StisResultRequest req) {
        StisBooking booking = stisBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy booking!"));

        switch (booking.getStatus()) {
            case CONFIRMED:
                if (booking.getStisResult() != null) {
                    throw new IllegalStateException("Booking này đã được trả kết quả trước đó!");
                }
                break;
            case PENDING:
                throw new IllegalStateException("Không thể trả kết quả cho booking đang chờ xác nhận (PENDING)!");
            case COMPLETED:
                throw new IllegalStateException("Booking này đã hoàn tất (COMPLETED), không thể trả kết quả nữa!");
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
        result.setHivCombo(req.getHivCombo());
        result.setSyphilisRpr(req.getSyphilisRpr());
        result.setChlamydiaNaat(req.getChlamydiaNaat());
        result.setGonorrheaNaat(req.getGonorrheaNaat());
        result.setHsvIgm(req.getHsvIgm());
        result.setHbsAg(req.getHbsAg());
        result.setAntiHcv(req.getAntiHcv());
        result.setHpvDna(req.getHpvDna());
        result.setResultText(req.getResultText());
        result.setNote(req.getNote());
        result.setCreatedAt(LocalDateTime.now());
        result.setUpdatedAt(LocalDateTime.now());
        stisResultRepository.save(result);

        booking.setStatus(StisBookingStatus.COMPLETED);
        stisBookingRepository.save(booking);

        return result;
    }
}
