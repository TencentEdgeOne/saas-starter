/**
 * AI Image Generation Models Configuration
 * Extracted from API route to comply with Next.js requirements
 */

import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createDeepInfra } from '@ai-sdk/deepinfra'
import { createFireworks } from '@ai-sdk/fireworks'
import { createLuma } from '@ai-sdk/luma'
import { createTogetherAI } from '@ai-sdk/togetherai'
import { createXai } from '@ai-sdk/xai'
import { createFal } from '@ai-sdk/fal'
import { createReplicate } from '@ai-sdk/replicate'

export const modelProviderMap = {
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

export type ImageSize = '256x256' | '512x512' | '768x768' | '1024x1024' | '1024x1792' | '1792x1024'

export interface ParsedRequestBody {
  prompt: string
  model: string
  size?: ImageSize
}

export class AiRouteError extends Error {
  constructor(
    public code: string,
    public messageKey: string,
    public status: number = 400,
    public params?: Record<string, string>
  ) {
    super(messageKey)
    this.name = 'AiRouteError'
  }
}
