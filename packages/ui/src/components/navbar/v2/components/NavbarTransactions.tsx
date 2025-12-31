import React, { useMemo } from 'react'
import { NextRouter } from 'next/router'
import { HoverCardRoot } from '#components/hover-card'
import useSmileRouter from '#hooks/useSmileRouter'
import { hasPermission } from '#shared/permission/index'
import { useTranslation } from 'react-i18next'

import NavbarList from '../../components/NavbarList'
import {
  filterSingleMenus,
  isActiveSingleMenu,
} from '../../libs/navbar.commons'
import { TLeftMenu } from '../../libs/navbar.types'
import NavbarSubmenuBoxV2 from './NavbarSubmenuBoxV2'

const NavbarTransactions = () => {
  const { t } = useTranslation(['common', 'navbar'])
  const router = useSmileRouter()

  const rawMenus: TLeftMenu[] = useMemo(
    () => [
      {
        title: t('navbar:nav_transaction_list'),
        url: `/v5/transaction`,
        isHidden: !hasPermission('transaction-view'),
      },
    ],
    [t]
  )

  const leftSideMenus = useMemo(() => filterSingleMenus(rawMenus), [rawMenus])

  const title = t('navbar:nav_transaction')

  if (leftSideMenus.length <= 0) return null
  return (
    <HoverCardRoot defaultOpen={false} openDelay={100} closeDelay={100}>
      <NavbarList
        title={title}
        active={isActiveSingleMenu(router as NextRouter, leftSideMenus)}
        className="!ui-px-2"
      />
      <NavbarSubmenuBoxV2 leftSideMenus={leftSideMenus} />
    </HoverCardRoot>
  )
}

export default NavbarTransactions
