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

/**
 * Environment Variables Configuration:
 * 
 * For EdgeOne Pages deployment:
 * - Configure environment variables in EdgeOne Pages console
 * - Go to Settings > Environment Variables
 * - Add the required API keys for the models you want to use
 * 
 * For local development:
 * - Create a .env.local file in the project root
 * - Add the required API keys (see modelProviderMap below for envKey names)
 * 
 * Required environment variables:
 * - OPENAI_API_KEY: For OpenAI DALL-E models
 * - FAL_API_KEY: For FAL AI FLUX models
 * - FIREWORKS_API_KEY: For Fireworks models
 * - REPLICATE_API_TOKEN: For Replicate models
 * - GOOGLE_GENERATIVE_AI_API_KEY: For Google Imagen models
 * - DEEPINFRA_API_KEY: For DeepInfra models
 * - LUMA_API_KEY: For Luma models
 * - TOGETHER_AI_API_KEY: For TogetherAI models
 * - XAI_API_KEY: For xAI models
 */

// Model to provider mapping
const modelProviderMap = {
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
  'grok-2-image': { provider: createXai, envKey: 'XAI_API_KEY', envName: 'xAI' },
  
  // FAL models - Use exact model names as defined in @ai-sdk/fal types
  'fal-ai/flux/schnell': { provider: createFal, envKey: 'FAL_API_KEY', envName: 'FAL' },
  
  // Replicate models
  'stability-ai/stable-diffusion-3.5-medium': { provider: createReplicate, envKey: 'REPLICATE_API_TOKEN', envName: 'Replicate' },
  'stability-ai/stable-diffusion-3.5-large': { provider: createReplicate, envKey: 'REPLICATE_API_TOKEN', envName: 'Replicate' },
}

// Check if CORS headers should be added
function shouldAddCorsHeaders(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) return false
  
  // Check if it's local development environment
  return referer.includes('localhost:300') || referer.includes('127.0.0.1:300')
}

// Get CORS headers
function getCorsHeaders(request: NextRequest) {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  if (shouldAddCorsHeaders(request)) {
    return {
      ...baseHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }
  
  return baseHeaders
}

// Helper to create consistent error responses
function createErrorResponse(error: string, message: string, status = 400, request: NextRequest) {
  return NextResponse.json(
    { error, message },
    {
      status: status,
      headers: getCorsHeaders(request)
    }
  )
}

// 强制动态渲染
export const dynamic = 'force-dynamic'

// 设置 API Route 的最大执行时间为 30 秒（与前端超时时间一致）
// Next.js 默认超时时间根据部署环境不同，通常为 10-60 秒
// 这里设置为 30 秒，确保与前端超时时间匹配
export const maxDuration = 30 // 单位：秒

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { prompt, model, size } = body

    if (!prompt) {
      return createErrorResponse('PROMPT_REQUIRED', 'Prompt is required', 400, request)
    }

    const modelConfig = modelProviderMap[model as keyof typeof modelProviderMap]
    if (!modelConfig) {
      return createErrorResponse('UNSUPPORTED_MODEL', `Unsupported model: ${model}. Available models: ${Object.keys(modelProviderMap).join(', ')}`, 400, request)
    }

    // Check API key
    // Note: Configure environment variables in EdgeOne Pages console under Settings > Environment Variables
    // For local development, create .env.local file with the required API keys
    const apiKey = process.env[modelConfig.envKey];

    if (!apiKey) {
      return createErrorResponse(
        'API_KEY_NOT_CONFIGURED',
        `${modelConfig.envName} API key not configured`,
        500,
        request
      )
    }

    // Generate image
    // Create provider instance with API key
    const provider = modelConfig.provider({
      apiKey: apiKey
    })
    
    // For FAL, use the model name as-is (SDK expects full "fal-ai/..." format)
    // The @ai-sdk/fal types show models like 'fal-ai/flux/schnell', not 'fal/flux/schnell'
    let modelNameForProvider = model
    
    // For Google Imagen models, use the model name as-is
    if (model.startsWith('imagen-')) {
      modelNameForProvider = model // Keep as-is: 'imagen-3.0-generate-002', etc.
    }
    
    // Get image model from provider - use type assertion for compatibility
    const imageModel = (provider as any).image(modelNameForProvider)
    
    // For FAL models, build the generateImage options
    // FAL models support size parameter, but we need to ensure it's in the correct format
    const generateImageOptions: any = {
      model: imageModel,
      prompt: prompt,
    }
    
    // Add size parameter if provided and model supports it
    if (size) {
      generateImageOptions.size = size as '256x256' | '512x512' | '768x768' | '1024x1024' | '1024x1792' | '1792x1024'
    }
    
    const imageResult = await generateImage(generateImageOptions)

    // Unified response format - keep compatibility with frontend
    const imageUrl = `data:image/png;base64,${imageResult.image.base64}`
    
    return NextResponse.json(
      {
        imageUrl: imageUrl,
        // Also include demo format for compatibility
        images: [{
          url: imageUrl,
          base64: imageResult.image.base64,
        }],
      },
      {
        headers: getCorsHeaders(request)
      }
    )
  } catch (error: any) {
    // Extract specific error information
    let errorMessage = 'Failed to generate image'
    
    // Try multiple error formats (Google API specific)
    if (error?.data?.error?.message) {
      errorMessage = error.data.error.message
    } else if (error?.data?.message) {
      errorMessage = error.data.message
    } else if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (error?.message) {
      errorMessage = error.message
    } else if (error?.response?.data?.error?.message) {
      // Google API error format
      errorMessage = error.response.data.error.message
    } else if (error?.response?.data?.error) {
      // Google API error format (alternative)
      errorMessage = typeof error.response.data.error === 'string' 
        ? error.response.data.error 
        : JSON.stringify(error.response.data.error)
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    // Add more context for debugging
    const fullErrorMessage = `${errorMessage}${error?.cause ? ` (Cause: ${error.cause})` : ''}`
    
    return createErrorResponse('GENERATION_FAILED', fullErrorMessage, 500, request)
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request)
  })
}

