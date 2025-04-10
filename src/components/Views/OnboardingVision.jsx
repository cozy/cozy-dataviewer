import React, { useEffect, useState } from 'react'

import { useClient, Q } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'

import VisionIcon from '@/assets/images/vision.svg'

export const OnboardingVision = () => {
  const client = useClient()
  const [showIframe, setShowIframe] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [trigger, setTrigger] = useState(null)

  useEffect(() => {
    const fetchTrigger = async () => {
      const { data: triggers } = await client.query(
        Q('io.cozy.triggers').where({
          worker: 'service',
          type: '@webhook'
        })
      )
      const trigger = triggers.find(
        t =>
          t.message.name === 'webhookReceiver' &&
          t.message.slug === 'dataviewer'
      )
      setTrigger(trigger)
    }

    fetchTrigger()
  }, [client])

  useEffect(() => {
    const rt = client.plugins.realtime
    const handler = () => {
      setShowIframe(false)
      setIsComplete(true)
    }
    rt.subscribe('notified', 'io.cozy.jobs', 'PDI_OK', handler)

    return () => {
      rt.unsubscribe('notified', 'io.cozy.jobs', 'PID_OK', handler)
    }
  }, [client])

  const handleButtonClick = () => {
    setShowIframe(true)
    setIsComplete(false)
  }

  const webhookUrl = trigger?.links?.webhook
  const iframeUrl = webhookUrl
    ? `http://cozy.localhost:8080?webhook=${encodeURIComponent(webhookUrl)}`
    : null

  return (
    <div
      className="u-flex u-flex-justify-center u-flex-items-center"
      style={{ height: '80vh' }}
    >
      {showIframe && webhookUrl && (
        <iframe
          src={iframeUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            maxWidth: '1200px',
            maxHeight: '80vh',
            margin: '1rem'
          }}
          title="Configuration iframe"
        />
      )}
      {!showIframe && (
        <Stack spacing="s" align="center">
          {!isComplete && (
            <Button
              label=""
              variant="primary"
              startIcon={<Icon icon={VisionIcon} size={96} />}
              onClick={handleButtonClick}
              size="large"
            />
          )}
          {isComplete && (
            <Typography variant="h4" color="success">
              Configuration terminée
            </Typography>
          )}
        </Stack>
      )}
    </div>
  )
}

export default OnboardingVision
