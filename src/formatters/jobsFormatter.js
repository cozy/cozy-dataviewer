import React from 'react'

import Accordion from 'cozy-ui/transpiled/react/Accordion'
import AccordionDetails from 'cozy-ui/transpiled/react/AccordionDetails'
import AccordionSummary from 'cozy-ui/transpiled/react/AccordionSummary'

/**
 * Custom formatter for the jobs doctype
 * @param {Array} data - Array of jobs
 * @returns {JSX.Element} - Formatted view of the documents
 */
export const jobsFormatter = data => {
  return (
    <div className="jobs-formatter">
      {data.map((doc, index) => (
        <Accordion key={doc._id || index}>
          <AccordionSummary>
            {doc.worker} {doc.message?.slug ?? doc.message?.slug} ({doc.state})
            - {new Date(doc.started_at).toLocaleString('fr-FR')}
          </AccordionSummary>
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
