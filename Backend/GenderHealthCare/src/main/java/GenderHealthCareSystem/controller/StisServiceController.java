package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.model.StisService;
import GenderHealthCareSystem.service.StisServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stis-services")
@RequiredArgsConstructor
public class StisServiceController {

    private final StisServiceService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StisService>>> getAll() {
        List<StisService> list = service.getAll();
        ApiResponse<List<StisService>> res = new ApiResponse<>(
                HttpStatus.OK,
                "Lấy danh sách dịch vụ thành công",
                list,
                null
        );
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StisService>> getById(@PathVariable Integer id) {
        return service.getById(id)
                .map(s -> ResponseEntity.ok(
                        new ApiResponse<>(HttpStatus.OK, "Tìm thấy dịch vụ", s, null)
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ", null, "NOT_FOUND")
                ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StisService>> create(@RequestBody StisService req) {
        StisService created = service.create(req);
        ApiResponse<StisService> res = new ApiResponse<>(
                HttpStatus.CREATED,
                "Tạo mới dịch vụ thành công",
                created,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StisService>> update(@PathVariable Integer id, @RequestBody StisService req) {
        try {
            StisService updated = service.update(id, req);
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Cập nhật dịch vụ thành công",
                    updated,
                    null
            );
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<StisService> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy dịch vụ để cập nhật",
                    null,
                    "NOT_FOUND"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            service.delete(id);
            ApiResponse<String> res = new ApiResponse<>(
                    HttpStatus.OK,
                    "Xóa dịch vụ thành công",
                    "Deleted",
                    null
            );
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            ApiResponse<String> res = new ApiResponse<>(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy dịch vụ để xóa",
                    null,
                    "NOT_FOUND"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }
}
