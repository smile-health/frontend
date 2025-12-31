import {
  ProviderType,
  TClassificationPartnership,
  TPartnership,
} from '@/types/partnership';
import { TPartnershipOperator } from '@/types/partnership-operator';
import { TPartnershipVehicle } from '@/types/partnership-vehicle';
import ClassificationPartnership from './Detail/ClassificationPartnership';
import PartnerOperator from './Detail/PartnerOperator';
import PartnershipInfo from './Detail/PartnershipInfo';
import PartnerVehicle from './Detail/PartnerVehicle';
import ThirdPartyInfo from './Detail/ThirdPartyInfo';

type PartnershipDetailProps = {
  data?: TPartnership;
  vehicleData?: TPartnershipVehicle[];
  operatorData?: TPartnershipOperator[];
  classificationPartnership?: TClassificationPartnership[];
  isLoading: boolean;
};

const PartnershipDetail: React.FC<PartnershipDetailProps> = ({
  data,
  vehicleData,
  operatorData,
  classificationPartnership,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <PartnershipInfo data={data} isLoading={isLoading} />
      <ClassificationPartnership
        data={classificationPartnership}
        isLoading={isLoading}
      />
      {data?.providerType === ProviderType.TRANSPORTER && !isLoading && (
        <ThirdPartyInfo data={data} isLoading={isLoading} />
      )}
      <PartnerOperator data={operatorData} isLoading={isLoading} />
      <PartnerVehicle data={vehicleData} isLoading={isLoading} />
    </div>
  );
};

export default PartnershipDetail;
