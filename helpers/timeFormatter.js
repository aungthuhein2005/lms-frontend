// timeFormatter.js

/**
 * Converts 24-hour time string ("HH:mm:ss") to 12-hour format with AM/PM.
 * @param {string} time24 - Time string in "HH:mm:ss" format.
 * @returns {string} Time formatted as "h:mm AM/PM".
 */
export function formatTime24to12(time24) {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // Convert '0' to '12'
  return `${hour}:${minute} ${ampm}`;
}
