import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import AxiosService from "@/services/AxiosService";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UploadFileSlideoutProps {
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  refreshFiles: () => void;
}

export default function UploadFileSlideout({
  uploadOpen,
  setUploadOpen,
  refreshFiles,
}: UploadFileSlideoutProps) {
  const [file, setFile] = useState<File | null>(null);

  const [description, setDescription] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
  });

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "description",
        description
      );

      const response:any =
        await AxiosService.post(
          "/files/add",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      if (response.success) {
        toast.success(
          "File uploaded successfully."
        );

        refreshFiles();

        setFile(null);
        setDescription("");

        // Close only after upload success
        setUploadOpen(false);
      }
    } catch {
      toast.error(
        "Failed to upload file."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sheet
      open={uploadOpen}
      onOpenChange={(open) => {
        if (!uploading) {
          setUploadOpen(open);
        }
      }}
    >
      <SheetContent className="sm:max-w-xl overflow-y-auto">

        <SheetHeader>

          <SheetTitle>
            Upload File
          </SheetTitle>

          <SheetDescription>
            Upload a file to your file
            library.
          </SheetDescription>

        </SheetHeader>

        <div className="mt-6 space-y-6">
                      {/* Dropzone */}

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

            <h3 className="font-semibold">
              Drag & Drop your file here
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload any document, image, archive or media file.
            </p>

            <Button
              type="button"
              variant="secondary"
              className="mt-6"
              onClick={open}
            >
              Select File
            </Button>
          </div>

          {/* Selected File */}

          {file && (
            <div className="space-y-5 rounded-xl border p-5">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-lg bg-primary/10 p-3">
                    <File className="h-8 w-8 text-primary" />
                  </div>

                  <div>

                    <h3 className="font-semibold break-all">
                      {file.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </div>

                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={uploading}
                  onClick={() => {
                    setFile(null);
                    setDescription("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>

              </div>

              {/* File Details */}

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4">

                <div>

                  <p className="text-xs uppercase text-muted-foreground">
                    File Type
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {file.type || "Unknown"}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase text-muted-foreground">
                    Size
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>

                <div className="col-span-2">

                  <p className="text-xs uppercase text-muted-foreground">
                    Last Modified
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {new Date(file.lastModified).toLocaleString()}
                  </p>

                </div>

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <Textarea
                  rows={4}
                  placeholder="Enter a description for this file..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

              </div>

            </div>
          )}

          {/* Footer */}

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => setUploadOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={!file || uploading}
              onClick={uploadFile}
            >
              {uploading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Upload File
            </Button>

          </div>

        </div>

      </SheetContent>

    </Sheet>
  );
}