"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, SendHorizonal, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api";

interface FileItem {
  file: File;
  status: "success" | "error" | "pending";
  errorMessage?: string;
}
interface SendFileDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SendFileDialog({ open, setOpen }: SendFileDialogProps) {
  const [file, setFile] = useState<FileItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maximum file size in bytes (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file: File): FileItem => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        file,
        status: "error",
        errorMessage: "File is too large. Max size is 10 MB",
      };
    }
    return {
      file,
      status: "success",
    };
  };

  const handleFile = (newFile: File) => {
    setFile(validateFile(newFile));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    if (!file || file.status !== "success") return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file.file);

    try {
      const response = await api.post("/api/send-file/", formData);
      console.log(response);
      setIsLoading(false)
      setOpen(false)
    } catch (error) {
      console.error("Upload failed:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Request for Quotation form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Supplier email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleBrowseClick}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop a file to upload
            </p>
            <p className="text-xs text-gray-500">Or browse</p>
          </div>
          {file && (
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.status === "error"
                        ? file.errorMessage
                        : formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      file.status === "success"
                        ? "bg-green-500"
                        : file.status === "error"
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              className="gap-2"
              onClick={handleSubmit}
              disabled={!file || file.status === "error" || !email}
            >
              {isLoading ? <Loader2 className="animate-spin"/> : "Send"}
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
