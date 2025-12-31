import { RenderDetailValue } from '@repo/ui/components/modules/RenderDetailValue';
import { useTranslation } from 'react-i18next';
import { THealthcareAsset } from '@/types/healthcare-asset';

type HealthcareAssetDetailProps = {
  data?: THealthcareAsset;
  isLoading: boolean;
};

const HealthcareAssetInfo: React.FC<HealthcareAssetDetailProps> = ({
  data,
  isLoading,
}) => {
  const { t: tHealthCare } = useTranslation('healthcareAsset');

  return (
    <RenderDetailValue
      loading={isLoading}
      data={[
        {
          label: tHealthCare('list.column.asset_type'),
          value: data?.asset_type?.name ?? '-',
        },
        {
          label: tHealthCare('list.column.model'),
          value: data?.asset_model?.name ?? '-',
        },
        {
          label: tHealthCare('list.column.manufacture'),
          value: data?.manufacture?.name ?? '-',
        },
        {
          label: tHealthCare('list.column.serial_number'),
          value: data?.serial_number ?? '-',
        },
        {
          label: tHealthCare('list.column.asset_status'),
          value: data?.status?.name,
        },
        {
          label: tHealthCare('list.column.working_status'),
          value: data?.working_status?.name,
        },
      ]}
    />
  );
};

export default HealthcareAssetInfo;
