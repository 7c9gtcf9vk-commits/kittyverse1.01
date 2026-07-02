"use client";

import { useState, useEffect } from "react";
import { useHeroStore, type HeroBanner, type BannerType, type LocalizedText } from "@/stores/heroStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { VideoUpload } from "@/components/upload/VideoUpload";
import type { UploadedImage } from "@/components/upload/ImageUpload";
import type { UploadedVideo } from "@/components/upload/VideoUpload";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Film,
  Layout,
  Play,
  Type,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// ─── Banner Type Options ───
const BANNER_TYPES: { value: BannerType; label: string; icon: React.ReactNode }[] = [
  { value: "image", label: "图片 Banner", icon: <ImageIcon className="w-4 h-4" /> },
  { value: "video", label: "视频 Banner", icon: <Film className="w-4 h-4" /> },
  { value: "mixed", label: "图文 Banner", icon: <Layout className="w-4 h-4" /> },
  { value: "rich-video", label: "视频+图文", icon: <Play className="w-4 h-4" /> },
  { value: "text", label: "纯文字", icon: <Type className="w-4 h-4" /> },
];

const typeColorMap: Record<BannerType, string> = {
  image: "bg-primary/20 text-primary",
  video: "bg-accent/30 text-accent",
  mixed: "bg-accent/20 text-accent",
  "rich-video": "bg-warning/20 text-warning",
  text: "bg-primary/20 text-primary",
};

// ─── Localized Text helper ───
function localizedText(zh: string, en: string): LocalizedText {
  return { zh, en };
}

function emptyLocalized(): LocalizedText {
  return { zh: "", en: "" };
}

// ─── Base form ───
interface BaseFormFields {
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  buttonTextZh: string;
  buttonTextEn: string;
  buttonLink: string;
  autoplayDelay: string;
  enabled: boolean;
}

interface BannerFormState extends BaseFormFields {
  type: BannerType;
  image: UploadedImage | null;
  mobileImage: UploadedImage | null;
  video: UploadedVideo | null;
  poster: UploadedImage | null;
}

function emptyForm(): BannerFormState {
  return {
    type: "image",
    titleZh: "",
    titleEn: "",
    subtitleZh: "",
    subtitleEn: "",
    descriptionZh: "",
    descriptionEn: "",
    buttonTextZh: "",
    buttonTextEn: "",
    buttonLink: "",
    autoplayDelay: "5000",
    enabled: true,
    image: null,
    mobileImage: null,
    video: null,
    poster: null,
  };
}

// ─── Feature detection ───
function needsImage(type: BannerType): boolean {
  return type === "image" || type === "mixed";
}

function needsVideo(type: BannerType): boolean {
  return type === "video" || type === "rich-video";
}

/** All types can have optional text; text-type has no media at all */
function hasMedia(type: BannerType): boolean {
  return type !== "text";
}

// ─── Convert between form and store ───
function bannerToFormState(banner: HeroBanner): BannerFormState {
  return {
    type: banner.type,
    titleZh: banner.title.zh,
    titleEn: banner.title.en,
    subtitleZh: banner.subtitle.zh,
    subtitleEn: banner.subtitle.en,
    descriptionZh: banner.description.zh,
    descriptionEn: banner.description.en,
    buttonTextZh: banner.buttonText.zh,
    buttonTextEn: banner.buttonText.en,
    buttonLink: banner.buttonLink,
    autoplayDelay: String(banner.autoplayDelay || 5000),
    enabled: banner.enabled,
    image: banner.image
      ? {
          url: banner.image.url,
          key: banner.image.key,
          bucket: banner.image.bucket,
          mimeType: banner.image.mimeType,
          size: banner.image.size,
          width: banner.image.width,
          height: banner.image.height,
        }
      : null,
    mobileImage: banner.mobileImage
      ? {
          url: banner.mobileImage.url,
          key: banner.mobileImage.key,
          bucket: banner.mobileImage.bucket,
          mimeType: banner.mobileImage.mimeType,
          size: banner.mobileImage.size,
          width: banner.mobileImage.width,
          height: banner.mobileImage.height,
        }
      : null,
    video: banner.video
      ? {
          url: banner.video.url,
          key: banner.video.key,
          bucket: banner.video.bucket,
          mimeType: banner.video.mimeType,
          size: banner.video.size,
          duration: banner.video.duration,
        }
      : null,
    poster: banner.poster
      ? {
          url: banner.poster.url,
          key: banner.poster.key,
          bucket: banner.poster.bucket,
          mimeType: banner.poster.mimeType,
          size: banner.poster.size,
          width: banner.poster.width,
          height: banner.poster.height,
        }
      : null,
  };
}

