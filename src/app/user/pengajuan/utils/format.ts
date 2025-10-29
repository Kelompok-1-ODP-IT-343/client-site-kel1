export const formatCurrency = (amount: string | number): string => {
  const numValue = String(amount).replace(/[^0-9]/g, "");
  const num = Number(numValue);
  if (isNaN(num)) return "";
  const formatted = new Intl.NumberFormat("id-ID").format(num);
  return formatted === "0" ? "" : formatted;
};

export const parseCurrency = (formattedValue: string): number => {
  const numValue = formattedValue.replace(/[^0-9]/g, "");
  return Number(numValue) || 0;
};

export const formatNumberOnly = (value: string) =>
  value.replace(/[^0-9]/g, "");
