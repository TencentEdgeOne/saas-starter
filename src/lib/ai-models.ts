// Model to supported size mapping configuration
// Based on AI SDK documentation and model specifications
export const modelSizeMapping: Record<string, string[]> = {
  // Fireworks Models
  'accounts/fireworks/models/stable-diffusion-xl-1024-v1-0': ['1024x1024'],
  'accounts/fireworks/models/playground-v2-1024px-aesthetic': ['1024x1024'],
  'accounts/fireworks/models/flux-1-dev-fp8': ['1024x1024'],
  
  // FAL Models
  'fal-ai/flux/dev': ['1024x1024'],
  'fal-ai/flux/schnell': ['256x256'],
  'fal-ai/flux-pro/v1.1': ['1024x1024'],
  
  // OpenAI Models - Based on OpenAI API documentation
  'dall-e-3': ['1024x1024', '1024x1792', '1792x1024'],
  'dall-e-2': ['256x256', '512x512', '1024x1024'],
  
  // Replicate Models - Based on Replicate API specifications
  'stability-ai/stable-diffusion-3.5-medium': ['512x512', '768x768', '1024x1024'],
  'stability-ai/stable-diffusion-3.5-large': ['512x512', '768x768', '1024x1024'],
  
  // Google Models - Based on Google AI SDK specifications
  'imagen-3.0-generate-002': ['1024x1024', '512x512'],
  
  // DeepInfra Models - Based on DeepInfra API documentation
  'stabilityai/sdxl-turbo': ['512x512', '1024x1024'],
  'black-forest-labs/FLUX-1-dev': ['1024x1024'],
  'black-forest-labs/FLUX-1-schnell': ['1024x1024'],
  
  // Luma Models - Based on Luma AI SDK specifications
  'photon-1': ['1024x1024', '512x512'],
  'photon-flash-1': ['1024x1024', '512x512'],
  
  // TogetherAI Models - Based on TogetherAI API specifications
  'stabilityai/stable-diffusion-xl-base-1.0': ['1024x1024', '512x512'],
  'black-forest-labs/FLUX.1-dev': ['1024x1024'],
  'black-forest-labs/FLUX.1-schnell': ['1024x1024'],
  
  // xAI Models - Based on xAI API specifications
  'grok-2-image': ['1024x1024', '512x512'],
}

// Get supported size list for a model
export function getSupportedSizes(model: string): string[] {
  return modelSizeMapping[model] || ['1024x1024'] // Default return 1024x1024
}

// Check if a model supports a specific size
export function isSizeSupported(model: string, size: string): boolean {
  const supportedSizes = getSupportedSizes(model)
  return supportedSizes.includes(size)
}

// Get default size for a model (first supported size)
export function getDefaultSize(model: string): string {
  const supportedSizes = getSupportedSizes(model)
  return supportedSizes[0] || '1024x1024'
}

// Model options list
export const modelOptions = [
  { value: 'fal-ai/flux/schnell', label: 'FAL/FLUX Schnell' },
  { value: 'accounts/fireworks/models/stable-diffusion-xl-1024-v1-0', label: 'Fireworks/Stable Diffusion XL 1024 V1.0' },  
  // OpenAI Models (enabled)
  { value: 'dall-e-3', label: 'OpenAI/DALL-E 3' },
  { value: 'dall-e-2', label: 'OpenAI/DALL-E 2' },
  
  // Replicate Models (enabled) - older but stable versions
  { value: 'stability-ai/stable-diffusion-3.5-medium', label: 'Replicate/Stable Diffusion 3.5 Medium' },
  { value: 'stability-ai/stable-diffusion-3.5-large', label: 'Replicate/Stable Diffusion 3.5 Large' },
  
  // Google Models (enabled)
  { value: 'imagen-3.0-generate-002', label: 'Google/Imagen 3.0 Generate 002' },
  
  // DeepInfra Models (enabled)
  { value: 'stabilityai/sdxl-turbo', label: 'DeepInfra/Stable Diffusion XL Turbo' },
  { value: 'black-forest-labs/FLUX-1-dev', label: 'DeepInfra/FLUX 1 Dev' },
  { value: 'black-forest-labs/FLUX-1-schnell', label: 'DeepInfra/FLUX 1 Schnell' },
  
  // Luma Models (enabled)
  { value: 'photon-1', label: 'Luma/Photon 1' },
  { value: 'photon-flash-1', label: 'Luma/Photon Flash 1' },
  
  // TogetherAI Models (enabled)
  { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'TogetherAI/Stable Diffusion XL Base 1.0' },
  { value: 'black-forest-labs/FLUX.1-dev', label: 'TogetherAI/FLUX.1 Dev' },
  
  // xAI Models (enabled)
  { value: 'grok-2-image', label: 'xAI/Grok 2 Image' },
]

