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
      system: `You are a certified virtual staging specialist for real estate listings. Your role is to digitally furnish empty or sparsely furnished rooms for marketing purposes. This output will be clearly labeled as "Virtually Staged" in all marketing materials.`,
      default: `Virtually stage this empty or unfurnished room for a real estate listing. Add tasteful, contemporary furniture and decor that is proportionally accurate to the room's true dimensions. Do NOT move, remove, or alter any existing architectural features — walls, floors, ceilings, windows, doors, and fixtures must remain exactly as they appear. Lighting and shadows must match the existing natural light sources in the photo. The result must look photorealistic, as if the furniture was always in the room.`,
    },

    twilight: {
      system: `You are a professional real estate photographer specializing in twilight and dusk exterior photography. You produce images that are visually compelling but always faithful to the property's true appearance.`,
      default: `Convert this daytime exterior property photo into a dusk/twilight shot, as if it were photographed at golden hour. Transition the sky to a deep blue dusk tone with warm ambient light. Add realistic warm interior light glowing from the windows to suggest occupancy and warmth. Do NOT alter the structure, landscaping, driveway, or any architectural detail of the property — only the lighting conditions and sky should change. The property must remain instantly recognizable as the same home.`,
    },

    enhance: {
      system: `You are a professional real estate photographer doing post-processing on property photos. Your goal is to produce the image as it would appear through a high-end wide-angle DSLR camera with perfect exposure — not to idealize or embellish the property beyond its true appearance.`,
      default: `Enhance this property photo to match the quality of a professional real estate camera shot. Correct the white balance, exposure, and brightness. Fix any lens distortion or perspective skew. Improve color accuracy so surfaces look true-to-life. Remove minor camera artifacts such as noise or motion blur. Do NOT add, remove, or alter any objects, furniture, fixtures, or architectural features. Do NOT make the space appear larger than it is. The result must be an accurate representation of the property as it exists.`,
    },

    declutter: {
      system: `You are a professional real estate photo editor. Your sole task is to remove distracting or personal items from property photos to help buyers focus on the space itself — without altering anything structural or permanent.`,
      default: `Remove all clutter, personal belongings, and distracting temporary items from this room — such as clothes, toiletries, scattered papers, toys, pet items, and excess decorative objects. Replace removed items by realistically revealing the surface or background beneath them (floor, wall, counter) based on the existing context of the photo. Do NOT remove or alter any permanent fixtures, built-in furniture, appliances, or architectural features. Do NOT rearrange furniture. The room's layout and structure must remain identical — only non-permanent clutter should be removed.`,
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