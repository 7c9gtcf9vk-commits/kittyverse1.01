"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToR2, validateFile, type R2MediaInfo } from "@/lib/r2";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

interface ImageUploadProps {
  value?: UploadedImage | null;
  onChange?: (file: UploadedImage | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  label = "上传图片",
  className,
  disabled,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.url || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file, "image");
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setError(null);
      setIsUploading(true);
      setProgress(0);
      onUploadStart?.();

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      try {
        const result = await uploadToR2(file, "images", setProgress);
        const uploaded: UploadedImage = {
          url: result.url,
          key: result.key,
          bucket: result.bucket,
          mimeType: result.mimeType,
          size: result.size,
          width: result.width,
          height: result.height,
        };
        onChange?.(uploaded);
      } catch (e) {
        setError(e instanceof Error ? e.message : "上传失败");
        setPreviewUrl(null);
        URL.revokeObjectURL(localPreview);
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
    if (e.currentTarget === dropRef.current) {
      setIsDragging(false);
    }
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
    setPreviewUrl(null);
    setProgress(0);
    setError(null);
    onChange?.(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const actualPreview = value?.url || previewUrl;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      {actualPreview ? (
        <div className="relative rounded-lg overflow-hidden border border-border group/image">
          <img
            src={actualPreview}
            alt="Preview"
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-foreground/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover/image:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary-foreground bg-foreground/40 hover:bg-black/60"
              onClick={handleClick}
              disabled={disabled || isUploading}
            >
              更换
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary-foreground bg-destructive/40 hover:bg-destructive/60"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              删除
            </Button>
          </div>
          {value && (
            <div className="absolute top-1 right-1 bg-success text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
              已上传
            </div>
          )}
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
              <Upload className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  点击或拖拽上传图片
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  支持 JPG / PNG / WebP / AVIF
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Hidden height/width detection */}
      {actualPreview && (
        <img
          src={actualPreview}
          alt=""
          className="hidden"
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            if (value && (img.naturalWidth !== value.width || img.naturalHeight !== value.height)) {
              onChange?.({ ...value, width: img.naturalWidth, height: img.naturalHeight });
            }
          }}
        />
      )}
    </div>
  );
}
