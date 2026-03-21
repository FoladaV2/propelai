import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// Model configurations
const FLASH_MODEL = 'gemini-1.5-flash'
const VISION_MODEL = 'gemini-1.5-flash'

export interface PropertyDetails {
  title: string
  address: string
  price: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  propertyType: string
  description?: string
}

export interface AIResponse {
  enhancedImagePrompt: string
  instagramCaption: string
  linkedInBlurb: string
}

export class AIService {
  private flashModel = genAI.getGenerativeModel({ model: FLASH_MODEL })
  private visionModel = genAI.getGenerativeModel({ model: VISION_MODEL })

  /**
   * Enhance property image by generating a prompt for architectural photography
   */
  async enhancePropertyImage(imageFile: File): Promise<string> {
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(imageFile)
      
      const prompt = `
        Analyze this property image and provide a detailed prompt to enhance it into professional architectural photography.
        Focus on:
        - Professional lighting techniques
        - Architectural composition
        - Real estate photography best practices
        - Interior/exterior enhancement suggestions
        - Color grading and atmosphere improvements
        
        Provide the prompt as if you're instructing a professional photographer or AI image generator.
        Keep it concise but comprehensive (max 200 words).
      `

      const result = await this.visionModel.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image.split(',')[1], // Remove data:image/...;base64, prefix
            mimeType: imageFile.type
          }
        }
      ])

      return result.response.text()
    } catch (error) {
      console.error('Error enhancing image:', error)
      throw new Error('Failed to enhance image with AI')
    }
  }

  /**
   * Generate marketing content based on property details and images
   */
  async generateMarketingContent(
    propertyDetails: PropertyDetails,
    imageFiles: File[]
  ): Promise<{ instagramCaption: string; linkedInBlurb: string }> {
    try {
      const propertyInfo = `
        Property Details:
        - Title: ${propertyDetails.title}
        - Address: ${propertyDetails.address}
        - Price: ${propertyDetails.price}
        - Bedrooms: ${propertyDetails.bedrooms}
        - Bathrooms: ${propertyDetails.bathrooms}
        - Square Footage: ${propertyDetails.squareFootage}
        - Type: ${propertyDetails.propertyType}
        ${propertyDetails.description ? `- Description: ${propertyDetails.description}` : ''}
      `

      // Generate Instagram caption
      const instagramPrompt = `
        Based on these property details and images, create a viral-style Instagram caption for real estate marketing.
        
        ${propertyInfo}
        
        Requirements:
        - Engaging and attention-grabbing opening
        - Use relevant emojis strategically
        - Include compelling property highlights
        - Add a call-to-action
        - Use popular real estate hashtags
        - Keep under 300 characters for optimal engagement
        - Make it feel authentic and exciting
      `

      // Generate LinkedIn blurb
      const linkedInPrompt = `
        Based on these property details and images, create a professional LinkedIn post for real estate professionals.
        
        ${propertyInfo}
        
        Requirements:
        - Professional and sophisticated tone
        - Highlight investment potential and market value
        - Include relevant market insights
        - Target real estate investors and professionals
        - Add strategic hashtags for LinkedIn
        - Keep under 500 characters
        - Focus on business value and opportunity
      `

      // Prepare images for analysis
      const imageParts = await Promise.all(
        imageFiles.map(async (file) => {
          const base64Image = await this.fileToBase64(file)
          return {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: file.type
            }
          }
        })
      )

      // Generate Instagram caption
      const instagramResult = await this.flashModel.generateContent([
        instagramPrompt,
        ...imageParts
      ])

      // Generate LinkedIn blurb
      const linkedInResult = await this.flashModel.generateContent([
        linkedInPrompt,
        ...imageParts
      ])

      return {
        instagramCaption: instagramResult.response.text(),
        linkedInBlurb: linkedInResult.response.text()
      }
    } catch (error) {
      console.error('Error generating marketing content:', error)
      throw new Error('Failed to generate marketing content with AI')
    }
  }

  /**
   * Complete AI processing for property listing
   */
  async processPropertyListing(
    propertyDetails: PropertyDetails,
    imageFiles: File[]
  ): Promise<AIResponse> {
    try {
      // Process first image for enhancement prompt
      const enhancedImagePrompt = await this.enhancePropertyImage(imageFiles[0])
      
      // Generate marketing content
      const { instagramCaption, linkedInBlurb } = await this.generateMarketingContent(
        propertyDetails,
        imageFiles
      )

      return {
        enhancedImagePrompt,
        instagramCaption,
        linkedInBlurb
      }
    } catch (error) {
      console.error('Error processing property listing:', error)
      throw new Error('Failed to process property listing with AI')
    }
  }

  /**
   * Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

// Export singleton instance
export const aiService = new AIService()
