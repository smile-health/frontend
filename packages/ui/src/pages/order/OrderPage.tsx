'use client'

import { useEffect } from 'react'
import { USER_ROLE } from '#constants/roles'
import useSmileRouter from '#hooks/useSmileRouter'
import { getUserStorage } from '#utils/storage/user'

const OrderPage = () => {
  const router = useSmileRouter()
  const userData = getUserStorage()
  const isSuperAdmin = [USER_ROLE.SUPERADMIN, USER_ROLE.ADMIN].includes(
    userData?.role as USER_ROLE
  )

  const url = isSuperAdmin ? 'all' : 'vendor'

  useEffect(() => {
    router.replace(`/v5/order/${url}`).catch((error) => {
      console.error('Failed to redirect:', error)
    })
  }, [router, url])

  return null
}

export default OrderPage
