/*
 * This service is used to receive learning records from outside of the server
 * This service is supposed to be called why a webhook trigger, created by the application
 */
import fs from 'fs/promises'
import path from 'path'

import CozyClient from 'cozy-client'
import logger from 'cozy-logger'

const log = logger.namespace('learningRecordsReceiver')

const main = async () => {
  const payload = await readPayload()
  const learningRecords = Array.isArray(payload?.data)
    ? payload.data
    : [payload]
  log('info', `Received ${learningRecords.length} learning records`)
  const client = CozyClient.fromEnv()

  const response = await fetch(`http://localhost:8100/xAPI/statements/`, {
    method: 'POST',
    headers: makePlrsHeaders(await generateToken(client)),
    body: JSON.stringify(learningRecords)
  })
  log('info', `Response: ${response.status}`)

  log(
    'info',
    `Modified learning records number: ${(await response.json()).length}`
  )
}
;(async () => {
  try {
    await main()
  } catch (error) {
    log('critical', error.message)
  }
})()

/**
 * Generates an authentication token for the given client.
 * @param {Object} client - The client object used to save the token.
 * @returns {Promise<string>} The generated authentication token.
 */
async function generateToken(client) {
  const result = await client.save({
    _type: 'io.cozy.permissions',
    permissions: {
      learningrecords: {
        type: 'io.cozy.learningrecords',
        verbs: ['GET', 'POST', 'PUT']
      },
      doctypes: {
        type: 'io.cozy.doctypes',
        verbs: ['GET']
      }
    }
  })
  return result.data?.attributes?.codes?.code
}

/**
 * Creates headers for PLRS API requests
 * @param {string} authToken - The authentication token to use
 * @returns {Object} Headers object for PLRS API requests
 */
function makePlrsHeaders(authToken) {
  const basicAuthCredentials = 'ralph:secret'
  const basicAuthHeader = `Basic ${Buffer.from(basicAuthCredentials).toString(
    'base64'
  )}`

  return {
    'Content-Type': 'application/json',
    'X-Experience-API-Version': '1.0.3',
    'X-Auth-Token': `Bearer ${authToken}`,
    Authorization: basicAuthHeader
  }
}

async function readPayload() {
  const cozyPayload = process.env.COZY_PAYLOAD

  if (cozyPayload == null) {
    return null
  }

  const isFileReference = cozyPayload?.[0] === '@'

  if (isFileReference) {
    const fileName = cozyPayload.substr(1)
    const filePath = path.resolve(__dirname, fileName)
    try {
      const fileContent = await fs.readFile(filePath)
      return JSON.parse(fileContent)
    } catch (err) {
      throw new Error(
        `Error while reading file ${filePath} payload: ${err.message}`
      )
    }
  } else {
    try {
      return JSON.parse(cozyPayload)
    } catch (err) {
      throw new Error('Could not parse JSON in COZY_PAYLOAD: ' + cozyPayload)
    }
  }
}
