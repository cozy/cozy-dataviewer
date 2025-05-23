import React, { useState } from 'react'

import Accordion from 'cozy-ui/transpiled/react/Accordion'
import AccordionDetails from 'cozy-ui/transpiled/react/AccordionDetails'
import AccordionSummary from 'cozy-ui/transpiled/react/AccordionSummary'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import TextField from 'cozy-ui/transpiled/react/TextField'

import ActivityGrid from '../components/Views/ActivityGrid'
/**
 * Custom formatter for the jobs doctype
 * @param {Array} data - Array of jobs
 * @param {Function} reloadData - Function to reload the data
 * @returns {JSX.Element} - Formatted view of the documents
 */
export const learningRecordsFormatter = (data, reloadData) => {
  // We create a component that will handle the state
  const LearningRecordsView = () => {
    const [isLoading, setIsLoading] = useState(false)
    // Group records by date
    const grouped = groupRecordsByDate(data)

    return (
      <div className="jobs-formatter">
        {/* Activity grid at the top */}
        <ActivityGrid grouped={grouped} />
        {data.map((doc, index) => {
          // Extract verb and object from the learning record
          const verb =
            doc.source?.verb?.display?.['en-US'] ||
            doc.source?.verb?.id ||
            'Unknown verb'
          // Prefer object.name, fallback to object.id
          const objectName =
            doc.source?.object?.name ||
            doc.source?.object?.id ||
            'Unknown object'
          const headerText = `${verb} ${objectName}`
          return (
            <Accordion key={doc._id || index}>
              {/* Display the verb and object in the header */}
              <AccordionSummary>{headerText}</AccordionSummary>
              <AccordionDetails>
                <pre className="u-m-1 u-ov-auto">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
          )
        })}
        <div className="u-flex u-flex-items-center">
          <TextField
            className="u-mt-1 u-p-1 u-br-2"
            id="actorEmail"
            defaultValue="alice@visions.com"
          />
          {isLoading && <Icon className="u-ml-1" icon={SpinnerIcon} spin />}
        </div>
        <Button
          className="u-mt-1 u-p-1 u-br-2"
          label="Import from test organization"
          onClick={async () => {
            const actorEmail = document.querySelector('input#actorEmail').value
            const verb = 'played'
            const objectId = 'http://example.adlnet.gov/xapi/example/game'

            setIsLoading(true)
            try {
              for (let i = 0; i < 10; i++) {
                const statement = createXAPIStatement(
                  actorEmail,
                  verb,
                  objectId
                )
                await sendXAPIStatement(statement)
              }
              // Reload the data instead of the page
              if (reloadData) {
                await reloadData()
              }
            } finally {
              setIsLoading(false)
            }
          }}
        />
      </div>
    )
  }

  return <LearningRecordsView />
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getCurrentTimestamp() {
  return new Date().toISOString()
}

function createXAPIStatement(actorEmail, verb, objectId) {
  const statementId = generateUUID()
  return {
    id: statementId,
    actor: {
      mbox: `mailto:${actorEmail}`
    },
    verb: {
      id: `http://adlnet.gov/expapi/verbs/${verb}`,
      display: {
        'en-US': verb
      }
    },
    object: {
      id: objectId
    },
    timestamp: getCurrentTimestamp()
  }
}

// Function to send xAPI statement
async function sendXAPIStatement(statement) {
  await fetch(
    `http://localhost:3000/proxy/xAPI/statements?statementId=${statement.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Experience-API-Version': '1.0.3'
      },
      body: JSON.stringify(statement)
    }
  )
}

/**
 * Groups records by date.
 *
 * @param {Array} records - The array of records to group.
 * @returns {Object} - An object where keys are dates (YYYY-MM-DD) and values are the count of records for that date.
 */
function groupRecordsByDate(records) {
  const grouped = {}
  for (const doc of records) {
    // Try to get the timestamp from the record
    const timestamp = doc.source?.timestamp || doc.cozyMetadata?.createdAt
    if (!timestamp) continue
    const date = new Date(timestamp).toISOString().slice(0, 10) // YYYY-MM-DD
    grouped[date] = (grouped[date] || 0) + 1
  }
  return grouped
}
