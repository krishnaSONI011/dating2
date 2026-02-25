export function getExpiryDate(createdAt, daysToAdd = 15) {
    const date = new Date(createdAt)
  
    // add days
    date.setDate(date.getDate() + daysToAdd)
  
    // format options
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  
    return date.toLocaleDateString("en-IN", options)
  }