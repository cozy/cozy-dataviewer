import React from 'react'
import { useParams } from 'react-router-dom'

export const Doctype = () => {
  const { doctype } = useParams()

  return (
    <div>
      <h1>Document Type: {doctype}</h1>
    </div>
  )
}
