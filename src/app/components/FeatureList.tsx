"use client";

import { motion } from "framer-motion";
import { BadgeInfo, BedSingle, Car, Droplet, Ruler, ShowerHead, Zap } from "lucide-react";

type Feature = { featureName: string; featureValue: string };

function getFeatureIcon(name: string) {
  const key = String(name || "").trim().toLowerCase();
  if (key.includes("listrik") || key.includes("power") || key.includes("electric")) return <Zap size={16} />;
  if (key.includes("air") || key.includes("pdam") || key.includes("water")) return <Droplet size={16} />;
  if (key.includes("carport") || key.includes("garasi") || key.includes("parkir") || key.includes("parking")) return <Car size={16} />;
  if (key.includes("kamar tidur") || key.includes("bedroom") || key.includes("bed")) return <BedSingle size={16} />;
  if (key.includes("kamar mandi") || key.includes("bath") || key.includes("shower")) return <ShowerHead size={16} />;
  if (key.includes("luas") || key.includes("tanah") || key.includes("bangunan") || key.includes("m2") || key.includes("m²")) return <Ruler size={16} />;
  return <BadgeInfo size={16} />;
}

export default function FeatureList({ features }: { features: Feature[] }) {
  if (!Array.isArray(features) || features.length === 0) {
    return <p className="text-gray-500">- Fitur tidak tersedia -</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      {features.map((f, idx) => (
        <motion.div
          key={`${f.featureName}-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25, delay: idx * 0.03 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2"
        >
          <div className="text-orange-500">{getFeatureIcon(f.featureName)}</div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">{f.featureName}</p>
            <p className="font-semibold text-gray-800">{f.featureValue || "-"}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
