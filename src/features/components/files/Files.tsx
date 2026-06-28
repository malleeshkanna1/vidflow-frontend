import { useEffect, useMemo, useState } from "react"
import { Search, Upload, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import AxiosService from "@/services/AxiosService"

import UploadFileSlideout from "./UploadFileSlideout"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getFileIcon } from "@/services/IconService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  updated_at: string
}

export default function Files() {
  const [loading, setLoading] = useState(true)

  const [uploadOpen, setUploadOpen] = useState(false)

  const [search, setSearch] = useState("")

  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFiles()
    }, 600)

    return () => clearTimeout(timer)
  }, [search])

  async function loadFiles() {
    try {
      setLoading(true)

      const response: any = await AxiosService.get("/files/list", {
        params: {
          search,
        },
      })

      if (response.success) {
        setFiles(response.data)
      }
    } catch {
      toast.error("Unable to load files.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteFile(id: string) {
    try {
      await AxiosService.get(`/files/delete/${id}`)

      toast.success("File deleted.")

      loadFiles()
    } catch {
      toast.error("Unable to delete file.")
    }
  }

  const rows = useMemo(() => files, [files])

  return (
    <>
      <div className="space-y-6">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Files</h1>

            <p className="text-sm text-muted-foreground">
              Manage and organize your enterprise files.
            </p>
          </div>

          <Button className="gap-2" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Search */}

        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}

        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-[2fr_140px_140px_220px_80px] border-b bg-muted/50 px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">
              <div>Name</div>

              <div>Type</div>

              <div>Size</div>

              <div>Uploaded</div>

              <div className="text-center">Actions</div>
            </div>

            {loading && (
              <div className="flex justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
            )}

            {!loading && rows.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No files found.
              </div>
            )}

            {!loading &&
              rows.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[2fr_140px_140px_220px_80px] items-center border-b px-6 py-4 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                      {getFileIcon(file.type)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{file.name}</h3>

                      <p className="text-xs text-muted-foreground">
                        {file.type}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Badge variant="secondary">{file.type}</Badge>
                  </div>

                  <div>{file.size}</div>

                  <div className="text-sm text-muted-foreground">
                    {file.updated_at}
                  </div>

                  <div className="flex justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete File?</AlertDialogTitle>

                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{file.name}</span>
                            ?
                            <br />
                            <br />
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteFile(file.id)}
                          >
                            Delete File
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <UploadFileSlideout
        uploadOpen={uploadOpen}
        setUploadOpen={setUploadOpen}
        refreshFiles={loadFiles}
      />
    </>
  )
}
