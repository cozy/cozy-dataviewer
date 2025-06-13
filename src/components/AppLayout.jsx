import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent, BarCenter } from 'cozy-bar'
import { useClient } from 'cozy-client'
import flags from 'cozy-flags'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Sidebar from '@/components/Sidebar'

const AppLayout = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const isLearningRecordsEnabled = flags('dataviewer.plrs')

  return (
    <Layout>
      <BarComponent searchOptions={{ enabled: true }} />
      {!isLearningRecordsEnabled && <Sidebar />}
      <Main>
        <Content>
          {isMobile && (
            <BarCenter>
              <Typography variant="h5">{client.appMetadata.slug}</Typography>
            </BarCenter>
          )}
          <Outlet />
        </Content>
      </Main>
      <Alerter t={t} />
    </Layout>
  )
}

export default AppLayout
