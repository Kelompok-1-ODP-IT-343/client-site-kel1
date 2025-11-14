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

  return (
    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden bg-gray-100">
      <Image
        src={currentSrc}
        alt={title || "Property Image"}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
        priority={false}
        unoptimized
        onError={() =>
          setFailedSrcs((prev) => new Set([...prev, displayImages[index]]))
        }
      />
      {/* Controls */}
      {total > 1 && (
        <>
          <button
            aria-label="Prev"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
          >
            <ChevronRight size={18} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
            {displayImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "bg-emerald-500 w-6" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}