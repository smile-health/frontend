import { TClassificationPartnership } from '@/types/partnership';
import { DataTable } from '@repo/ui/components/data-table';
import { useTranslation } from 'react-i18next';
import { columnsClassificationPartnerhipTable } from '../../constants/classificationPartnerhipTable';

type ClassificationPartnershipProps = {
  data?: TClassificationPartnership[];
  isLoading: boolean;
};

const ClassificationPartnership: React.FC<ClassificationPartnershipProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation(['common', 'partnership']);

  return (
    <div className="ui-p-4 ui-mt-6 ui-border ui-border-neutral-300 ui-rounded ui-space-y-4">
      <div className="ui-flex ui-justify-between ui-items-start ui-gap-4">
        <h5 className="ui-font-bold ui-text-dark-blue">
          {t('partnership:detail.classification_partnership_info')}
        </h5>
      </div>
      <DataTable
        data={data}
        columns={columnsClassificationPartnerhipTable(t)}
        isLoading={isLoading}
        className="ui-overflow-x-auto"
      />
    </div>
  );
};

export default ClassificationPartnership;
