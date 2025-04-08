import React from 'react'

import Accordion from 'cozy-ui/transpiled/react/Accordion'
import AccordionDetails from 'cozy-ui/transpiled/react/AccordionDetails'
import AccordionSummary from 'cozy-ui/transpiled/react/AccordionSummary'

/**
 * Default formatter that simply renders the document as formatted JSON
 * @param {Array} data - Array of documents of the same doctype
 * @returns {JSX.Element} - Formatted view of the documents
 */
export const defaultFormatter = data => {
  return (
    <div className="default-formatter">
      {data.map((doc, index) => (
        <Accordion key={doc._id || index}>
          <AccordionSummary>{doc._id || 'No ID'}</AccordionSummary>
          <AccordionDetails>
            <pre className="u-m-1 u-ov-auto">
              {JSON.stringify(doc, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
