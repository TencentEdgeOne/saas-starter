import { generateImage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

interface GenerateImageBody {
  prompt?: string
  model?: string
}

const MODEL_CONFIG: Record<
  string,
  { providerModel: string; size: '512x512' | '768x768' | '1024x1024' }
> = {
  'gpt-image-1': {
    providerModel: 'gpt-image-1',
    size: '1024x1024'
  },
  'gpt-image-1-512': {
    providerModel: 'gpt-image-1',
    size: '512x512'
  },
  'gpt-image-1-768': {
    providerModel: 'gpt-image-1',
    size: '768x768'
  }
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
  const model = body.model || 'gpt-image-1'

  if (!prompt) {
    return jsonResponse({ message: 'Prompt is required.' }, 400)
  }

  const modelConfig = MODEL_CONFIG[model]

  if (!modelConfig) {
    return jsonResponse({ message: 'Unsupported model selected.' }, 400)
  }

  try {
    const openai = createOpenAI({
      apiKey: env.OPENAI_API_KEY
    })

    const result = await generateImage({
      model: openai.image(modelConfig.providerModel),
      prompt,
      size: modelConfig.size
    })

    const image =
      (result as any)?.image ??
      (Array.isArray((result as any)?.images)
        ? (result as any).images[0]
        : null)

    let dataUrl: string | null = null
    if (image?.toDataURL) {
      dataUrl = await image.toDataURL()
    } else if (image?.base64) {
      dataUrl = `data:image/png;base64,${image.base64}`
    } else if (image?.url) {
      dataUrl = image.url
    }

    if (!dataUrl) {
      throw new Error('Image result missing data.')
    }

    return jsonResponse({ imageUrl: dataUrl })
  } catch (error) {
    console.error('[ai/generate-image] error', error)
    return jsonResponse(
      {
        message: 'Failed to generate image.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    )
  }
}

