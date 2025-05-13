import { defaultFormatter } from './defaultFormatter'
import { jobsFormatter } from './jobsFormatter'
import { learningRecordsFormatter } from './learningRecordsFormatter'

// Map of doctype to formatter
const formatters = {
  'io.cozy.jobs': jobsFormatter,
  'io.cozy.learningrecords': learningRecordsFormatter
}

/**
 * Get a formatter for a specific doctype
 * @param {string} doctype - The doctype to get a formatter for
 * @returns {Function} - A formatter function that takes data and returns formatted JSX
 */
export const getFormatter = doctype => {
  console.log('🚀 formatters', formatters)
  console.log('🚀 doctype', doctype)
  console.log('🚀 formatter', formatters[doctype])
  return formatters[doctype] || defaultFormatter
}
