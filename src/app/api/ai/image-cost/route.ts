import { NextResponse } from 'next/server'
import { getImageGenerationCreditCost } from '@/lib/ai-cost'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cost = getImageGenerationCreditCost()
  return NextResponse.json({
    cost,
  })
}


