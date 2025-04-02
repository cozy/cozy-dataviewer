import React, { useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'

export const Welcome = () => {
  const client = useClient()
  const [result, setResult] = useState()

  useEffect(() => {
    const fetchDoctypes = async () => {
      const response = await client
        .getStackClient()
        .fetchJSON('GET', '/data/_all_doctypes')
      setResult(response)
    }
    fetchDoctypes()
  }, [client])

  if (result === undefined) {
    return (
      <div className="u-p-1">
        <Icon icon={SpinnerIcon} spin />
      </div>
    )
  }

  return (
    <div className="u-p-1">
      <div className="u-ml-1">
        {result.map(doctype => (
          <Typography key={doctype} variant="h3">
            {doctype}
          </Typography>
        ))}
      </div>
    </div>
  )
}
