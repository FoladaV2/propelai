import { transformImage, type TransformationType } from '../lib/openrouter'

export interface TransformationRequest {
  imageFile: File
  type: TransformationType
  prompt?: string
}

export interface TransformationResponse {
  enhancedImageUrl: string
  prompt: string
  processingTime: number
}

export class ImageTransformationService {
  /**
   * Transform property photo using specialized AI models via OpenRouter
   */
  async transformPropertyPhoto(request: TransformationRequest): Promise<TransformationResponse> {
    const startTime = Date.now()
    
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(request.imageFile)
      
      const enhancedImageUrl = await transformImage({
        type: request.type,
        prompt: request.prompt,
        imageUri: base64Image,
      })

      const processingTime = Date.now() - startTime

      return {
        enhancedImageUrl,
        prompt: request.prompt || `Transformation: ${request.type}`,
        processingTime
      }
    } catch (error) {
      console.error('Error transforming image:', error)
      throw new Error('Failed to transform property photo. Please try again later.')
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

  /**
   * Download enhanced image
   * Handles cross-origin issues by fetching as blob first
   */
  async downloadEnhancedImage(enhancedImageUrl: string, originalFilename: string): Promise<void> {
    try {
      // For base64 or local URLs, we can just use the attribute
      if (enhancedImageUrl.startsWith('data:') || enhancedImageUrl.startsWith('blob:') || window.location.origin === new URL(enhancedImageUrl, window.location.origin).origin) {
        this.triggerDownload(enhancedImageUrl, originalFilename)
        return
      }

      // For cross-origin URLs, fetch as blob to bypass the "opening in new tab" behavior
      const response = await fetch(enhancedImageUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      
      this.triggerDownload(blobUrl, originalFilename)
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    } catch (error) {
      console.error('Download error:', error)
      // Fallback to direct link if fetch fails
      this.triggerDownload(enhancedImageUrl, originalFilename)
    }
  }

  private triggerDownload(url: string, originalFilename: string): void {
    const link = document.createElement('a')
    link.href = url
    link.download = `enhanced_${originalFilename}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export singleton instance
export const imageTransformationService = new ImageTransformationService()
