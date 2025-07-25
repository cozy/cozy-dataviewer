import React, { useState, useEffect } from 'react'

import { useClient, Q } from 'cozy-client'
import Accordion from 'cozy-ui/transpiled/react/Accordion'
import AccordionDetails from 'cozy-ui/transpiled/react/AccordionDetails'
import AccordionSummary from 'cozy-ui/transpiled/react/AccordionSummary'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import TextField from 'cozy-ui/transpiled/react/TextField'

import ActivityGrid from '../components/Views/ActivityGrid'

const SHOW_IMPORT = false

/**
 * Custom formatter for the io.cozy.learningrecords doctype
 * @param {Array} data - Array of jobs
 * @param {Function} reloadData - Function to reload the data
 * @returns {JSX.Element} - Formatted view of the documents
 */
export const learningRecordsFormatter = (data, reloadData) => {
  const LearningRecordsView = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [yearlyData, setYearlyData] = useState([])
    const client = useClient()

    // Fetch all records for the current year
    useEffect(() => {
      const fetchYearlyData = async () => {
        const startOfYear = new Date()
        startOfYear.setMonth(0, 1)
        startOfYear.setHours(0, 0, 0, 0)

        const endOfYear = new Date()
        endOfYear.setMonth(11, 31)
        endOfYear.setHours(23, 59, 59, 999)

        const query = Q('io.cozy.learningrecords')
          .where({
            'source.timestamp': {
              $gte: startOfYear.toISOString(),
              $lte: endOfYear.toISOString()
            }
          })
          .indexFields(['source.timestamp'])

        const result = await client.query(query)
        setYearlyData(result.data)
      }

      fetchYearlyData()
    }, [client])

    // Group records by date for yearly data
    const yearlyGrouped = groupRecordsByDate(yearlyData)

    // Calculate completed trainings count
    const completedCount = yearlyData.filter(doc => {
      const verb =
        doc.source?.verb?.display?.['en-US'] ||
        doc.source?.verb?.display?.['fr-FR'] ||
        doc.source?.verb?.id ||
        ''
      return verb.toLowerCase().includes('completed')
    }).length

    return (
      <div className="jobs-formatter">
        <h1 className="u-mb-2">Learning Records</h1>

        {/* Metrics section */}
        <div
          className="u-mb-2"
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <div
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '16px',
              minWidth: '200px',
              textAlign: 'center'
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}
            >
              {completedCount}
            </div>
            <div
              style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}
            >
              Formations complétées
            </div>
          </div>
        </div>

        {/* Activity grid at the top showing yearly data */}
        <ActivityGrid grouped={yearlyGrouped} />
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
        {SHOW_IMPORT && (
          <>
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
                const actorEmail =
                  document.querySelector('input#actorEmail').value
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
          </>
        )}
      </div>
    )
  }

  return <LearningRecordsView />
}

function createXAPIStatement(actorEmail, verb, objectId) {
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }
  function getCurrentTimestamp() {
    return new Date().toISOString()
  }
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
