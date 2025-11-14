"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeInfo, BedDouble, Bath, Car, Home as HomeIcon, Ruler } from "lucide-react";

type Feature = { featureName: string; featureValue: string };

function getFeatureIcon(name: string) {
  const key = String(name || "").trim().toLowerCase();
  if (key.includes("kamar tidur")) return <BedDouble size={16} />;
  if (key.includes("kamar mandi")) return <Bath size={16} />;
  if (key.includes("luas bangunan") || key.includes("luas tanah")) return <HomeIcon size={16} />;
  if (key.includes("garasi") || key.includes("carport") || key.includes("parkir")) return <Car size={16} />;
  if (key.includes("lantai")) return <Ruler size={16} />;
  return <BadgeInfo size={14} />;
}

export default function FeatureList({ features }: { features: Feature[] }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 6;

  const list = useMemo(() => {
    if (!Array.isArray(features)) return [];
    return features.filter((f) => f && f.featureName);
  }, [features]);

  if (!list || list.length === 0) {
    return <p className="text-gray-500 text-sm">- Fitur tidak tersedia -</p>;
  }

  const visible = expanded ? list : list.slice(0, limit);
  const showToggle = list.length > limit;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {visible.map((f, idx) => (
          <motion.div
            key={`${f.featureName}-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                {getFeatureIcon(f.featureName)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{f.featureName}</p>
                <p className="font-semibold text-gray-900">{f.featureValue || "-"}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-orange-600 hover:underline"
        >
          {expanded ? "Tampilkan lebih sedikit" : "Selengkapnya…"}
        </button>
      )}
    </div>
  );
}
