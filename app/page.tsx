import Link from "next/link"
import { DressEntryForm } from "@/components/dress-entry-form"
import { Sparkles, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-pink-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              DressLog
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Link href="/history">
              <Button variant="outline" className="border-pink-300 hover:bg-pink-50 bg-transparent">
                View History
              </Button>
            </Link>
            <form action="/auth/logout" method="post">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-balance">
              Track Your Style Journey
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Never forget what you wore. Log your outfits with AI-powered color detection.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 animate-slide-up">
            <DressEntryForm />
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-pink-100 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold mb-2">Upload & Detect</h3>
              <p className="text-sm text-muted-foreground">AI analyzes your dress color automatically</p>
            </div>
            <div
              className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-100 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Color Tracking</h3>
              <p className="text-sm text-muted-foreground">Keep a record of all your outfit colors</p>
            </div>
            <div
              className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-semibold mb-2">Timeline View</h3>
              <p className="text-sm text-muted-foreground">Browse your wardrobe history by date</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
