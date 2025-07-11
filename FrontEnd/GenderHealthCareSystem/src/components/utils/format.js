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

export function convertUsdToVnd(usdAmount, exchangeRate = 24000) {
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