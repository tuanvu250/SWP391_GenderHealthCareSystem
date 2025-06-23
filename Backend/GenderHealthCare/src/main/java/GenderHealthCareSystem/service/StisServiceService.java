package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.StisService;
import GenderHealthCareSystem.repository.StisServiceRepository;
import lombok.RequiredArgsConstructor;
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
            existing.setServiceName(newData.getServiceName());
            existing.setDescription(newData.getDescription());
            existing.setPrice(newData.getPrice());
            existing.setDuration(newData.getDuration());
            existing.setTests(newData.getTests());
            existing.setType(newData.getType());
            existing.setDiscount(newData.getDiscount());
            existing.setStatus(newData.getStatus());
            existing.setUpdatedAt(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
