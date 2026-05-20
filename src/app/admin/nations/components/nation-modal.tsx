"use client";

import { useState, useRef } from "react";
import { NationItem } from "@/services/admin-metadata-service";
import { uploadImageToCloudinary } from "@/services/admin-upload-service";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";

interface NationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNation: NationItem | null;
  onSubmit: (payload: {
    nationName: string;
    nationSlug?: string;
    flagUrl?: string;
  }) => Promise<void>;
  isProcessing: boolean;
}

export default function NationModal({
  isOpen,
  onClose,
  editingNation,
  onSubmit,
  isProcessing,
}: NationModalProps) {
  // Initialize state directly from prop — parent must pass key={editingNation?.id ?? 'new'} to remount
  const [nationNameVal, setNationNameVal] = useState(editingNation?.nationName ?? "");
  const [nationSlugVal, setNationSlugVal] = useState(editingNation?.nationSlug ?? "");
  const [nationFlagUrl, setNationFlagUrl] = useState(editingNation?.flagUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(editingNation?.flagUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiển thị preview local ngay lập tức
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setNationFlagUrl(uploadedUrl);
      setPreviewUrl(uploadedUrl);
    } catch {
      setUploadError("Upload ảnh thất bại. Vui lòng thử lại.");
      setPreviewUrl(null);
      setNationFlagUrl("");
    } finally {
      setIsUploading(false);
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setNationFlagUrl("");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nationName: nationNameVal.trim(),
      nationSlug: nationSlugVal.trim() || undefined,
      flagUrl: nationFlagUrl.trim() || undefined,
    });
  };

  const busy = isProcessing || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl">
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold text-white mb-6">
          {editingNation ? "CẬP NHẬT QUỐC GIA" : "THÊM QUỐC GIA MỚI"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên Quốc Gia */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Tên Quốc Gia
            </label>
            <input
              type="text"
              required
              value={nationNameVal}
              onChange={(e) => setNationNameVal(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              placeholder="Ví dụ: Bồ Đào Nha"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Slug (Đường dẫn tinh gọn)
            </label>
            <input
              type="text"
              value={nationSlugVal}
              onChange={(e) => setNationSlugVal(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              placeholder="Ví dụ: portugal"
            />
          </div>

          {/* Ảnh Quốc Kỳ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Ảnh Quốc Kỳ (Flag)
            </label>

            {/* Preview hoặc Khu vực chọn ảnh */}
            {previewUrl ? (
              <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                    <span className="ml-2 text-xs text-white/70">Đang upload...</span>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Flag preview"
                  className="h-12 w-16 rounded-lg object-contain bg-white/10"
                  onError={() => setPreviewUrl(null)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate">
                    {nationFlagUrl || "Đang upload..."}
                  </p>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex-shrink-0 rounded-lg bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Xóa ảnh"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm text-white/50 hover:border-[#D4AF37]/50 hover:text-white/70 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <ImageIcon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white/70">Chọn ảnh từ máy tính</p>
                  <p className="text-xs text-white/40">PNG, JPG, WebP · Tối đa 5MB</p>
                </div>
                <Upload className="ml-auto h-4 w-4 text-white/40" />
              </button>
            )}

            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

            {/* Input ẩn để xử lý file */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Hoặc nhập URL thủ công */}
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest">
                hoặc nhập URL
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <input
              type="url"
              value={nationFlagUrl}
              onChange={(e) => {
                setNationFlagUrl(e.target.value);
                setPreviewUrl(e.target.value || null);
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              placeholder="https://..."
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