function formStateToBanner(
  form: BannerFormState
): Omit<HeroBanner, "id" | "sortOrder" | "createdAt" | "updatedAt"> {
  return {
    type: form.type,
    title: localizedText(form.titleZh, form.titleEn),
    subtitle: localizedText(form.subtitleZh, form.subtitleEn),
    description: localizedText(form.descriptionZh, form.descriptionEn),
    buttonText: localizedText(form.buttonTextZh, form.buttonTextEn),
    buttonLink: form.buttonLink,
    autoplayDelay: parseInt(form.autoplayDelay, 10) || 5000,
    enabled: form.enabled,
    image: form.image
      ? {
          url: form.image.url,
          key: form.image.key,
          bucket: form.image.bucket,
          mimeType: form.image.mimeType,
          size: form.image.size,
          width: form.image.width,
          height: form.image.height,
        }
      : null,
    mobileImage: form.mobileImage
      ? {
          url: form.mobileImage.url,
          key: form.mobileImage.key,
          bucket: form.mobileImage.bucket,
          mimeType: form.mobileImage.mimeType,
          size: form.mobileImage.size,
          width: form.mobileImage.width,
          height: form.mobileImage.height,
        }
      : null,
    video: form.video
      ? {
          url: form.video.url,
          key: form.video.key,
          bucket: form.video.bucket,
          mimeType: form.video.mimeType,
          size: form.video.size,
          duration: form.video.duration,
        }
      : null,
    poster: form.poster
      ? {
          url: form.poster.url,
          key: form.poster.key,
          bucket: form.poster.bucket,
          mimeType: form.poster.mimeType,
          size: form.poster.size,
          width: form.poster.width,
          height: form.poster.height,
        }
      : null,
  };
}

