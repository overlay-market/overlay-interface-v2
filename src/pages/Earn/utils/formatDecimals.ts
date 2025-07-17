export const  formatDecimals = (numStr: string, digits: number = 4): string => {
  let num = parseFloat(numStr); 
  if (isNaN(num)) return "Invalid number"; 

  let factor = 10 ** digits;
  let truncated = Math.floor(num * factor) / factor;
  
  return truncated.toString(); 
}

export const formatNumber = (amount: number, digits: number = 2): string => {
  if (amount < 1 && amount !== 0) {
    return amount.toLocaleString(undefined, {
      maximumSignificantDigits: digits,
    });
  }

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}