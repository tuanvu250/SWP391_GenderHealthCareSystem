package GenderHealthCareSystem.payment;

import GenderHealthCareSystem.model.StisBooking;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private VnPayService vnPayService;

    @GetMapping("/vn-pay")
    public ResponseEntity<String> createPayment(@RequestParam long amount,
                                                @RequestParam String orderInfo,
                                                HttpServletRequest request) throws Exception {
        System.out.println(request.getParameter("bankcode"));
        String bankCode = request.getParameter("vnp_BankCode");
        System.out.println(request.getRemoteAddr());
        String paymentUrl = vnPayService.createPaymentUrl(amount, orderInfo, request.getRemoteAddr());
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/return")
    public ResponseEntity<String> paymentReturn(HttpServletRequest request) throws Exception {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
            String name = e.nextElement();
            System.out.println(request.getParameter(name));
            fields.put(name, request.getParameter(name));
        }
        String secureHash = fields.get("vnp_SecureHash");
        boolean valid = vnPayService.validateReturnData(new HashMap<>(fields), secureHash);
        if (valid) {
//            String bookingId = fields.get("vnp_TxnRef");
//            String transactionId = fields.get("vnp_TransactionNo");
//
//            StisInvoice invoice = new StisInvoice();
//            invoice.setStisBooking(stisBookingService.getBookingByIdNotForResponse(Integer.parseInt(bookingId)).get());
//            invoice.setTransactionId(transactionId);
//            invoice.setTotalAmount(new BigDecimal(fields.get("vnp_Amount")).divide(BigDecimal.valueOf(100))); // VNPay trả *100
//            invoice.setPaymentMethod("VNPay");
//            invoice.setPaidAt(LocalDateTime.now());
//
//            stisInvoiceService.saveInvoice(invoice);
//            stisBookingService.markBookingPaymentStatusAsCompleted(Integer.parseInt(bookingId));
            return ResponseEntity.ok("Payment valid: " + fields.get("vnp_ResponseCode"));
        } else {
            return ResponseEntity.badRequest().body("Invalid payment signature");
        }
    }
//    if (valid) {
//        PaymentTransaction txn = new PaymentTransaction();//dto
//        txn.setOrderId(fields.get("vnp_TxnRef"));
//        txn.setAmount(Long.parseLong(fields.get("vnp_Amount")));
//        txn.setBankCode(fields.get("vnp_BankCode"));
//        txn.setOrderInfo(fields.get("vnp_OrderInfo"));
//        txn.setResponseCode(fields.get("vnp_ResponseCode"));
//        txn.setTransactionNo(fields.get("vnp_TransactionNo"));
//        txn.setPayDate(fields.get("vnp_PayDate"));
//        txn.setCardType(fields.get("vnp_CardType"));
//        txn.setSuccess("00".equals(fields.get("vnp_ResponseCode")));
//
//        paymentTransactionRepository.save(txn);
//
//        return ResponseEntity.ok("Payment valid: " + fields.get("vnp_ResponseCode"));
//    }

}
