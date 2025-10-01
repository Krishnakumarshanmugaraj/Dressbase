import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { del } from "@vercel/blob"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Missing entry ID" }, { status: 400 })
    }

    const { data: entry, error: fetchError } = await supabase
      .from("dress_entries")
      .select("image_url")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching entry:", fetchError)
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Delete the image from Blob storage if it exists
    if (entry.image_url) {
      try {
        await del(entry.image_url)
      } catch (blobError) {
        console.error("Error deleting blob:", blobError)
        // Continue with database deletion even if blob deletion fails
      }
    }

    const { error: deleteError } = await supabase.from("dress_entries").delete().eq("id", id)

    if (deleteError) {
      console.error("Database error:", deleteError)
      return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/dress-entries/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
