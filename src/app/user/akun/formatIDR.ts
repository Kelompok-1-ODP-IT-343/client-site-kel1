export const formatIDR = (n: number | string) =>
  Number(n).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
