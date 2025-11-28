import { NextRequest, NextResponse } from 'next/server'
import { experimental_generateImage as generateImage } from 'ai'
import { withTokenRefresh } from '@/lib/auth-server'
import { getUserCreditsBalance, spendCredits } from '@/lib/credits'
import { getImageGenerationCreditCost } from '@/lib/ai-cost'
import { getRequestDictionary } from '@/lib/api-i18n'
import { modelProviderMap, ImageSize, ParsedRequestBody, AiRouteError } from '@/lib/ai-models-config'

function shouldAddCorsHeaders(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) return false
  return referer.includes('localhost:300') || referer.includes('127.0.0.1:300')
}

function getCorsHeaders(request: NextRequest) {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (shouldAddCorsHeaders(request)) {
    return {
      ...baseHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  }

  return baseHeaders
}

async function createErrorResponse(error: string, messageKey: string, status = 400, request: NextRequest, params?: Record<string, string>) {
  const dict = await getRequestDictionary(request)
  let message = (dict.ai?.api?.[messageKey as keyof NonNullable<typeof dict.ai.api>] as string) || messageKey
  
  // Replace placeholders like {cost}, {balance}, etc.
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value)
    })
  }
  
  return NextResponse.json(
    { error, message },
    {
      status,
      headers: getCorsHeaders(request),
    }
  )
}

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      if (!user?.id) {
        return await createErrorResponse('UNAUTHORIZED', 'userAuthenticationRequired', 401, request)
      }

      const body = await safeParseJson(request)
      const { prompt, model, size } = await parseRequestBody(body, request)
      
      // Log request parameters
      console.log('[AI Generate] Request params:', {
        model,
        size,
        promptLength: prompt?.length || 0
      })
      
      const modelConfig = await resolveModelConfig(model, request)
      const balanceSnapshot = await ensureCredits(user.id, request)
      const imageModel = await buildImageModel(modelConfig, model, request)
      const generateOptions = buildGenerationOptions(imageModel, prompt, size)
      
      // Log SDK options before calling generateImage
      console.log('[AI Generate] SDK options:', {
        model: model,
        size: generateOptions.size,
        hasSize: !!generateOptions.size,
        optionsKeys: Object.keys(generateOptions)
      })
      
      // Record start time before calling AI SDK
      const startTime = Date.now()
      const startTimeISO = new Date().toISOString()
      console.log('[AI Generate] Start time:', startTimeISO)
      
      const imageResult = await generateImage(generateOptions)
      
      // Record end time after AI generation completes
      const endTime = Date.now()
      const endTimeISO = new Date().toISOString()
      const duration = endTime - startTime
      console.log('[AI Generate] End time:', endTimeISO)
      console.log('[AI Generate] Duration:', `${duration}ms (${(duration / 1000).toFixed(2)}s)`)

      return await finalizeGeneration(user.id, imageResult, balanceSnapshot, request)
    } catch (error) {
      if (error instanceof AiRouteError) {
        return await createErrorResponse(error.code, error.messageKey, error.status, request, error.params)
      }

      // For external provider errors, return the original error message as-is
      // Don't try to localize AI model provider errors since they can be in any language
      const detailMessage = buildExternalProviderErrorMessage(error)
      
      return NextResponse.json(
        { error: 'GENERATION_FAILED', message: detailMessage },
        {
          status: 500,
          headers: getCorsHeaders(request),
        }
      )
    }
  })
}

async function safeParseJson(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    throw new AiRouteError('INVALID_BODY', 'invalidJsonBody', 400)
  }
}

async function parseRequestBody(body: any, request: NextRequest): Promise<ParsedRequestBody> {
  const prompt = body?.prompt
  const model = body?.model
  const size = body?.size

  if (!prompt || typeof prompt !== 'string') {
    throw new AiRouteError('PROMPT_REQUIRED', 'promptRequired', 400)
  }

  if (!model || typeof model !== 'string') {
    throw new AiRouteError('MODEL_REQUIRED', 'modelRequired', 400)
  }

  if (size && !isValidSize(size)) {
    throw new AiRouteError('INVALID_SIZE', 'unsupportedSize', 400, { size })
  }

  return {
    prompt,
    model,
    size,
  }
}

async function resolveModelConfig(model: string, request: NextRequest) {
  const config = modelProviderMap[model as keyof typeof modelProviderMap]
  if (!config) {
    const availableModels = Object.keys(modelProviderMap).join(', ')
    throw new AiRouteError(
      'UNSUPPORTED_MODEL',
      'unsupportedModel',
      400,
      { model, models: availableModels }
    )
  }
  return config
}

async function ensureCredits(userId: string, request: NextRequest) {
  const balance = await getUserCreditsBalance(userId)
  const cost = getImageGenerationCreditCost()

  if (balance < cost) {
    throw new AiRouteError(
      'INSUFFICIENT_CREDITS',
      'notEnoughCredits',
      402,
      { cost: cost.toString(), balance: balance.toString() }
    )
  }

  return balance
}

async function buildImageModel(modelConfig: (typeof modelProviderMap)[keyof typeof modelProviderMap], model: string, request: NextRequest) {
  const apiKey = process.env[modelConfig.envKey]

  if (!apiKey) {
    throw new AiRouteError('API_KEY_NOT_CONFIGURED', 'apiKeyNotConfigured', 500, { provider: modelConfig.envName })
  }

  const provider = modelConfig.provider({
    apiKey,
  })

  return (provider as any).image(model)
}

function buildGenerationOptions(imageModel: any, prompt: string, size?: ImageSize) {
  const options: any = {
    model: imageModel,
    prompt,
  }

  if (size) {
    options.size = size
  }

  return options
}

async function finalizeGeneration(
  userId: string,
  imageResult: Awaited<ReturnType<typeof generateImage>>,
  balanceSnapshot: number,
  request: NextRequest
) {
  const cost = getImageGenerationCreditCost()
  const spendSuccess = await spendCredits(userId, cost, 'AI image generation')
  if (!spendSuccess) {
    throw new AiRouteError('CREDITS_SPEND_FAILED', 'creditsSpendFailed', 500)
  }

  const imageUrl = `data:image/png;base64,${imageResult.image.base64}`

  return NextResponse.json(
    {
      imageUrl,
      images: [
        {
          url: imageUrl,
          base64: imageResult.image.base64,
        },
      ],
      credits: {
        cost,
        balance: Math.max(balanceSnapshot - cost, 0),
      },
    },
    {
      headers: getCorsHeaders(request),
    }
  )
}

function isValidSize(size: any): size is ImageSize {
  return ['256x256', '512x512', '768x768', '1024x1024', '1024x1792', '1792x1024'].includes(size)
}

function buildExternalProviderErrorMessage(error: any) {
  let errorMessage = 'Failed to generate image'

  if (error?.data?.error?.message) {
    errorMessage = error.data.error.message
  } else if (error?.data?.message) {
    errorMessage = error.data.message
  } else if (error?.error?.message) {
    errorMessage = error.error.message
  } else if (error?.message) {
    errorMessage = error.message
  } else if (error?.response?.data?.error?.message) {
    errorMessage = error.response.data.error.message
  } else if (error?.response?.data?.error) {
    errorMessage =
      typeof error.response.data.error === 'string'
        ? error.response.data.error
        : JSON.stringify(error.response.data.error)
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return `${errorMessage}${error?.cause ? ` (Cause: ${error.cause})` : ''}`
}


