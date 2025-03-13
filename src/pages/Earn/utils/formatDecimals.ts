export const  formatDecimals = (numStr: string, digits: number = 4): string => {
  let num = parseFloat(numStr); 
  if (isNaN(num)) return "Invalid number"; 

  let factor = 10 ** digits;
  let truncated = Math.floor(num * factor) / factor;
  
  return truncated.toString(); 
}