import { experimental_generateImage as generateImage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createDeepInfra } from '@ai-sdk/deepinfra'
import { createFireworks } from '@ai-sdk/fireworks'
import { createLuma } from '@ai-sdk/luma'
import { createTogetherAI } from '@ai-sdk/togetherai'
import { createXAI } from '@ai-sdk/xai'
import { createFal } from '@ai-sdk/fal'
import { createReplicate } from '@ai-sdk/replicate'

interface GenerateImageBody {
  prompt?: string
  model?: string
  size?: string
}

// Model to provider mapping
const modelProviderMap: Record<
  string,
  {
    provider: any
    envKey: string
    envName: string
  }
> = {
  // OpenAI models
  'dall-e-3': { provider: createOpenAI, envKey: 'OPENAI_API_KEY', envName: 'OpenAI' },
  'dall-e-2': { provider: createOpenAI, envKey: 'OPENAI_API_KEY', envName: 'OpenAI' },
  
  // Google models
  'imagen-3.0-generate-002': { provider: createGoogleGenerativeAI, envKey: 'GOOGLE_GENERATIVE_AI_API_KEY', envName: 'Google' },
  
  // DeepInfra models
  'stabilityai/sdxl-turbo': { provider: createDeepInfra, envKey: 'DEEPINFRA_API_KEY', envName: 'DeepInfra' },
  'black-forest-labs/FLUX-1-dev': { provider: createDeepInfra, envKey: 'DEEPINFRA_API_KEY', envName: 'DeepInfra' },
  'black-forest-labs/FLUX-1-schnell': { provider: createDeepInfra, envKey: 'DEEPINFRA_API_KEY', envName: 'DeepInfra' },
  
  // Fireworks models
  'accounts/fireworks/models/stable-diffusion-xl-1024-v1-0': { provider: createFireworks, envKey: 'FIREWORKS_API_KEY', envName: 'Fireworks' },
  'accounts/fireworks/models/playground-v2-1024px-aesthetic': { provider: createFireworks, envKey: 'FIREWORKS_API_KEY', envName: 'Fireworks' },
  'accounts/fireworks/models/flux-1-dev-fp8': { provider: createFireworks, envKey: 'FIREWORKS_API_KEY', envName: 'Fireworks' },
  
  // Luma models
  'photon-1': { provider: createLuma, envKey: 'LUMA_API_KEY', envName: 'Luma' },
  'photon-flash-1': { provider: createLuma, envKey: 'LUMA_API_KEY', envName: 'Luma' },
  
  // TogetherAI models
  'stabilityai/stable-diffusion-xl-base-1.0': { provider: createTogetherAI, envKey: 'TOGETHER_AI_API_KEY', envName: 'TogetherAI' },
  'black-forest-labs/FLUX.1-dev': { provider: createTogetherAI, envKey: 'TOGETHER_AI_API_KEY', envName: 'TogetherAI' },
  'black-forest-labs/FLUX.1-schnell': { provider: createTogetherAI, envKey: 'TOGETHER_AI_API_KEY', envName: 'TogetherAI' },
  
  // xAI models
  'grok-2-image': { provider: createXAI, envKey: 'XAI_API_KEY', envName: 'xAI' },
  
  // FAL models
  'fal-ai/flux/dev': { provider: createFal, envKey: 'FAL_API_KEY', envName: 'FAL' },
  'fal-ai/flux/schnell': { provider: createFal, envKey: 'FAL_API_KEY', envName: 'FAL' },
  'fal-ai/flux-pro/v1.1': { provider: createFal, envKey: 'FAL_API_KEY', envName: 'FAL' },
  
  // Replicate models
  'stability-ai/stable-diffusion-3.5-medium': { provider: createReplicate, envKey: 'REPLICATE_API_TOKEN', envName: 'Replicate' },
  'stability-ai/stable-diffusion-3.5-large': { provider: createReplicate, envKey: 'REPLICATE_API_TOKEN', envName: 'Replicate' },
}

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store'
    }
  })

export async function onRequest(context: {
  request: Request
  env: Record<string, string>
}) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return jsonResponse({ message: 'Method Not Allowed' }, 405)
  }

  if (!env.OPENAI_API_KEY) {
    return jsonResponse(
      { message: 'Missing OPENAI_API_KEY environment variable.' },
      500
    )
  }

  let body: GenerateImageBody
  try {
    body = await request.json()
  } catch (error) {
    return jsonResponse({ message: 'Invalid JSON body.' }, 400)
  }

  const prompt = body.prompt?.trim()
  const model = body.model || 'dall-e-3'
  const size = body.size || '1024x1024'

  if (!prompt) {
    return jsonResponse({ message: 'Prompt is required.' }, 400)
  }

  const modelConfig = modelProviderMap[model]

  if (!modelConfig) {
    return jsonResponse({ message: 'Unsupported model selected.' }, 400)
  }

  // Check API key
  const apiKey = env[modelConfig.envKey]
  if (!apiKey) {
    return jsonResponse(
      { message: `${modelConfig.envName} API key not configured. Please set ${modelConfig.envKey} environment variable.` },
      500
    )
  }

  try {
    // Create provider instance
    const provider = modelConfig.provider({
      apiKey: apiKey
    })

    // Generate image
    const imageResult = await generateImage({
      model: provider.image(model),
      prompt: prompt,
      size: size as '256x256' | '512x512' | '768x768' | '1024x1024' | '1024x1792' | '1792x1024'
    })

    // Unified response format
    const imageUrl = `data:image/png;base64,${imageResult.image.base64}`

    return jsonResponse({ imageUrl: imageUrl })
  } catch (error) {
    console.error('[ai/generate-image] error', error)
    
    // Extract specific error information
    let errorMessage = 'Failed to generate image'
    
    if (error && typeof error === 'object') {
      if ('data' in error && error.data && typeof error.data === 'object') {
        if ('error' in error.data && error.data.error && typeof error.data.error === 'object' && 'message' in error.data.error) {
          errorMessage = String(error.data.error.message)
        } else if ('message' in error.data) {
          errorMessage = String(error.data.message)
        }
      } else if ('error' in error && error.error && typeof error.error === 'object' && 'message' in error.error) {
        errorMessage = String(error.error.message)
      } else if ('message' in error) {
        errorMessage = String(error.message)
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    return jsonResponse(
      {
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    )
  }
}

