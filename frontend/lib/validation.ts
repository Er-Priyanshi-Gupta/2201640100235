export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
  } catch {
    return false
  }
}

export const validateShortcode = (shortcode: string): boolean => {
  const pattern = /^[a-zA-Z0-9]{3,10}$/
  return pattern.test(shortcode)
}

export const validateValidityPeriod = (period: number): boolean => {
  return Number.isInteger(period) && period >= 1 && period <= 10080
}
