import { NextRequest, NextResponse } from 'next/server'
import { experimental_generateImage as generateImage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createDeepInfra } from '@ai-sdk/deepinfra'
import { createFireworks } from '@ai-sdk/fireworks'
import { createLuma } from '@ai-sdk/luma'
import { createTogetherAI } from '@ai-sdk/togetherai'
import { createXai } from '@ai-sdk/xai'
import { createFal } from '@ai-sdk/fal'
import { createReplicate } from '@ai-sdk/replicate'
import { withTokenRefresh } from '@/lib/auth-server'
import { getUserCreditsBalance, spendCredits } from '@/lib/credits'
import { getImageGenerationCreditCost } from '@/lib/ai-cost'

const modelProviderMap = {
  'dall-e-3': { provider: createOpenAI, envKey: 'OPENAI_API_KEY', envName: 'OpenAI' },
  'dall-e-2': { provider: createOpenAI, envKey: 'OPENAI_API_KEY', envName: 'OpenAI' },
  'imagen-3.0-generate-002': {
    provider: createGoogleGenerativeAI,
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    envName: 'Google',
  },
  'stabilityai/sdxl-turbo': { provider: createDeepInfra, envKey: 'DEEPINFRA_API_KEY', envName: 'DeepInfra' },
  'black-forest-labs/FLUX-1-dev': {
    provider: createDeepInfra,
    envKey: 'DEEPINFRA_API_KEY',
    envName: 'DeepInfra',
  },
  'black-forest-labs/FLUX-1-schnell': {
    provider: createDeepInfra,
    envKey: 'DEEPINFRA_API_KEY',
    envName: 'DeepInfra',
  },
  'accounts/fireworks/models/stable-diffusion-xl-1024-v1-0': {
    provider: createFireworks,
    envKey: 'FIREWORKS_API_KEY',
    envName: 'Fireworks',
  },
  'accounts/fireworks/models/playground-v2-1024px-aesthetic': {
    provider: createFireworks,
    envKey: 'FIREWORKS_API_KEY',
    envName: 'Fireworks',
  },
  'accounts/fireworks/models/flux-1-dev-fp8': {
    provider: createFireworks,
    envKey: 'FIREWORKS_API_KEY',
    envName: 'Fireworks',
  },
  'photon-1': { provider: createLuma, envKey: 'LUMA_API_KEY', envName: 'Luma' },
  'photon-flash-1': { provider: createLuma, envKey: 'LUMA_API_KEY', envName: 'Luma' },
  'stabilityai/stable-diffusion-xl-base-1.0': {
    provider: createTogetherAI,
    envKey: 'TOGETHER_AI_API_KEY',
    envName: 'TogetherAI',
  },
  'black-forest-labs/FLUX.1-dev': {
    provider: createTogetherAI,
    envKey: 'TOGETHER_AI_API_KEY',
    envName: 'TogetherAI',
  },
  'black-forest-labs/FLUX.1-schnell': {
    provider: createTogetherAI,
    envKey: 'TOGETHER_AI_API_KEY',
    envName: 'TogetherAI',
  },
  'grok-2-image': { provider: createXai, envKey: 'XAI_API_KEY', envName: 'xAI' },
  'fal-ai/flux/schnell': { provider: createFal, envKey: 'FAL_API_KEY', envName: 'FAL' },
  'stability-ai/stable-diffusion-3.5-medium': {
    provider: createReplicate,
    envKey: 'REPLICATE_API_TOKEN',
    envName: 'Replicate',
  },
  'stability-ai/stable-diffusion-3.5-large': {
    provider: createReplicate,
    envKey: 'REPLICATE_API_TOKEN',
    envName: 'Replicate',
  },
}

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

function createErrorResponse(error: string, message: string, status = 400, request: NextRequest) {
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

type ImageSize = '256x256' | '512x512' | '768x768' | '1024x1024' | '1024x1792' | '1792x1024'

interface ParsedRequestBody {
  prompt: string
  model: string
  size?: ImageSize
}

class AiRouteError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400
  ) {
    super(message)
    this.name = 'AiRouteError'
  }
}

export async function POST(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      if (!user?.id) {
        throw new AiRouteError('UNAUTHORIZED', 'User authentication required', 401)
      }

      const body = await safeParseJson(request)
      const { prompt, model, size } = parseRequestBody(body)
      const modelConfig = resolveModelConfig(model)
      const balanceSnapshot = await ensureCredits(user.id)
      const imageModel = buildImageModel(modelConfig, model)
      const generateOptions = buildGenerationOptions(imageModel, prompt, size)
      const imageResult = await generateImage(generateOptions)

      return await finalizeGeneration(user.id, imageResult, balanceSnapshot, request)
    } catch (error) {
      if (error instanceof AiRouteError) {
        return createErrorResponse(error.code, error.message, error.status, request)
      }

      const fullErrorMessage = buildExternalProviderErrorMessage(error)
      return createErrorResponse('GENERATION_FAILED', fullErrorMessage, 500, request)
    }
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  })
}

async function safeParseJson(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    throw new AiRouteError('INVALID_BODY', 'Invalid JSON body', 400)
  }
}

function parseRequestBody(body: any): ParsedRequestBody {
  const prompt = body?.prompt
  const model = body?.model
  const size = body?.size

  if (!prompt || typeof prompt !== 'string') {
    throw new AiRouteError('PROMPT_REQUIRED', 'Prompt is required', 400)
  }

  if (!model || typeof model !== 'string') {
    throw new AiRouteError('MODEL_REQUIRED', 'Model is required', 400)
  }

  if (size && !isValidSize(size)) {
    throw new AiRouteError('INVALID_SIZE', `Unsupported size option: ${size}`, 400)
  }

  return {
    prompt,
    model,
    size,
  }
}

function resolveModelConfig(model: string) {
  const config = modelProviderMap[model as keyof typeof modelProviderMap]
  if (!config) {
    throw new AiRouteError(
      'UNSUPPORTED_MODEL',
      `Unsupported model: ${model}. Available models: ${Object.keys(modelProviderMap).join(', ')}`,
      400
    )
  }
  return config
}

async function ensureCredits(userId: string) {
  const balance = await getUserCreditsBalance(userId)
  const cost = getImageGenerationCreditCost()

  if (balance < cost) {
    throw new AiRouteError(
      'INSUFFICIENT_CREDITS',
      `Not enough credits. Required: ${cost}, current balance: ${balance}`,
      402
    )
  }

  return balance
}

function buildImageModel(modelConfig: (typeof modelProviderMap)[keyof typeof modelProviderMap], model: string) {
  const apiKey = process.env[modelConfig.envKey]

  if (!apiKey) {
    throw new AiRouteError('API_KEY_NOT_CONFIGURED', `${modelConfig.envName} API key not configured`, 500)
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
    throw new AiRouteError('CREDITS_SPEND_FAILED', 'Failed to spend credits. Please try again later.', 500)
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


