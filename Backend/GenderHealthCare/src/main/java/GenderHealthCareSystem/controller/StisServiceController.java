package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.StisServiceRequest;
import GenderHealthCareSystem.model.StisService;
import GenderHealthCareSystem.service.StisServiceService;
import GenderHealthCareSystem.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stis-services")
@RequiredArgsConstructor
public class StisServiceController {

    private final StisServiceService service;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PageResponse<StisService>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchName,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StisService> resultPage = service.getAll(searchName, status, pageable);
        PageResponse<StisService> pageResponse = PageResponseUtil.mapToPageResponse(resultPage);

        ApiResponse<PageResponse<StisService>> res = new ApiResponse<>(
                HttpStatus.OK,
                "Lấy danh sách dịch vụ thành công",
                pageResponse,
                null);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StisService>> getById(@PathVariable Integer id) {
        return service.getById(id)
                .map(s -> ResponseEntity.ok(
                        new ApiResponse<>(HttpStatus.OK, "Tìm thấy dịch vụ", s, null)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ", null, "NOT_FOUND")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StisService>> create(@RequestBody StisServiceRequest req) {
        StisService toSave = new StisService();
        toSave.setServiceName(req.getServiceName());
        toSave.setDescription(req.getDescription());
        toSave.setPrice(req.getPrice());
        toSave.setDuration(req.getDuration());
        toSave.setTests(req.getTests());
        toSave.setType(req.getType());
        toSave.setDiscount(req.getDiscount());
        toSave.setStatus(req.getStatus());

        StisService created = service.create(toSave);
        ApiResponse<StisService> res = new ApiResponse<>(
                HttpStatus.CREATED, "Tạo mới dịch vụ thành công", created, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StisService>> update(@PathVariable Integer id,
            @RequestBody StisServiceRequest req) {
        try {
            StisService serviceToUpdate = new StisService();
            serviceToUpdate.setServiceName(req.getServiceName());
            serviceToUpdate.setDescription(req.getDescription());
            serviceToUpdate.setPrice(req.getPrice());
            serviceToUpdate.setDuration(req.getDuration());
            serviceToUpdate.setTests(req.getTests());
            serviceToUpdate.setType(req.getType());
            serviceToUpdate.setDiscount(req.getDiscount());
            serviceToUpdate.setStatus(req.getStatus());

            StisService updated = service.update(id, serviceToUpdate);
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Cập nhật dịch vụ thành công",
                    updated,
                    null);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy dịch vụ để cập nhật",
                    null,
                    "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<ApiResponse<StisService>> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> requestBody) {
        try {
            String status = requestBody.get("status");
            if (status == null || (!status.equals("active") && !status.equals("nonactive"))) {
                ApiResponse<StisService> res = new ApiResponse<>(
                        HttpStatus.BAD_REQUEST,
                        "Trạng thái không hợp lệ. Chỉ chấp nhận 'active' hoặc 'nonactive'",
                        null,
                        "INVALID_STATUS");
                return ResponseEntity.badRequest().body(res);
            }

            StisService updated = service.updateStatus(id, status);
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Cập nhật trạng thái dịch vụ thành công",
                    updated,
                    null);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy dịch vụ để cập nhật trạng thái",
                    null,
                    "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @GetMapping("/combo")
    public ResponseEntity<ApiResponse<List<StisService>>> getComboServices() {
        List<StisService> comboServices = service.getByTypeCombo();
        ApiResponse<List<StisService>> res = new ApiResponse<>(
                HttpStatus.OK,
                "Lấy danh sách dịch vụ combo thành công",
                comboServices,
                null);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/single")
    public ResponseEntity<ApiResponse<List<StisService>>> getSingleServices() {
        List<StisService> singleServices = service.getByTypeSingle();
        ApiResponse<List<StisService>> res = new ApiResponse<>(
                HttpStatus.OK,
                "Lấy danh sách dịch vụ single thành công",
                singleServices,
                null);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            service.delete(id);
            ApiResponse<String> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Xóa dịch vụ thành công",
                    "Deleted",
                    null);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<String> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy dịch vụ để xóa",
                    null,
                    "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }
}
