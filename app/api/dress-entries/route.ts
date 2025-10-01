import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const date = formData.get("date") as string
    const color = formData.get("color") as string
    const image = formData.get("image") as File | null
    const detectedColor = formData.get("detectedColor") as string | null

    if (!date || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let imageUrl: string | null = null

    if (image) {
      const blob = await put(image.name, image, {
        access: "public",
      })
      imageUrl = blob.url
    }

    // Save to database
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("dress_entries")
      .insert({
        date,
        color,
        detected_color: detectedColor,
        image_url: imageUrl,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save to database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in POST /api/dress-entries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    const supabase = await getSupabaseServerClient()
    let query = supabase.from("dress_entries").select("*").order("date", { ascending: false })

    // Apply date filters
    const now = new Date()
    if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      query = query.gte("date", weekAgo.toISOString().split("T")[0])
    } else if (filter === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      query = query.gte("date", monthAgo.toISOString().split("T")[0])
    } else if (filter === "year") {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      query = query.gte("date", yearAgo.toISOString().split("T")[0])
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
    }

    return NextResponse.json({ entries: data })
  } catch (error) {
    console.error("Error in GET /api/dress-entries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
