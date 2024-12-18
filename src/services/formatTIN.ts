export const formatTIN = (input: string) => {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '')
  
  // Limit to 12 digits
  const limited = digitsOnly.slice(0, 12)
  
  // Add hyphens after 3, 6, and 9 digits
  let formatted = limited
  if (limited.length > 3) {
    formatted = `${limited.slice(0, 3)}-${limited.slice(3)}`
  }
  if (limited.length > 6) {
    formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`
  }
  if (limited.length > 9) {
    formatted = `${formatted.slice(0, 11)}-${formatted.slice(11)}`
  }
  
  return formatted
}