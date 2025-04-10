import { defaultFormatter } from './defaultFormatter'
import { jobsFormatter } from './jobsFormatter'

// Map of doctype to formatter
const formatters = {
  'io.cozy.jobs': jobsFormatter
}

/**
 * Get a formatter for a specific doctype
 * @param {string} doctype - The doctype to get a formatter for
 * @returns {Function} - A formatter function that takes data and returns formatted JSX
 */
export const getFormatter = doctype => {
  return formatters[doctype] || defaultFormatter
}
