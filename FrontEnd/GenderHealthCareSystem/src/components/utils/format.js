import dayjs from "dayjs";

export function formatDateTime(isoString) {
  return dayjs(isoString).format("HH:mm - DD/MM/YYYY");
}

export function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}
