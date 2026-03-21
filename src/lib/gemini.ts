import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// Use Gemini 3.1 Flash for fast, high-quality content generation
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7, // Creative but consistent
    topP: 0.8, // Focus on most likely outcomes
    maxOutputTokens: 1000 // Allow detailed responses
  }
})

/**
 * Generate Propel marketing copy using Gemini 3.1 Flash
 * @param {Object} propertyData - Property information
 * @param {string} propertyData.price - Property price
 * @param {string} propertyData.district - District/location
 * @param {number} propertyData.sqm - Square meters
 * @param {string[]} propertyData.special_features - Special features
 * @returns {Promise<Object>} Marketing copy for different platforms
 */
export async function generatePropelCopy(propertyData: any) {
  try {
    // Extract property details
    const { price, district, sqm, rooms, special_features = [] } = propertyData
    
    // Format special features for prompt
    const featuresText = special_features.length > 0 
      ? special_features.map((feature: any) => `• ${feature}`).join('\n')
      : 'Standard features'
    
    // District-specific vibes mapping
    const districtVibes = {
      'Vake': "Vake's prestigious hilltop location with panoramic city views and exclusive ambassador residences",
      'Saburtalo': "Saburtalo's convenient family-friendly atmosphere with excellent schools and parks",
      'Vera': "Vera's seaside charm with beach access and Mediterranean lifestyle",
      'Mtatsminda': "Mtatsminda's historic heart with cultural landmarks and traditional architecture",
      'Didube': "Didube's emerging investment area with modern developments and growth potential",
      'default': "Prime Baku location with excellent connectivity and urban amenities"
    }
    
    const locationVibe = (districtVibes as any)[district] || districtVibes['default']

    const prompt = `
You are a high-end real estate marketing expert based in Tbilisi, Georgia. Your specialty is creating compelling, culturally-aware property marketing that resonates with local buyers while maintaining international appeal.

PROPERTY DETAILS:
• Price: ${price} AZN
• District: ${district}
• Size: ${sqm} sqm
• Rooms: ${rooms}
• Special Features: ${featuresText}

LOCATION CONTEXT:
${locationVibe}

TASK: Generate three distinct marketing pieces for this property:

1. INSTAGRAM POST:
- Catchy, emoji-rich caption with lifestyle hook
- Include relevant hashtags like #TbilisiRealEstate, #BakuProperty, #GeorgiaRealEstate
- Maximum 300 characters for optimal engagement
- Focus on aspirational living experience

2. FACEBOOK POST:
- More detailed, community-focused content
- Highlight value proposition and location benefits
- Include neighborhood insights and local appeal
- Target families and investors
- 400-500 characters for Facebook algorithm

3. ZILLOW-STYLE DESCRIPTION:
- Professional, clean description
- Focus on technical specifications and investment potential
- Use real estate industry terminology
- Emphasize unique selling points
- Structured for property listing platforms

REQUIREMENTS:
- Return valid JSON only
- Use authentic Tbilisi real estate voice
- Incorporate local cultural references naturally
- Make each piece platform-appropriate
- Ensure all content is compelling and professional

Format your response as:
{
  "instagram": "caption text here",
  "facebook": "detailed post here", 
  "zillow_style": "professional description here"
}
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI')
    }
    
    return JSON.parse(jsonMatch[0])
    
  } catch (error) {
    console.error('Error generating Propel copy:', error)
    throw new Error('Failed to generate marketing copy')
  }
}

/**
 * Generate copy for multiple properties
 * @param {Array} properties - Array of property objects
 * @returns {Promise<Array>} Array of marketing copy objects
 */
export async function generateBatchCopy(properties: any[]) {
  try {
    const results = await Promise.allSettled(
      properties.map((property: any) => generatePropelCopy(property))
    )
    
    return results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
  } catch (error) {
    console.error('Error in batch copy generation:', error)
    throw new Error('Failed to generate batch marketing copy')
  }
}

/**
 * Validate property data before sending to AI
 * @param {Object} propertyData - Property information to validate
 * @returns {boolean} True if valid
 */
export function validatePropertyData(propertyData: any) {
  const { price, district, sqm, rooms } = propertyData
  
  if (!price || !district || !sqm || !rooms) {
    return false
  }
  
  if (isNaN(parseFloat(price)) || isNaN(parseFloat(sqm)) || isNaN(parseInt(rooms))) {
    return false
  }
  
  if (parseFloat(price) <= 0 || parseFloat(sqm) <= 0 || parseInt(rooms) <= 0) {
    return false
  }
  
  return true
}
