// src/api/payment.api.js
import { data } from "react-router-dom";
import apiClient from "./apiClient";

export const paymentVNPayAPI = async (amount, orderInfo, bookingID) => {
  return apiClient.get("/payment/vn-pay", {
    params: {
      amount,
      orderInfo,
      bookingID,
    },
    responseType: "text", // Để nhận về URL
    maxRedirects: 0,
  });
};

export const paymentPayPalAPI = async (price, bookingId) => {
  const values = {
    bookingId,
    price,
  };
  return apiClient.post("/payment/pay", values, {
    responseType: "text", // Để nhận về URL
    maxRedirects: 0,
  });
};

export const paypalSuccessAPI = async (paymentId, PayerID) => {
  return apiClient.get("/payment/success", {
    params: {
      paymentId,
      PayerID,
    },
  });
};

export const createInvoiceAPI = async (query) => {
  return apiClient.get(`/payment/create-invoice?${query}`);
};

export const getInvoiceTestingAPI = async (invoiceId) => {
  return apiClient.get(`/stis-invoices/${invoiceId}`);
};  

export const markPaymentCashedAPI = async (values) => {
  const data = {
    bookingId: values.bookingId,
    totalAmount: values.totalAmount,
    currency: "VND",
    paymentMethod: "CASH"
  };
  return apiClient.post("/stis-invoices", data);
}