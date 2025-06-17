package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.repository.StisInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StisInvoiceService {

    @Autowired
    private StisInvoiceRepository stisInvoiceRepository;

    public List<StisInvoice> getAllInvoices() {
        return stisInvoiceRepository.findAll();
    }

    public Optional<StisInvoice> getInvoiceById(Integer id) {
        return stisInvoiceRepository.findById(id);
    }

    public StisInvoice saveInvoice(StisInvoice invoice) {
        return stisInvoiceRepository.save(invoice);
    }

    public void deleteInvoice(Integer id) {
        stisInvoiceRepository.deleteById(id);
    }
}
