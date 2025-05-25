

export default class DateHelper {
  /**
   * Format a date string to 'YYYY-MM-DD'
   * @param {string | Date} date 
   * @returns {string} formatted date
   */
  static formatYMD(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format a date string to 'MMM dd, yyyy' (e.g. Sep 01, 2024)
   * @param {string | Date} date 
   * @returns {string} formatted date
   */
  static formatLong(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  /**
   * Format a date to 'Weekday, MMM dd, yyyy'
   * @param {string | Date} date 
   * @returns {string} formatted date
   */
  static formatFull(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }
}
