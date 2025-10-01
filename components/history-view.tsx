"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Calendar, Palette, Trash2 } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type DressEntry = {
  id: string
  date: string
  color: string
  detected_color: string | null
  image_url: string
  created_at: string
}

type TimelineFilter = "all" | "week" | "month" | "year"

export function HistoryView() {
  const [entries, setEntries] = useState<DressEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TimelineFilter>("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchEntries(filter)
  }, [filter])

  const fetchEntries = async (timeFilter: TimelineFilter) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/dress-entries?filter=${timeFilter}`)
      if (!response.ok) throw new Error("Failed to fetch entries")

      const data = await response.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/dress-entries/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete entry")

      setEntries((prev) => prev.filter((entry) => entry.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const filterButtons: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ]

  return (
    <div className="space-y-8">
      {/* Timeline Filters */}
      <div className="flex flex-wrap gap-3 justify-center animate-fade-in">
        {filterButtons.map((btn) => (
          <Button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            variant={filter === btn.value ? "default" : "outline"}
            className={
              filter === btn.value
                ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                : "border-pink-300 hover:bg-pink-50"
            }
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && entries.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-pink-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-6">Start logging your outfits to see them here</p>
        </div>
      )}

      {/* Entries Grid */}
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className="overflow-hidden border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                <img
                  src={entry.image_url || "/placeholder.svg"}
                  alt={`Dress from ${entry.date}`}
                  className="w-full h-full object-cover"
                />
                {/* Delete Button Overlay */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600"
                  onClick={() => setDeleteId(entry.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-lg">{entry.color}</span>
                  </div>

                  {/* AI Detected Color */}
                  {entry.detected_color && entry.detected_color !== entry.color && (
                    <div className="text-sm text-muted-foreground pl-6">AI detected: {entry.detected_color}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Entry Count */}
      {!isLoading && entries.length > 0 && (
        <div className="text-center text-muted-foreground animate-fade-in">
          Showing {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this dress entry from your wardrobe history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
