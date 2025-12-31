import { TFunction } from 'i18next';
import * as yup from 'yup';

export const partnershipVehicleFormSchema = (
  t: TFunction<['common', 'partnershipVehicle']>
) => {
  return yup.object().shape({
    entity: yup
      .object({
        value: yup.number().moreThan(0, t('common:validation.required')),
        label: yup.string().required(t('common:validation.required')),
      })
      .required(t('common:validation.required')),
    vehicleType: yup.string().required(t('common:validation.required')),
    vehicleNumber: yup.string().required(t('common:validation.required')),
    capacityInKgs: yup.string().required(t('common:validation.required')),
  });
};

export type PartnershipVehicleFormData = yup.InferType<
  ReturnType<typeof partnershipVehicleFormSchema>
>;
