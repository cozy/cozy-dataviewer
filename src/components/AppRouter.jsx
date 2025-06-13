import React, { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import flags from 'cozy-flags'

import AppLayout from '@/components/AppLayout'
import { Doctype } from '@/components/Views/Doctype'
import { OnboardingVision } from '@/components/Views/OnboardingVision'
import { Welcome } from '@/components/Views/Welcome'
import OnboardingManager from '@/lib/OnboardingManager'

const AppRouter = () => {
  const isLearningRecordsEnabled = flags('dataviewer.plrs')
  const client = useClient()
  const [isOnboardingDone, setIsOnboardingDone] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isLearningRecordsEnabled) {
        const onboardingManager = new OnboardingManager(client)
        const done = await onboardingManager.isOnboardingDone()
        setIsOnboardingDone(done)
      }
      setIsLoading(false)
    }
    checkOnboarding()
  }, [client, isLearningRecordsEnabled])

  if (isLoading) {
    return null
  }

  if (isLearningRecordsEnabled) {
    if (!isOnboardingDone) {
      return (
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/onboarding_vision" element={<OnboardingVision />} />
              <Route
                path="*"
                element={<Navigate replace to="/onboarding_vision" />}
              />
            </Route>
          </Routes>
        </HashRouter>
      )
    }

    return (
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/doctype/:doctype" element={<Doctype />} />
            <Route
              path="*"
              element={
                <Navigate replace to="/doctype/io.cozy.learningrecords" />
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding_vision" element={<OnboardingVision />} />
          <Route path="/doctype/:doctype" element={<Doctype />} />
          <Route path="*" element={<Navigate replace to="/welcome" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
