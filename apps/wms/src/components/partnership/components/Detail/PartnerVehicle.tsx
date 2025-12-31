import { useTranslation } from 'react-i18next';
import { DataTable } from '@repo/ui/components/data-table';
import { columnsVehicleTable } from '../../constants/vehicleTable';
import { TPartnershipVehicle } from '@/types/partnership-vehicle';

type PartnerVehicleProps = {
  data?: TPartnershipVehicle[];
  isLoading: boolean;
};

const PartnerVehicle: React.FC<PartnerVehicleProps> = ({ data, isLoading }) => {
  const { t } = useTranslation(['common', 'partnership']);

  return (
    <div className="ui-p-4 ui-mt-6 ui-border ui-border-neutral-300 ui-rounded ui-space-y-4">
      <div className="ui-flex ui-justify-between ui-items-start ui-gap-4">
        <h5 className="ui-font-bold ui-text-dark-blue">
          {t('partnership:detail.vehicle_info')}
        </h5>
      </div>
      <DataTable
        data={data}
        columns={columnsVehicleTable(t)}
        isLoading={isLoading}
        className="ui-overflow-x-auto"
        emptyDescription="No registered vehicle available"
      />
    </div>
  );
};

export default PartnerVehicle;
