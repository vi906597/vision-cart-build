// Format price in INR (Indian Rupees)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Convert USD to INR (approximate rate for display)
export const convertToINR = (usdPrice: number): number => {
  const conversionRate = 83; // 1 USD = 83 INR approximately
  return Math.round(usdPrice * conversionRate);
};
