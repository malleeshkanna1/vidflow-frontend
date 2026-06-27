import { useEffect, useState } from "react"
import { Calendar, Loader2, MoreVertical, Search, Upload } from "lucide-react"
import { toast } from "sonner"

import AxiosService from "@/services/AxiosService"

import UploadSlideout from "./UploadSlideout"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "@tanstack/react-router"

import { Card, CardContent } from "@/components/ui/card"

interface Footage {
  id: string
  thumbnail: string
  name: string
  status: string
  duration: string
  tags: string[]
  uploaded: string
  quality: string
  size: string
}

interface FootageResponse {
  success: boolean
  count: number
  data: Footage[]
}

export default function Footages() {
  const [uploadOpen, setUploadOpen] = useState(false)

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [footages, setFootages] = useState<Footage[]>([])

  const navigate = useNavigate()

  const loadFootages = async (keyword = "") => {
    try {
      setLoading(true)

      const response = await AxiosService.get<FootageResponse>(
        "/footages/list",
        {
          params: {
            search: keyword,
          },
        }
      )

      if (response.success) {
        setFootages(response.data)
      }
    } catch (error) {
      console.error(error)

      toast.error("Failed to load footages.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFootages()
  }, [uploadOpen])



  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        )

      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Processing
          </Badge>
        )

      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        )

      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Footages</h1>

            <p className="text-sm text-muted-foreground">
              Manage your footage library.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative w-80">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search footages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button className="gap-2" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Footage
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-[120px_2fr_120px_180px_130px_150px_100px_100px_50px] border-b bg-muted/40 px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
              <div>Thumbnail</div>

              <div>Name</div>

              <div>Status</div>

              <div>Duration</div>

              <div>Tags</div>

              <div>Uploaded</div>

              <div>Quality</div>

              <div>Size</div>

              <div></div>
            </div>
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* No Data */}
            {!loading && footages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />

                <h3 className="text-lg font-semibold">No Footages Found</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Upload your first footage to get started.
                </p>

                <Button className="mt-6" onClick={() => setUploadOpen(true)}>
                  Upload Footage
                </Button>
              </div>
            )}

            {/* Rows */}
            {!loading &&
              footages.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[120px_2fr_120px_180px_130px_150px_100px_100px_50px] items-center border-b px-6 py-4 transition-colors hover:bg-muted/30"
                >
                  {/* Thumbnail */}
                  <img
                    src={
                      item.thumbnail ||
                      "https://placehold.co/160x90?text=No+Preview"
                    }
                    alt={item.name}
                    className="h-16 w-28 rounded-lg border object-cover"
                  />

                  {/* Name */}
                  <div>
                    <h3
                      className="inline-block font-medium text-slate-900 transition-colors hover:text-primary hover:underline cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: "/footages/$EditFootage",
                          params: {
                            EditFootage: item.id,
                          },
                        })
                      }
                    >
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {item.id}
                    </p>
                  </div>

                  {/* Status */}
                  <div>{getStatusBadge(item.status)}</div>

                  {/* Duration */}
                  <div>{item.duration}</div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.length ? (
                      item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Uploaded */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />

                    {new Date(item.uploaded).toLocaleDateString()}
                  </div>

                  {/* Quality */}
                  <div>{item.quality}</div>

                  {/* Size */}
                  <div>{item.size}</div>

                  {/* Actions */}
                  <div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <UploadSlideout uploadOpen={uploadOpen} setUploadOpen={setUploadOpen} />
    </>
  )
}
