/**
 * Format a UTC date string or Date object to a human-readable local time.
 * @param {string|Date} date
 * @returns {string} e.g. "Apr 23, 10:30 PM"
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date as "Today", "Yesterday", or "Apr 20".
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();

  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

/**
 * Format phone number for display (mask middle digits).
 * @param {string} phone
 * @returns {string} e.g. "+91 98xxx43210"
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  if (phone.length >= 10) {
    const visible = phone.slice(-4);
    const prefix = phone.slice(0, phone.length - 7);
    return `${prefix}xxx${visible}`;
  }
  return phone;
};

/**
 * Capitalize first letter of each word.
 * @param {string} str
 * @returns {string}
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};
