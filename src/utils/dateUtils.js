// EVIDENCE: JavaScript - Function basics (Trainee)
// Helper utilities for date manipulation without external libraries

/**
 * Format date to display format (e.g., "Mar 15, 2025")
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  /**
   * Add days to a date
   * @param {Date} date - The date to add days to
   * @param {number} days - Number of days to add
   * @returns {Date} - New date after adding days
   */
  export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  /**
   * Format date to YYYY-MM-DD for inputs
   * @param {Date} date - The date to format
   * @returns {string} - Date in YYYY-MM-DD format
   */
  export const formatDateForInput = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  };