import React from 'react'

/**
 * Default formatter that simply renders the document as formatted JSON
 * @param {Array} data - Array of documents of the same doctype
 * @returns {JSX.Element} - Formatted view of the documents
 */
export const defaultFormatter = data => {
  return (
    <div className="default-formatter">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
