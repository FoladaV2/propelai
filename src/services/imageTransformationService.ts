import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// Model configuration
const VISION_MODEL = 'gemini-3.1-flash-image-preview'

export interface TransformationRequest {
  imageFile: File
  aspectRatio?: 'original' | '4:5' | '16:9'
}

export interface TransformationResponse {
  enhancedImageUrl: string
  prompt: string
  processingTime: number
}

export class ImageTransformationService {
  private model = genAI.getGenerativeModel({ 
    model: VISION_MODEL,
    generationConfig: {
      thinkingLevel: 'high',
      outputFormat: 'image/jpeg',
      outputResolution: '2k'
    } as any
  })

  /**
   * Transform property photo into architectural photography
   */
  async transformPropertyPhoto(request: TransformationRequest): Promise<TransformationResponse> {
    const startTime = Date.now()
    
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(request.imageFile)
      
      const architecturalPrompt = `
        Analyze this real estate photo. Transform it into a high-end architectural shot. 
        Straighten vertical lines (lens correction), enhance dynamic range to show detail 
        in both shadows and bright windows, and apply a "Golden Hour" lighting filter. 
        Ensure textures like wood, stone, and glass look sharp and premium. 
        Remove minor distractions like power lines or trash cans if visible. 
        The final result must look like a professional listing for a luxury agency in Tbilisi.
        
        ${request.aspectRatio === '4:5' ? 'Set aspect ratio to 4:5 for Instagram optimization.' : 'Match original aspect ratio.'}
        
        Focus on:
        - Professional architectural composition
        - Golden hour lighting with warm, soft shadows
        - Enhanced texture detail on building materials
        - Lens distortion correction for straight vertical lines
        - Dynamic range optimization for window highlights
        - Luxury real estate aesthetic
        - Clean, distraction-free composition
      `

      const result = await this.model.generateContent([
        architecturalPrompt,
        {
          inlineData: {
            data: base64Image.split(',')[1], // Remove data:image/...;base64, prefix
            mimeType: request.imageFile.type
          }
        }
      ])

      const processingTime = Date.now() - startTime
      const enhancedImageUrl = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

      if (!enhancedImageUrl) {
        throw new Error('No enhanced image generated')
      }

      return {
        enhancedImageUrl: `data:image/jpeg;base64,${enhancedImageUrl}`,
        prompt: architecturalPrompt,
        processingTime
      }
    } catch (error) {
      console.error('Error transforming image:', error)
      throw new Error('Failed to transform property photo')
    }
  }

  /**
   * Batch transform multiple images
   */
  async transformMultipleImages(
    requests: TransformationRequest[]
  ): Promise<TransformationResponse[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.transformPropertyPhoto(request))
    )

    return results
      .filter((result): result is PromiseFulfilledResult<TransformationResponse> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
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

  /**
   * Download enhanced image
   */
  downloadEnhancedImage(enhancedImageUrl: string, originalFilename: string): void {
    const link = document.createElement('a')
    link.href = enhancedImageUrl
    link.download = `enhanced_${originalFilename}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export singleton instance
export const imageTransformationService = new ImageTransformationService()
