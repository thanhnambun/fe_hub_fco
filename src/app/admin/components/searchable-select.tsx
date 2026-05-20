"use client";

import { useState } from "react";

interface SearchableSelectProps<T> {
  label: string;
  items: T[];
  value: number | string | null;
  onChange: (val: number | string | null) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => number | string;
  placeholder?: string;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
}

export default function SearchableSelect<T>({
  label,
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Chọn...",
  onSearchChange,
  isLoading = false,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedItem = items ? items.find((item) => item && getValue(item) === value) : null;
  const filtered = onSearchChange
    ? items || []
    : (items || []).filter((item) => {
        if (!item) return false;
        const labelVal = getLabel(item);
        if (labelVal == null) return false;
        return String(labelVal).toLowerCase().includes(search.toLowerCase());
      });

  return (
    <div className="relative flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
        {label}
      </label>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm outline-none focus:border-[#D4AF37]"
        >
          <span className={selectedItem ? "text-white" : "text-white/40"}>
            {selectedItem ? getLabel(selectedItem) : placeholder}
          </span>
          <span className="text-white/40 text-xs">▼</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#0F1422] p-2 shadow-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearchChange) {
                  onSearchChange(e.target.value);
                }
              }}
              placeholder="Gõ để tìm nhanh..."
              className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs outline-none focus:border-[#D4AF37]"
            />
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                  setSearch("");
                  if (onSearchChange) {
                    onSearchChange("");
                  }
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/5"
              >
                -- Trống --
              </button>
              {isLoading ? (
                <p className="px-3 py-2 text-center text-xs text-white/40">Đang tìm kiếm...</p>
              ) : (
                <>
                  {filtered.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(getValue(item));
                        setIsOpen(false);
                        setSearch("");
                        if (onSearchChange) {
                          onSearchChange("");
                        }
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-[#D4AF37]/20 hover:text-white"
                    >
                      {getLabel(item)}
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="px-3 py-2 text-center text-xs text-white/40">
                      Không tìm thấy kết quả
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
