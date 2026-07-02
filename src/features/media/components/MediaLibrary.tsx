"use client";

import { useState, useMemo } from "react";
import { useMediaStore, MEDIA_CATEGORIES, type MediaCategory } from "@/stores/mediaStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload, type UploadedImage } from "@/components/upload/ImageUpload";
import { VideoUpload, type UploadedVideo } from "@/components/upload/VideoUpload";
import {
  Plus,
  Trash2,
  Search,
  X,
  Image as ImageIcon,
  Film,
  Grid3X3,
  List,
  Filter,
  Check,
  FolderOpen,
  Download,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MediaLibrary() {
  const { items, addItem, removeItem, removeItems } = useMediaStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MediaCategory | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<"image" | "video">("image");
  const [previewItem, setPreviewItem] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      return matchSearch && matchCategory && matchType;
    });
  }, [items, search, categoryFilter, typeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)));
    }
  };

  const handleBatchDelete = () => {
    removeItems(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleImageUpload = (file: UploadedImage | null) => {
    if (!file) return;
    addItem({
      name: file.key.split("/").pop() || "Untitled",
      type: "image",
      file: {
        url: file.url,
        key: file.key,
        bucket: file.bucket,
        mimeType: file.mimeType,
        size: file.size,
        width: file.width,
        height: file.height,
      },
      category: "general",
      tags: [],
    });
    setUploadOpen(false);
  };

  const handleVideoUpload = (file: UploadedVideo | null) => {
    if (!file) return;
    addItem({
      name: file.key.split("/").pop() || "Untitled",
      type: "video",
      file: {
        url: file.url,
        key: file.key,
        bucket: file.bucket,
        mimeType: file.mimeType,
        size: file.size,
        duration: file.duration,
      },
      category: "general",
      tags: [],
    });
    setUploadOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">媒体资源中心</h1>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleBatchDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除 ({selectedIds.size})
            </Button>
          )}
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger
              className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2 inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-all h-8 px-2.5"
            >
              <Plus className="w-4 h-4" /> 上传媒体
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>上传新媒体</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-1.5",
                      uploadTab === "image"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-gray-300"
                    )}
                    onClick={() => setUploadTab("image")}
                  >
                    <ImageIcon className="w-4 h-4" /> 图片
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-1.5",
                      uploadTab === "video"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-gray-300"
                    )}
                    onClick={() => setUploadTab("video")}
                  >
                    <Film className="w-4 h-4" /> 视频
                  </button>
                </div>
                {uploadTab === "image" ? (
                  <ImageUpload
                    label=""
                    onChange={handleImageUpload}
                  />
                ) : (
                  <VideoUpload
                    label=""
                    onChange={handleVideoUpload}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索文件名或标签..."
            className="pl-8"
          />
          {search && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              onClick={() => setSearch("")}
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as MediaCategory | "all")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground outline-none focus-visible:border-ring"
          >
            <option value="all">全部分类</option>
            {MEDIA_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.labelZh}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "image" | "video")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground outline-none focus-visible:border-ring"
          >
            <option value="all">全部类型</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
          </select>

          <div className="flex border border-input rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2 h-8 flex items-center transition-colors",
                viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-2 h-8 flex items-center transition-colors",
                viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selection bar */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <button
            className="hover:text-primary transition-colors"
            onClick={handleSelectAll}
          >
            {selectedIds.size === filtered.length ? "取消全选" : "全选"}
          </button>
          <span>共 {filtered.length} 个文件</span>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">暂无媒体资源</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              点击"上传媒体"按钮添加您的第一个文件
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group/media-card relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                selectedIds.has(item.id)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground/30"
              )}
              onClick={() => toggleSelect(item.id)}
            >
              {/* Selection checkbox */}
              <div
                className={cn(
                  "absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  selectedIds.has(item.id)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-foreground/30 border-white/60 opacity-0 group-hover/media-card:opacity-100"
                )}
              >
                {selectedIds.has(item.id) && <Check className="w-3 h-3" />}
              </div>

              {/* Preview */}
              <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={item.file.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full bg-background flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground/70" />
                    <video
                      src={item.file.url}
                      className="absolute inset-0 w-full h-full object-cover opacity-0"
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 text-xs">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">
                  {formatSize(item.file.size)}
                  {item.file.duration && ` · ${Math.floor(item.file.duration)}s`}
                </p>
              </div>

              {/* Type badge */}
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-foreground/40 text-primary-foreground backdrop-blur-sm">
                  {item.type === "image" ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <Film className="w-3 h-3" />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer",
                    selectedIds.has(item.id) && "bg-primary/5"
                  )}
                  onClick={() => toggleSelect(item.id)}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                      selectedIds.has(item.id)
                        ? "bg-primary border-primary"
                        : "border-border"
                    )}
                  >
                    {selectedIds.has(item.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {item.type === "image" ? (
                      <img
                        src={item.file.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary-foreground/60" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === "image" ? "图片" : "视频"} · {formatSize(item.file.size)}
                      {item.file.duration && ` · ${Math.floor(item.file.duration)}s`}
                      {item.file.width && item.file.height && ` · ${item.file.width}×${item.file.height}`}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                    {MEDIA_CATEGORIES.find((c) => c.value === item.category)?.labelZh || item.category}
                  </div>

                  <div className="text-xs text-muted-foreground shrink-0 hidden md:block w-32 text-right">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
