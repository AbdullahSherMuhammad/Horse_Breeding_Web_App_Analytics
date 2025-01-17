const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Handle date with time
    const dateOnly = dateStr.split(' ')[0];
    const [day, month, year] = dateOnly.split('.');
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  function parseDecimal(value) {
    if (!value) return null;
    const cleaned = value.replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  
  module.exports = {parseDate, parseDecimal}