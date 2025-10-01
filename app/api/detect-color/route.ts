import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // This endpoint is kept for future AI integration if needed
    return NextResponse.json(
      {
        error: "Please use client-side color detection",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error detecting color:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
