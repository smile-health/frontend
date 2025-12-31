import { useFeatureValue } from "@growthbook/growthbook-react"

export const useTransactionBeneficiaryConfigFlag = () => {
  const configBeneficiaryConsumption = useFeatureValue('transaction.beneficiary_consumption', {
    "global_protocol": false,
    "protocol": false,
    "material_activity_patient": false
  })

  return {
    showFieldProtocol: configBeneficiaryConsumption.global_protocol,
    showMenuProtocol: configBeneficiaryConsumption.protocol,
    showMaterialActivityPatient: configBeneficiaryConsumption.material_activity_patient,
  }
}