export default function HeroAdmin() {
  const { t: tAdmin } = useTranslation("admin");
  const {
    banners,
    addBanner,
    removeBanner,
    updateBanner,
    reorder,
    toggleEnabled,
    fetchAllBanners,
    loading,
  } = useHeroStore();

  useEffect(() => {
    fetchAllBanners();
  }, [fetchAllBanners]);

  const sorted = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormState>(emptyForm());
  const [previewId, setPreviewId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (banner: HeroBanner) => {
    setEditingId(banner.id);
    setForm(bannerToFormState(banner));
    setDialogOpen(true);
  };

  const handleSave = () => {
    // Type-based media validation
    if (needsImage(form.type) && !form.image) {
      alert("图片 Banner / 图文 Banner 必须上传图片");
      return;
    }
    if (needsVideo(form.type) && !form.video) {
      alert("视频 Banner / 视频+图文 Banner 必须上传视频");
      return;
    }
    if (editingId) {
      updateBanner(editingId, formStateToBanner(form));
    } else {
      addBanner(formStateToBanner(form));
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => removeBanner(id);

  const handleMoveUp = (index: number) => {
    if (index > 0) reorder(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < sorted.length - 1) reorder(index, index + 1);
  };

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      reorder(dragIndex, index);
      setDragIndex(index);
    }
  };
  const handleDragEnd = () => setDragIndex(null);

  const setFormField = <K extends keyof BannerFormState>(
    field: K,
    value: BannerFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const changeType = (newType: BannerType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      ...(!needsImage(newType) ? { image: null, mobileImage: null } : {}),
      ...(!needsVideo(newType) ? { video: null, poster: null } : {}),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {tAdmin("hero.title")}
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openAdd}
            className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2 inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-all h-8 px-2.5"
          >
            <Plus className="w-4 h-4" /> {tAdmin("hero.add")}
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? tAdmin("hero.editTitle") : tAdmin("hero.addTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* ── Type selector ── */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Banner 类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => changeType(opt.value)}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                        form.type === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-gray-300"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Conditional: Image Upload ── */}
              {needsImage(form.type) && (
                <ImageUpload
                  label="上传 Banner 图片"
                  value={form.image}
                  onChange={(file) => setFormField("image", file)}
                />
              )}

              {/* ── Conditional: Mobile Image ── */}
              {needsImage(form.type) && (
                <ImageUpload
                  label="移动端图片（可选）"
                  value={form.mobileImage}
                  onChange={(file) => setFormField("mobileImage", file)}
                />
              )}

              {/* ── Conditional: Video Upload ── */}
              {needsVideo(form.type) && (
                <VideoUpload
                  label="上传 Banner 视频"
                  value={form.video}
                  onChange={(file) => setFormField("video", file)}
                />
              )}

              {/* ── Conditional: Poster ── */}
              {needsVideo(form.type) && (
                <ImageUpload
                  label="视频封面（Poster）- 可选"
                  value={form.poster}
                  onChange={(file) => setFormField("poster", file)}
                />
              )}

              {/* ── Text fields (optional for all types) ── */}
              <div className="space-y-3 border-t pt-3">
                <p className="text-xs text-muted-foreground">文字内容（全部可选）</p>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    标题（中文）
                  </label>
                  <Input
                    value={form.titleZh}
                    onChange={(e) => setFormField("titleZh", e.target.value)}
                    placeholder="如：欢迎来到 KittyVerse"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    副标题（中文）
                  </label>
                  <Input
                    value={form.subtitleZh}
                    onChange={(e) => setFormField("subtitleZh", e.target.value)}
                    placeholder="如：探索梦幻世界"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    描述（中文）
                  </label>
                  <Input
                    value={form.descriptionZh}
                    onChange={(e) => setFormField("descriptionZh", e.target.value)}
                    placeholder="可选描述文字"
                  />
                </div>

                {/* English text */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">英文翻译（可选）</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        标题 (English)
                      </label>
                      <Input
                        value={form.titleEn}
                        onChange={(e) => setFormField("titleEn", e.target.value)}
                        placeholder="Enter English title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        副标题 (English)
                      </label>
                      <Input
                        value={form.subtitleEn}
                        onChange={(e) => setFormField("subtitleEn", e.target.value)}
                        placeholder="Enter English subtitle"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        描述 (English)
                      </label>
                      <Input
                        value={form.descriptionEn}
                        onChange={(e) => setFormField("descriptionEn", e.target.value)}
                        placeholder="Enter English description"
                      />
                    </div>
                  </div>
                </div>

                {/* Button (optional) */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">按钮设置（可选）</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        按钮文字（中文）
                      </label>
                      <Input
                        value={form.buttonTextZh}
                        onChange={(e) => setFormField("buttonTextZh", e.target.value)}
                        placeholder="如：了解更多"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        按钮文字 (English)
                      </label>
                      <Input
                        value={form.buttonTextEn}
                        onChange={(e) => setFormField("buttonTextEn", e.target.value)}
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        按钮链接
                      </label>
                      <Input
                        value={form.buttonLink}
                        onChange={(e) => setFormField("buttonLink", e.target.value)}
                        placeholder="#gallery"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Autoplay delay ── */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  轮播停留时间 (毫秒)
                </label>
                <Input
                  value={form.autoplayDelay}
                  onChange={(e) => setFormField("autoplayDelay", e.target.value)}
                  placeholder="5000"
                  type="number"
                  min={2000}
                  max={30000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  该 Banner 在轮播中显示的停留时长，默认 5000ms（5秒）
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                {editingId ? tAdmin("hero.form.save") : tAdmin("hero.form.create")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Table ── */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead className="w-16">{tAdmin("hero.table.order")}</TableHead>
                <TableHead className="w-24">{tAdmin("hero.table.type")}</TableHead>
                <TableHead>{tAdmin("hero.table.title")}</TableHead>
                <TableHead>{tAdmin("hero.table.titleEn")}</TableHead>
                <TableHead className="w-16">{tAdmin("hero.table.enabled")}</TableHead>
                <TableHead className="w-28">{tAdmin("hero.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((banner, index) => (
                <TableRow
                  key={banner.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab"
                >
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-muted-foreground/60" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-sm">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="disabled:opacity-20"
                          title={tAdmin("hero.moveUp")}
                        >
                          <ChevronUp className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sorted.length - 1}
                          className="disabled:opacity-20"
                          title={tAdmin("hero.moveDown")}
                        >
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        typeColorMap[banner.type]
                      }`}
                    >
                      {BANNER_TYPES.find((t) => t.value === banner.type)?.icon}
                      {BANNER_TYPES.find((t) => t.value === banner.type)?.label ||
                        banner.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        setPreviewId(previewId === banner.id ? null : banner.id)
                      }
                      className="text-left hover:text-primary transition-colors"
                    >
                      <span className="font-medium">{banner.title.zh}</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {banner.subtitle.zh}
                      </p>
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {banner.title.en || "-"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleEnabled(banner.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        banner.enabled
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-secondary text-muted-foreground hover:bg-secondary"
                      }`}
                      title={
                        banner.enabled ? tAdmin("hero.disable") : tAdmin("hero.enable")
                      }
                    >
                      {banner.enabled ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(banner)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive/70" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    {tAdmin("hero.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Preview ── */}
      {previewId && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">
                {tAdmin("hero.preview")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewId(null)}
              >
                {tAdmin("hero.closePreview")}
              </Button>
            </div>
            {(() => {
              const banner = sorted.find((b) => b.id === previewId);
              if (!banner) return null;
              return (
                <div className="rounded-xl overflow-hidden border">
                  <div
                    className="w-full h-[260px] relative flex items-center justify-center overflow-hidden"
                    style={{
                      background:
                        banner.image?.url
                          ? `url(${banner.image.url}) center/cover`
                          : "linear-gradient(135deg, var(--hero-from), var(--hero-to))",
                    }}
                  >
                    {needsVideo(banner.type) && banner.video?.url && (
                      <video
                        src={banner.video.url}
                        poster={banner.poster?.url || banner.image?.url}
                        muted
                        loop
                        playsInline
                        controls={false}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-foreground/15" />
                    <div className="relative z-10 text-center text-primary-foreground drop-shadow px-8">
                      <p className="text-2xl font-bold">
                        {banner.title.zh || banner.title.en}
                      </p>
                      {(banner.subtitle.zh || banner.subtitle.en) && (
                        <p className="text-sm opacity-90 mt-1">
                          {banner.subtitle.zh || banner.subtitle.en}
                        </p>
                      )}
                      {banner.description.zh && (
                        <p className="text-xs opacity-80 mt-2 max-w-md mx-auto">
                          {banner.description.zh}
                        </p>
                      )}
                      {banner.buttonText.zh && (
                        <span className="inline-block mt-3 px-4 py-1.5 bg-card text-primary text-xs font-semibold rounded-full">
                          {banner.buttonText.zh}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary text-xs text-muted-foreground grid grid-cols-3 gap-2">
                    <div>
                      <span className="font-medium">Type: </span>
                      {banner.type}
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      {banner.enabled ? "Enabled" : "Disabled"}
                    </div>
                    <div>
                      <span className="font-medium">Delay: </span>
                      {(banner.autoplayDelay || 5000) / 1000}s
                    </div>
                    <div>
                      <span className="font-medium">Image: </span>
                      {banner.image ? "OK" : "—"}
                    </div>
                    <div>
                      <span className="font-medium">Video: </span>
                      {banner.video ? "OK" : "—"}
                    </div>
                    <div>
                      <span className="font-medium">Button: </span>
                      {banner.buttonText.zh || "—"}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
