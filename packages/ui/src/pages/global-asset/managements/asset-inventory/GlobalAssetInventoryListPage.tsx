'use client'

import { useRouter } from 'next/navigation'
import useSmileRouter from '#hooks/useSmileRouter'
import AssetInventoryListPage from '#pages/asset-inventory/list/AssetInventoryListPage'
import { hasPermission } from '#shared/permission/index'
import { useTranslation } from 'react-i18next'

import GlobalAssetManagementsLayout from '../../GlobalAssetManagementsLayout'
import { globalAssetManagementsChildTabs } from '../managements.constants'

const GlobalAssetInventoryListPage = () => {
  hasPermission('global-asset-managements-menu')

  const {
    i18n: { language, t },
  } = useTranslation(['assetInventory'])
  const router = useSmileRouter()

  const childTabs = globalAssetManagementsChildTabs(
    t,
    router.getAsLinkGlobal
  )?.filter((v) => v?.isShow)

  return (
    <GlobalAssetManagementsLayout
      title={t('assetInventory:asset_inventory_list')}
      showButtonCreate={hasPermission('asset-inventory-mutate')}
      buttonCreate={{
        label: t('assetInventory:create_inventory_asset'),
        onClick: () =>
          router.pushGlobal(
            `/v5/global-asset/management/operational-asset-inventory/create`
          ),
      }}
      childTabs={childTabs}
    >
      <AssetInventoryListPage isGlobal />
    </GlobalAssetManagementsLayout>
  )
}

export default GlobalAssetInventoryListPage
