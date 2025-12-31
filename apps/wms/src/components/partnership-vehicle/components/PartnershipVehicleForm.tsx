'use client';

import { handleAxiosError } from '@/utils/handleAxiosError';
import useWmsRouter from '@/utils/hooks/useWmsRouter';
import { getUserStorage } from '@/utils/storage/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast';
import { useTranslation } from 'react-i18next';

import {
  createPartnershipVehicle,
  updatePartnershipVehicle,
} from '@/services/partnership-vehicle';
import {
  CreatePartnershipVehicleInput,
  TPartnershipVehicle,
  UpdatePartnershipVehicleInput,
} from '@/types/partnership-vehicle';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {
  PartnershipVehicleFormData,
  partnershipVehicleFormSchema,
} from '../schema/PartnershipVehicleSchemaForm';
import { handleDefaultValuePartnershipVehicle } from '../utils/helper';
import PartnershipVehicleFormInfo from './Form/PartnershipVehicleFormInfo';

type PartnershipVehicleFormProps = {
  defaultValues?: TPartnershipVehicle;
};

const PartnershipVehicleForm = ({
  defaultValues,
}: PartnershipVehicleFormProps) => {
  const router = useWmsRouter();
  const user = getUserStorage();

  const params = useParams();
  const { t, i18n: locale } = useTranslation(['common', 'partnershipVehicle']);
  const language = locale.language;

  const isEdit = Boolean(params?.id);

  const methods = useForm<any>({
    resolver: yupResolver(partnershipVehicleFormSchema(t)),
    mode: 'onBlur',
    defaultValues: handleDefaultValuePartnershipVehicle(defaultValues),
  });

  const { handleSubmit } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: unknown) =>
      isEdit
        ? updatePartnershipVehicle(
            Number(params?.id),
            data as UpdatePartnershipVehicleInput
          )
        : createPartnershipVehicle(data as CreatePartnershipVehicleInput),
    onSuccess: () => {
      toast.success({
        description: t(
          isEdit
            ? 'common:message.success.update'
            : 'common:message.success.create',
          {
            type: t('partnershipVehicle:list.list')?.toLowerCase(),
          }
        ),
      });
      router.push(`/${language}/partnership-vehicle`);
    },
    onError: handleAxiosError,
  });

  const onValid: SubmitHandler<PartnershipVehicleFormData> = (formData) => {
    const commonPayload = {
      ...(isEdit
        ? { updatedBy: user?.user_uuid }
        : { createdBy: user?.user_uuid }),
      entityId: formData?.entity?.value,
      capacityInKgs: Number(formData.capacityInKgs),
      vehicleNumber: formData.vehicleNumber.trim(),
      vehicleType: formData.vehicleType,
    };
    mutate(commonPayload);
  };

  const onInvalid = (errors: FieldErrors<PartnershipVehicleFormData>) => {
    console.error('Validation Errors:', errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onValid, onInvalid)}>
        <div className="ui-w-full ui-space-y-6 ui-max-w-form ui-mx-auto">
          <PartnershipVehicleFormInfo />
          <div className="ui-flex ui-justify-end">
            <div className="ui-grid ui-grid-cols-2 ui-w-[300px] ui-gap-2">
              <Button
                id="btn-back"
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('common:back')}
              </Button>
              <Button id="btn-submit" type="submit" loading={isPending}>
                {t('common:save')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default PartnershipVehicleForm;
