export function formatDate(dateString: string): string {

  try {
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('T')[0]!.split('-')
      return `${month}/${day}/${year}`
    }
    
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  } catch {
    return dateString
  }
}
