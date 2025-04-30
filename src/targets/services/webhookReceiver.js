/*
 * This service is just here to receive a webhook and tell the application that it has been
 * received
 *
 * This service is supposed to be called why a webhook trigger, created by the application
 */
import CozyClient from 'cozy-client'
import logger from 'cozy-logger'
import CozyRealtime from 'cozy-realtime'
const log = logger.namespace('cliskTimeout')

const main = async () => {
  const client = CozyClient.fromEnv()
  const rt = new CozyRealtime({ client })
  rt.sendNotification('io.cozy.jobs', 'PDI_OK', {
    result: 'PDI_OK'
  })
}
;(async () => {
  try {
    await main()
  } catch (error) {
    log('critical', error.message)
  }
})()
