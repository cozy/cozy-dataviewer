import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useClient, Q } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'

export const Doctype = () => {
  const { doctype } = useParams()

  const [data, setData] = useState()
  const client = useClient()

  useEffect(() => {
    const fetchData = async () => {
      const result = await client.queryAll(Q(doctype))
      setData(result)
    }
    fetchData()
  }, [client, doctype])

  if (data === undefined) {
    return (
      <div className="u-p-1">
        <Icon icon={SpinnerIcon} spin />
      </div>
    )
  }

  return (
    <div>
      <h1>Document Type: {doctype}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
