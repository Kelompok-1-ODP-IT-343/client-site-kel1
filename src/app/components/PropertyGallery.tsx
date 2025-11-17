"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  title?: string;
};

export default function PropertyGallery({ images, title }: Props) {
  const displayImages = useMemo(() => {
    const defaults = [
      "/rumah-1.jpg",
      "/rumah-2.jpg",
      "/rumah-3.jpg",
      "/rumah-4.jpg",
    ];
    let arr = (images || []).filter(Boolean);
    // Jika tidak ada gambar dari API, gunakan 4 gambar default
    if (arr.length === 0) arr = defaults;
    // Batasi maksimal 4 gambar
    arr = arr.slice(0, 4);
    // Jika kurang dari 4, pad dengan defaults hingga 4
    if (arr.length < 4) {
      arr = [...arr, ...defaults].slice(0, 4);
    }
    return arr;
  }, [images]);

  const [index, setIndex] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(new Set());
  const total = displayImages.length;
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  // Autoplay ringan agar carousel "jalan" sendiri
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearInterval(id);
  }, [total]);

  const currentSrc = failedSrcs.has(displayImages[index])
    ? "/rumah-1.jpg"
    : displayImages[index];

  useEffect(() => {
    setImgLoaded(loadedSrcs.has(currentSrc));
  }, [index, currentSrc, loadedSrcs]);

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
      <Image
        src={currentSrc}
        alt="Background"
        fill
        className="object-cover blur-xl scale-105 brightness-95"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
        priority={false}
        unoptimized
        aria-hidden
      />

      {!imgLoaded && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow">
            <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold text-gray-700">Loading. . .</span>
          </div>
        </div>
      )}

      <Image
        src={currentSrc}
        alt={title || "Property Image"}
        fill
        className="object-contain"
        key={currentSrc}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
        priority={false}
        unoptimized
        onLoadingComplete={() => {
          setLoadedSrcs((prev) => {
            const next = new Set(prev);
            next.add(currentSrc);
            return next;
          });
          setImgLoaded(true);
        }}
        onError={() => {
          setFailedSrcs((prev) => new Set([...prev, displayImages[index]]));
          setImgLoaded(true);
        }}
      />
      {/* Dots only (no arrow buttons) */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full z-20">
          {displayImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-[#FF8500] w-6" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}