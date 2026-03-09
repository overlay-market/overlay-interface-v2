export default function formatUnixTimestampToDate(
  unixTimestamp: string | number,
  isMobile: boolean
) {
  const convert = Number(unixTimestamp)
  const date = new Date(convert * 1000) 

  if (isMobile) {
    // 📱 Mobile format: 11/15/2023
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  // 💻 Desktop/Tablet format: 24 December, 2023, 4:35pm
  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "long" })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase()

  return `${day} ${month}, ${year}, ${time}`
}