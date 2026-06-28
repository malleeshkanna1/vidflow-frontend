// src/lib/file-icon.tsx

import {
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

export function getFileIcon(type: string) {
  switch (type) {
    case "Image":
      return <FileImage className="h-5 w-5 text-green-600" />;

    case "Video":
      return <FileVideo className="h-5 w-5 text-red-600" />;

    case "Audio":
      return <FileAudio className="h-5 w-5 text-purple-600" />;

    case "Text":
      return <FileText className="h-5 w-5 text-sky-600" />;

    case "Document":
      return (
        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
      );

    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
}