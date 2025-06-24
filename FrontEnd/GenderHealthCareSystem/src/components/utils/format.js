import dayjs from "dayjs";

export function formatDateTime(isoString) {
  return dayjs(isoString).format("HH:mm - DD/MM/YYYY");
}

export function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}


export function convertVndToUsd(vndAmount, exchangeRate = 24000) {
  const usdAmount = vndAmount / exchangeRate;
  
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usdAmount);
}