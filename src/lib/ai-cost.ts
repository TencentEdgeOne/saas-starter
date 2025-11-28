export function getImageGenerationCreditCost(): number {
  return (
    Number(process.env.AI_IMAGE_CREDIT_COST ?? process.env.NEXT_PUBLIC_AI_IMAGE_CREDIT_COST ?? '1') ||
    1
  )
}


