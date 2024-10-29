export const currentTimeParsed = (): string => {
  const currentTime = new Date()
  
  return Date.parse(currentTime.toString()).toString()
}