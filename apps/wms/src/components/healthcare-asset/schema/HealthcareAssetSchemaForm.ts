import { TFunction } from 'i18next';
import * as yup from 'yup';

export const healthcareAssetFormSchema = (
  t: TFunction<['common', 'healthcareAsset']>
) => {
  return yup.object().shape({
    assetId: yup
      .string()
      .required(t('common:validation.required'))
      .min(3, ({ min }) => t('common:validation.char.min', { char: min })),
  });
};

export type HealthcareAssetFormData = yup.InferType<
  ReturnType<typeof healthcareAssetFormSchema>
>;
