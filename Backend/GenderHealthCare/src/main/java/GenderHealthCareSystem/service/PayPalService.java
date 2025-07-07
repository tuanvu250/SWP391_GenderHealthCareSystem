package GenderHealthCareSystem.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PayPalService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalService.class);

    @Autowired
    private APIContext apiContext;

    public Payment createPayment(String bookingID, Double total, String currency, String method,
                                 String intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException {

        Amount amount = new Amount();
        amount.setCurrency(currency);
        System.out.println("Total amount: " + total);
        amount.setTotal(String.format(Locale.US,"%.2f", total));
        System.out.println("Formatted total amount: " + amount.getTotal());

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setCustom(bookingID);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(List.of(transaction));

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        logger.info("Executing PayPal payment with paymentId: {} and payerId: {}", paymentId, payerId);
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution execution = new PaymentExecution();
        execution.setPayerId(payerId);
        try {
            Payment executedPayment = payment.execute(apiContext, execution);
            logger.info("Payment executed successfully: {}", executedPayment);
            return executedPayment;
        } catch (PayPalRESTException e) {
            logger.error("Error executing PayPal payment: {}", e.getDetails());
            throw e;
        }
    }
}
