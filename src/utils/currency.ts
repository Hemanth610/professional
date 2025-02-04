// Exchange rate: 1 USD = 83 INR (approximately)
export const USD_TO_INR = 83;

export const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount * USD_TO_INR);
};