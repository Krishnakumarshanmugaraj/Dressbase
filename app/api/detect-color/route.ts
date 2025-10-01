import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")
    const mimeType = image.type

    try {
      // Use AI to detect the color
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze this dress/clothing image and identify the primary color. Respond with ONLY the color name (e.g., "Red", "Blue", "Floral Print", "Black and White Stripes"). Be specific but concise.',
              },
              {
                type: "image",
                image: `data:${mimeType};base64,${base64Image}`,
              },
            ],
          },
        ],
      })

      return NextResponse.json({ detectedColor: text.trim() })
    } catch (aiError: any) {
      console.error("AI detection error:", aiError)
      return NextResponse.json(
        {
          error:
            "AI color detection is currently unavailable. This feature requires AI Gateway credits. Please enter the color manually.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error detecting color:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
