import { fal } from "@fal-ai/client";

// Configure FAL with the API key
fal.config({
  credentials: import.meta.env.VITE_FAL_API_KEY,
});

export type MotionStyle = "drone" | "cinematic_pan" | "slow_zoom";
export type Duration = "5" | "10";

const MOTION_STYLE_PROMPTS: Record<MotionStyle, string> = {
  drone: "Cinematic aerial drone shot slowly pulling back and rising to reveal the full property exterior, golden hour lighting, ultra smooth motion, photorealistic, luxury real estate",
  cinematic_pan: "Slow, smooth cinematic horizontal pan through the interior living space, soft natural line streaming through windows, ultra stable motion, luxury real estate photography style",
  slow_zoom: "Slow dramatic zoom out from the front facade of the property, revealing the full exterior and landscaping, golden hour, cinematic depth of field, luxury real estate",
};

/**
 * Generate a cinematic real estate video using Kling 2.6 Pro via FAL.ai
 */
export async function generateListingVideo(
  imageUrl: string,
  motionStyle: MotionStyle,
  duration: Duration
): Promise<string> {
  try {
    const prompt = MOTION_STYLE_PROMPTS[motionStyle];

    const result = await fal.subscribe("fal-ai/kling-video/v2.6/pro/image-to-video", {
      input: {
        image_url: imageUrl,
        prompt: prompt,
        duration: duration,
        aspect_ratio: "9:16",
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("Queue update:", update);
      },
    });

    if (result.data && result.data.video && result.data.video.url) {
      return result.data.video.url;
    }

    throw new Error("No video URL returned from FAL.ai");
  } catch (error: any) {
    console.error("FAL AI Video Generation Error:", error);
    throw new Error(error.message || "Failed to generate video with FAL.ai");
  }
}
