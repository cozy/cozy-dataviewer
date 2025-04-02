import React from 'react'
import { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Right from 'cozy-ui/transpiled/react/Icons/Right'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import Typography from 'cozy-ui/transpiled/react/Typography'


export const Contacts = () => {
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
        <Typography variant="h3">Doctypes</Typography>
      </div>
      <List
        className="u-m-1"
        subheader={<ListSubheader>Doctypes</ListSubheader>}
      >
        {result.map(doctype => (
          <ListItem key={doctype._id} button>
            <ListItemText primary={doctype} />
            <ListItemIcon>
              <Icon icon={Right} />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </div>
  )
}
