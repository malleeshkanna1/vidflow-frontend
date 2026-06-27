import { useCallback, useState } from "react"
import { Upload, FileVideo, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import AxiosService from "@/services/AxiosService"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"

interface UploadSlideoutProps {
  uploadOpen: boolean
  setUploadOpen: (open: boolean) => void
}

interface UploadResponse {
  success: boolean
  message: string
  footageId: string
}

export default function UploadSlideout({
  uploadOpen,
  setUploadOpen,
}: UploadSlideoutProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: {
      "video/*": [],
    },
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a video.")
      return
    }

    try {
      setUploading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append("video", file)

      const response = await AxiosService.post<UploadResponse>(
        "/footages/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(Math.round((event.loaded * 100) / event.total))
            }
          },
        }
      )

      if (response.success) {
        toast.success(response.message)

        console.log("Footage ID:", response.footageId)

        setFile(null)
        setUploadOpen(false)
      } else {
        toast.error("Upload failed.")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to upload footage.")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Sheet open={uploadOpen} onOpenChange={setUploadOpen}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Upload Footage</SheetTitle>

          <SheetDescription>
            Upload a video to your footage library.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-3 p-3 space-y-6">
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-10 text-center transition-all ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />

            <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="font-semibold">Drag & Drop your footage here</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              MP4, MOV, AVI, MKV
            </p>

            <Button
              type="button"
              variant="secondary"
              className="mt-6"
              onClick={open}
            >
              Select Footage
            </Button>
          </div>
          {/* Selected File */}
          {file && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileVideo className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">{file.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={uploading}
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Uploading footage...
                </span>

                <span className="font-medium">{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => setUploadOpen(false)}
            >
              Cancel
            </Button>

            <Button disabled={!file || uploading} onClick={handleUpload}>
              {uploading ? `Uploading ${progress}%` : "Upload Footage"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
