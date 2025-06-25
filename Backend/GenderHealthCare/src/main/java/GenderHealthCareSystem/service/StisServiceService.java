package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.StisService;
import GenderHealthCareSystem.repository.StisServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StisServiceService {
    private final StisServiceRepository repository;

    public List<StisService> getAll() {
        return repository.findAll();
    }

    public Page<StisService> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<StisService> getAll(String searchName, String status, Pageable pageable) {
        Specification<StisService> spec = Specification.where(null);

        if (searchName != null && !searchName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("serviceName")),
                    "%" + searchName.toLowerCase() + "%"));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return repository.findAll(spec, pageable);
    }

    public Optional<StisService> getById(Integer id) {
        return repository.findById(id);
    }

    public StisService create(StisService service) {
        service.setCreatedAt(LocalDateTime.now());
        service.setUpdatedAt(LocalDateTime.now());
        return repository.save(service);
    }

    public StisService update(Integer id, StisService newData) {
        return repository.findById(id).map(existing -> {
            if (newData.getServiceName() != null) {
                existing.setServiceName(newData.getServiceName());
            }
            if (newData.getDescription() != null) {
                existing.setDescription(newData.getDescription());
            }
            if (newData.getPrice() != null) {
                existing.setPrice(newData.getPrice());
            }
            if (newData.getDuration() != null) {
                existing.setDuration(newData.getDuration());
            }
            if (newData.getTests() != null) {
                existing.setTests(newData.getTests());
            }
            if (newData.getType() != null) {
                existing.setType(newData.getType());
            }
            if (newData.getDiscount() != null) {
                existing.setDiscount(newData.getDiscount());
            }
            if (newData.getStatus() != null) {
                existing.setStatus(newData.getStatus());
            }

            existing.setUpdatedAt(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public StisService updateStatus(Integer id, String status) {
        return repository.findById(id).map(existing -> {
            existing.setStatus(status);
            existing.setUpdatedAt(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public List<StisService> getByTypeCombo() {
        return repository.findByType("combo");
    }

    public List<StisService> getByTypeRetail() {
        return repository.findByType("retail");
    }
}
