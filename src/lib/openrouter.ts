const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!key) throw new Error('VITE_OPENROUTER_API_KEY is not set in your .env file.')
  return key
}

async function callOpenRouter(
  model: string,
  messages: any[],
  extraBody: Record<string, any> = {}
): Promise<any> {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, ...extraBody }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`)
  }

  return response.json()
}

// ── Helper ────────────────────────────────────────────────────────────────────

function extractImageUrl(data: any): string {
  const message = data?.choices?.[0]?.message

  // Primary: OpenRouter returns images in message.images[]
  if (Array.isArray(message?.images) && message.images.length > 0) {
    const url = message.images[0]?.image_url?.url
    if (url) return url
  }

  // Fallback 1: some responses nest image inside content[]
  const content = message?.content
  if (Array.isArray(content)) {
    const part = content.find((p: any) => p.type === 'image_url')
    if (part?.image_url?.url) return part.image_url.url
  }

  // Fallback 2: content is already a base64 data URL string
  if (typeof content === 'string' && content.startsWith('data:')) return content

  throw new Error('No image found in response.')
}

// ── Image Generation ──────────────────────────────────────────────────────────

export async function generateImage(prompt: string): Promise<string> {
  const data = await callOpenRouter(
    'google/gemini-3.1-flash-image-preview',
    [{ role: 'user', content: prompt }],
    { modalities: ['image', 'text'] }
  )
  return extractImageUrl(data)
}

// ── Image Transformation ──────────────────────────────────────────────────────

export type TransformationType = 'staging' | 'twilight' | 'enhance' | 'declutter'

interface TransformationOptions {
  type: TransformationType
  prompt?: string
  imageUri: string
}

export async function transformImage(options: TransformationOptions): Promise<string> {
  const { type, prompt: userPrompt, imageUri } = options

  const presets: Record<TransformationType, { system: string; default: string }> = {
    staging: {
      system: 'Expert interior designer.',
      default: 'Virtually stage this room with high-end, modern, minimalist furniture. Ensure lighting and shadows are realistic.',
    },
    twilight: {
      system: 'Real estate photographer specializing in twilight shots.',
      default: 'Convert this daytime property photo into a beautiful twilight/golden hour shot. Add warm interior lights and a deep blue sunset sky.',
    },
    enhance: {
      system: 'Professional architectural photographer.',
      default: 'Enhance this property photo. Improve dynamic range, correct lens distortion, and make colors pop with a luxury aesthetic.',
    },
    declutter: {
      system: 'Professional real estate editor.',
      default: 'Remove all clutter, personalized items, and messy objects from this room. Create a clean, minimalist, showroom-ready look.',
    },
  }

  const { system, default: defaultPrompt } = presets[type]
  const finalPrompt = userPrompt || defaultPrompt

  const data = await callOpenRouter(
    'google/gemini-3.1-flash-image-preview',
    [
      {
        role: 'user',
        content: [
          { type: 'text', text: `${system} ${finalPrompt}` },
          { type: 'image_url', image_url: { url: imageUri } },
        ],
      },
    ],
    { modalities: ['image', 'text'] }
  )

  return extractImageUrl(data)
}

// ── Listing Description ───────────────────────────────────────────────────────

interface ListingDetails {
  address: string
  bedrooms: string | number
  bathrooms: string | number
  sqft: string | number
  price: string | number
  highlights: string[]
}

export async function generateListingDescription(listingDetails: ListingDetails): Promise<string> {
  const { address, bedrooms, bathrooms, sqft, price, highlights = [] } = listingDetails
  const highlightText = highlights.length > 0 ? `Key highlights: ${highlights.join(', ')}.` : ''

  const data = await callOpenRouter(
    'google/gemini-flash-1-5',
    [
      {
        role: 'system',
        content: 'You are an expert real estate copywriter for a platform called Propel. Write compelling, professional, and concise property listing descriptions that appeal to buyers. Always be factual, never invent details not provided.',
      },
      {
        role: 'user',
        content: `Write a compelling property listing description for the following home:

Address: ${address}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Square Footage: ${sqft} sqft
Asking Price: $${Number(price).toLocaleString()}
${highlightText}

Write 2–3 paragraphs. Be professional, engaging, and factual. Do not invent any details not provided above.`,
      },
    ]
  )

  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('No content returned from listing description model.')
  return typeof text === 'string' ? text : text?.[0]?.text ?? String(text)
}

// ── Social Caption ────────────────────────────────────────────────────────────

export async function generateSocialCaption(
  listingDetails: ListingDetails,
  platform: 'instagram' | 'facebook' | 'linkedin'
): Promise<string> {
  const { address, bedrooms, bathrooms, sqft, price, highlights = [] } = listingDetails
  const highlightText = highlights.length > 0 ? `Key highlights: ${highlights.join(', ')}.` : ''

  const data = await callOpenRouter(
    'google/gemini-flash-1-5',
    [
      {
        role: 'system',
        content: 'You are a social media expert for Propel, a real estate marketing platform. Write engaging, platform-appropriate captions for property listings. Use relevant hashtags. Match the tone to the platform: casual and visual for Instagram, community-focused for Facebook, professional for LinkedIn.',
      },
      {
        role: 'user',
        content: `Write a ${platform} caption for this property listing:

Address: ${address}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Square Footage: ${sqft} sqft
Asking Price: $${Number(price).toLocaleString()}
${highlightText}

Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}
Include relevant hashtags. Keep the tone appropriate for ${platform}.`,
      },
    ]
  )

  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('No content returned from social caption model.')
  return typeof text === 'string' ? text : text?.[0]?.text ?? String(text)
}