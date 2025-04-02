import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from '@/components/AppLayout'
import { Doctype } from '@/components/Views/Doctype'
import { Welcome } from '@/components/Views/Welcome'

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/welcome" element={<Welcome />}></Route>
          <Route path="/doctype/:doctype" element={<Doctype />}></Route>
          <Route path="*" element={<Navigate replace to="/welcome" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
