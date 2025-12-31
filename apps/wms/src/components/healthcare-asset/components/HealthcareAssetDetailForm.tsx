'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast';
import { useTranslation } from 'react-i18next';

import { updateHealthcareAsset } from '@/services/healthcare-asset';
import {
  UpdateHealthcareAssetInput,
  THealthcareAsset,
} from '@/types/healthcare-asset';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {
  HealthcareAssetFormData,
  healthcareAssetFormSchema,
} from '../schema/HealthcareAssetSchemaForm';
import { handleDefaultValueHealthcare } from '../utils/helper';
import HealthcareAssetFormInfo from './Form/HealthcareAssetFormInfo';
import HealthcareAssetInfo from './Detail/HealthcareAssetInfo';
import { isViewOnly } from '@/utils/getUserRole';

type HealthcareAssetDetailFormProps = {
  defaultValues?: THealthcareAsset;
};

const HealthcareAssetDetailForm = ({
  defaultValues,
}: HealthcareAssetDetailFormProps) => {
  const params = useParams();
  const { t } = useTranslation(['common', 'healthcareAsset']);

  const methods = useForm<any>({
    resolver: yupResolver(healthcareAssetFormSchema(t)),
    mode: 'onBlur',
    defaultValues: handleDefaultValueHealthcare(defaultValues),
  });

  const { handleSubmit } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: unknown) =>
      updateHealthcareAsset(
        Number(params?.id),
        data as UpdateHealthcareAssetInput
      ),
    onSuccess: () => {
      toast.success({
        description: t('common:message.success.update', {
          type: t('healthcareAsset:form.dongle_id.label')?.toLowerCase(),
        }),
      });
    },
    onError: handleAxiosError,
  });

  const onValid: SubmitHandler<HealthcareAssetFormData> = (formData) => {
    const commonPayload = {
      assetId: formData.assetId,
    };
    mutate(commonPayload);
  };

  const onInvalid = (errors: FieldErrors<HealthcareAssetFormData>) => {
    console.error('Validation Errors:', errors);
  };

  const assetName = defaultValues?.asset_type?.name?.toLowerCase() ?? '';
  const isScale = ['scale', 'timbangan'].some((keyword) =>
    assetName.includes(keyword)
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onValid, onInvalid)}>
        <div className="space-y-4">
          <div className="ui-p-4 ui-border ui-border-neutral-300 ui-rounded ui-space-y-4">
            <HealthcareAssetInfo data={defaultValues} isLoading={false} />
            {isScale && <HealthcareAssetFormInfo />}
          </div>
        </div>
        {isScale && !isViewOnly() && (
          <div className="ui-flex ui-mt-6 ui-justify-end">
            <Button
              id="btn-submit"
              type="submit"
              className="ui-w-[150px]"
              loading={isPending}
            >
              {t('common:save')}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default HealthcareAssetDetailForm;
