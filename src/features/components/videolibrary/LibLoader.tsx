import { Loader2 } from "lucide-react"

const LibLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-background px-6 py-4 shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin" />

        <span className="font-medium">Loading Library...</span>
      </div>
    </div>
  )
}

export default LibLoader
