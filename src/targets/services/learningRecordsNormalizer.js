/*
 * This service is just here to receive a webhook and tell the application that it has been
 * received
 *
 * This service is supposed to be called why a webhook trigger, created by the application
 */
import CozyClient, { Q } from 'cozy-client'
import logger from 'cozy-logger'
const log = logger.namespace('learningRecordsNormalizer')

async function main() {
  // const client = CozyClient.fromEnv()
  // const { data: emptyLearningRecords } = await client.query(
  //   Q('io.cozy.learningrecords').partialIndex({
  //     'source.authority': { $exists: false }
  //   })
  // )
  // if (emptyLearningRecords.length > 0) {
  //   log(
  //     'info',
  //     `Found ${emptyLearningRecords.length} learning records without authority`
  //   )
  //   for (const lr of emptyLearningRecords) {
  //     // TODO should bulk delete
  //     await client.destroy(lr)
  //   }
  //   const response = await fetch(`http://localhost:8100/xAPI/statements/`, {
  //     method: 'POST',
  //     headers: makePlrsHeaders(await generateToken(client)),
  //     body: JSON.stringify(emptyLearningRecords)
  //   })
  //   const modified = await response.json()
  //   log('info', `Modified learning records: ${JSON.stringify(modified, null, 2)}`)
  //   log('info', `Modified learning records number: ${modified.length}`)
  //   if (!response.ok) {
  //     // TODO if some saving failed, should recreate failed statements
  //     // If the fetch request failed, recreate the learning record
  //     log(
  //       'info',
  //       `PLRS response Status: ${response.status} ${response.statusText}`
  //     )
  //     // await client.save(lr)
  //     log(
  //       'error',
  //       `Failed to update learning records. Record has been recreated.`
  //     )
  //   }
  // }
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
const generateToken = async client => {
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
const makePlrsHeaders = authToken => {
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
