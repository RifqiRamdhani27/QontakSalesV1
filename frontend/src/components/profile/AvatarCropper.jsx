import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";

const OUTPUT_SIZE = 512;

async function cropToFile(src, area, fileName) {
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  const base = (fileName || "avatar").replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export default function AvatarCropper({ src, fileName, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleSave = async () => {
    if (!area || busy) return;
    setBusy(true);
    try {
      onDone(await cropToFile(src, area, fileName));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-900/70 p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Atur foto profil"
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-[color:var(--profile-surface,#fff)] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="border-b border-[color:var(--profile-border,#e5e7eb)] px-[22px] py-4">
          <h3 className="m-0 text-[17px] font-bold text-[color:var(--profile-text,#111827)]">
            Atur foto profil
          </h3>
          <p className="m-0 mt-1 text-[13px] text-[color:var(--profile-muted,#64748b)]">
            Geser dan zoom untuk memilih bagian foto
          </p>
        </div>

        <div className="px-[22px] py-4">
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-black">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              minZoom={1}
              maxZoom={4}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="mt-4 w-full cursor-pointer accent-[color:var(--profile-brand,#2563eb)]"
          />
        </div>

        <div className="flex justify-end gap-2.5 border-t border-[color:var(--profile-border,#e5e7eb)] px-[22px] py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex cursor-pointer items-center rounded-lg border border-[color:var(--profile-border,#d1d5db)] bg-[color:var(--profile-surface,#fff)] px-[15px] py-[9px] text-[13px] font-semibold text-[color:var(--profile-text,#374151)] hover:bg-[color:var(--profile-hover,#f8fafc)] disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy || !area}
            className="inline-flex cursor-pointer items-center rounded-lg border-0 bg-[color:var(--profile-brand,#2563eb)] px-[15px] py-[9px] text-[13px] font-semibold text-[color:var(--profile-brand-text,#fff)] hover:bg-[color:var(--profile-brand-hover,#1d4ed8)] disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Terapkan"}
          </button>
        </div>
      </div>
    </div>
  );
}