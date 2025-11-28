import { NextRequest, NextResponse } from 'next/server'
import { modelOptions } from '@/lib/ai-models'
import { modelProviderMap } from '@/lib/ai-models-config'

export const dynamic = 'force-dynamic'

/**
 * GET /api/ai/models
 * Returns list of AI models with their configuration status
 * Only returns models that have API keys configured
 */
export async function GET(request: NextRequest) {
  try {
    // Check which models have API keys configured
    const availableModels = modelOptions
      .map(option => {
        const modelConfig = modelProviderMap[option.value as keyof typeof modelProviderMap]
        if (!modelConfig) {
          return null
        }

        const apiKey = process.env[modelConfig.envKey]
        const isConfigured = !!apiKey && apiKey.trim() !== ''

        return {
          value: option.value,
          label: option.label,
          configured: isConfigured,
        }
      })
      .filter(model => model !== null) as Array<{
      value: string
      label: string
      configured: boolean
    }>

    // Return all models (configured and unconfigured) so frontend can show them all
    // but only return configured ones in the "available" array
    const configuredModels = availableModels.filter(m => m.configured)

    return NextResponse.json({
      models: availableModels, // All models with their configuration status
      available: configuredModels.map(m => m.value), // Only configured model values
    })
  } catch (error) {
    console.error('[AI Models API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

