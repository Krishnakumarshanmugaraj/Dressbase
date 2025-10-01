"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Upload, Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { detectDominantColor } from "@/lib/color-detection"

export function DressEntryForm() {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [color, setColor] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [detectedColor, setDetectedColor] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setDetectedColor(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetectColor = async () => {
    if (!image) return

    setIsDetecting(true)
    try {
      const result = await detectDominantColor(image)
      setDetectedColor(result.color)
      setColor(result.color)
    } catch (error) {
      console.error("Error detecting color:", error)
      alert("Failed to detect color. Please enter the color manually.")
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !color) {
      alert("Please enter both date and color")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("date", date)
      formData.append("color", color)
      if (image) {
        formData.append("image", image)
      }
      if (detectedColor) {
        formData.append("detectedColor", detectedColor)
      }

      const response = await fetch("/api/dress-entries", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to save entry")

      setIsSuccess(true)

      // Reset form after 2 seconds
      setTimeout(() => {
        setDate("")
        setColor("")
        setImage(null)
        setImagePreview(null)
        setDetectedColor(null)
        setIsSuccess(false)
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("Failed to save entry. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Input */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-600" />
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
        />
      </div>

      {/* Color Input */}
      <div className="space-y-2">
        <Label htmlFor="color" className="text-base font-semibold flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
          Dress Color
        </Label>
        <Input
          id="color"
          type="text"
          placeholder="e.g., Red, Blue, Floral Print"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
        {detectedColor && (
          <div className="flex items-center gap-2 text-sm text-green-600 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI detected: {detectedColor}</span>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Upload Image <span className="text-sm font-normal text-gray-500">(Optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>

        {imagePreview && (
          <div className="mt-4 space-y-3">
            <div className="relative rounded-lg overflow-hidden border-2 border-pink-200 animate-fade-in">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
            </div>
            <Button
              type="button"
              onClick={handleDetectColor}
              disabled={isDetecting}
              variant="outline"
              className="w-full border-purple-300 hover:bg-purple-50 hover:border-purple-400 bg-transparent"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Color...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Detect Color with AI
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isUploading || isSuccess}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-[1.02]"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Saved Successfully!
          </>
        ) : (
          "Save Dress Entry"
        )}
      </Button>
    </form>
  )
}
