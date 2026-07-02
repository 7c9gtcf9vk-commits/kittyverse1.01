"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import { Upload, X, Play, Film, AlertCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToR2, validateFile, type R2MediaInfo } from "@/lib/r2";
import { cn } from "@/lib/utils";

export interface UploadedVideo {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  duration?: number;
  posterUrl?: string;
}

interface VideoUploadProps {
  value?: UploadedVideo | null;
  onChange?: (file: UploadedVideo | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  label = "上传视频",
  className,
  disabled,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localDuration, setLocalDuration] = useState<number | undefined>(
    value?.duration
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file, "video");
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setError(null);
      setIsUploading(true);
      setProgress(0);
      onUploadStart?.();

      // Get duration locally
      const tempUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = tempUrl;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          setLocalDuration(video.duration);
          resolve();
        };
        video.onerror = () => resolve();
      });
      URL.revokeObjectURL(tempUrl);

      try {
        const result = await uploadToR2(file, "videos", setProgress);
        const uploaded: UploadedVideo = {
          url: result.url,
          key: result.key,
          bucket: result.bucket,
          mimeType: result.mimeType,
          size: result.size,
          duration: video.duration || undefined,
        };
        onChange?.(uploaded);
      } catch (e) {
        setError(e instanceof Error ? e.message : "上传失败");
      } finally {
        setIsUploading(false);
        onUploadEnd?.();
      }
    },
    [onChange, onUploadStart, onUploadEnd]
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropRef.current) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setError(null);
    setProgress(0);
    setLocalDuration(undefined);
    setPreviewVisible(false);
    onChange?.(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const duration = value?.duration || localDuration;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      {value ? (
        <div className="rounded-lg overflow-hidden border border-border">
          {/* Video preview */}
          {previewVisible ? (
            <video
              src={value.url}
              controls
              className="w-full max-h-60"
              autoPlay
              playsInline
            />
          ) : (
            <div
              className="relative w-full h-40 bg-background flex items-center justify-center cursor-pointer group/video"
              onClick={() => setPreviewVisible(true)}
            >
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center group-hover/video:bg-black/50 transition-colors">
                <div className="w-14 h-14 rounded-full bg-card/90 flex items-center justify-center">
                  <Play className="w-6 h-6 text-foreground ml-0.5" />
                </div>
              </div>
            </div>
          )}

          {/* Info bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-secondary text-xs text-muted-foreground gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[120px]">
                  {value.key.split("/").pop()}
                </span>
              </span>
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(duration)}
                </span>
              )}
              <span>{formatSize(value.size)}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-destructive/70 hover:text-destructive shrink-0"
              onClick={handleRemove}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={dropRef}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors min-h-[120px]",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40 hover:bg-muted/50",
            (disabled || isUploading) && "opacity-50 cursor-not-allowed",
            error && "border-destructive bg-destructive/10"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                上传中 {progress}%
              </span>
            </div>
          ) : error ? (
            <>
              <AlertCircle className="w-6 h-6 text-destructive/70" />
              <span className="text-sm text-destructive">{error}</span>
              <span className="text-xs text-muted-foreground">点击重试</span>
            </>
          ) : (
            <>
              <Film className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  点击或拖拽上传视频
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  支持 MP4 / WebM / MOV
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
