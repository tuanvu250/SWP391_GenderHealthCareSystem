export function formatDateTime(isoString) {
  const date = new Date(isoString);
  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Format giờ
  const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${timeFormatter.format(date)} - ${dateFormatter.format(date)}`;
}

export function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}
