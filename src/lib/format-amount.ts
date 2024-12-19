const formatAmount = (value: number): string => {
  const locale = "vi-VN"; // Default to 'en-US' if not found

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default formatAmount;
