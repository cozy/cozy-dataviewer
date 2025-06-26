/*
 * This service will fetch all learning records from the current instance
 *
 * This service is supposed to be called why a webhook trigger, created by the application
 */
import CozyClient, { Q } from 'cozy-client'
import logger from 'cozy-logger'
const log = logger.namespace('learningRecordsFetcher')

async function main() {
  const client = CozyClient.fromEnv()
  const { data: learningRecords } = await client.query(
    Q('io.cozy.learningrecords')
  )
  return learningRecords
}

;(async () => {
  try {
    await main()
  } catch (error) {
    log('critical', error.message)
  }
})()
