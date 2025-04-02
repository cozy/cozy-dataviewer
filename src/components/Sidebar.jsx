import React, { useEffect, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CategoriesIcon from 'cozy-ui/transpiled/react/Icons/Categories'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  genNavLink
} from 'cozy-ui/transpiled/react/Nav'
import UISidebar from 'cozy-ui/transpiled/react/Sidebar'
const NavLink = genNavLink(RouterLink)

const Sidebar = () => {
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

  console.log('result', result)

  return (
    <UISidebar>
      <Nav>
        {result.map(doctype => (
          <NavItem key={doctype}>
            <NavLink to="/">
              <NavIcon icon={CategoriesIcon} />
              <NavText>{doctype}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </UISidebar>
  )
}

export default Sidebar
