import axios from "axios";
import dayjs from "dayjs";

export function formatDateTime(isoString) {
  return dayjs(isoString).format("HH:mm - DD/MM/YYYY");
}

export function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}


export async function convertVndToUsd (vndAmount) {
  const exchangeRate = await getUSDToVNDExchangeRate();
  const usdAmount = vndAmount / exchangeRate;
  
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usdAmount);
}

export async function convertUsdToVnd(usdAmount) {
  const exchangeRate = await getUSDToVNDExchangeRate();
  const vndAmount = usdAmount * exchangeRate;
  
  return new Intl.NumberFormat('vi-VN', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(vndAmount);
}

export function getTagColor(tag) {
  const Tag = (tag) => {
    const tagColors = {
      "Sức khỏe": "green",
      "Giới tính": "blue",
      "Tư vấn": "purple",
      STIs: "red",
      "Kinh nguyệt": "pink",
    };

    return tagColors[tag] || "cyan";
  };
  return Tag(tag);
}

export async function getUSDToVNDExchangeRate() {
  const cachedData = localStorage.getItem('exchange_rate_data');
  
  if (cachedData) {
    const rate = parseFloat(cachedData);
    return rate;
  }

  try {
    console.log('Fetching new exchange rate');
    const response = await axios.get("https://v6.exchangerate-api.com/v6/f4bf27f3ae7743b87405279d/latest/USD");
    const rate = response.data.conversion_rates.VND;
    localStorage.setItem('exchange_rate_data', rate);
    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 26000;
  }
}