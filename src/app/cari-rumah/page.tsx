"use client";

import { useState, useMemo, ReactNode, useEffect, Suspense, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    ChevronDown,
    MapPin,
    BedDouble,
    Bath,
    Home as HomeIcon,
    Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Dialog from "@/components/ui/Dialog";

import { fetchPropertyList, toggleFavorite, fetchUserFavorites } from "@/app/lib/coreApi";
import type { PropertyListItem } from "@/app/lib/types";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
const ITEMS_PER_PAGE = 6;

function CariRumahContent() {
    // Normalize property type labels to a single canonical form used by the UI
    const normalizeTypeLabel = (v: string | null | undefined) => {
        const s = (v || "").toString();
        if (/apart/i.test(s)) return "Apartemen";
        if (!s) return "";
        return "Rumah"; // default bucket for non-apartemen values
    };
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        title: "", // DIUBAH DARI 'name'
        description: "", // DITAMBAHKAN
        location: "",
        type: "",
        budget: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoggedIn,setIsLoggedIn] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [items, setItems] = useState<PropertyListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [userData, setUserData] = useState<{ id: number | string } | null>(null);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [loginNextUrl, setLoginNextUrl] = useState<string>("");
    const [loginPromptReason, setLoginPromptReason] = useState<"ajukan" | "favorite">("ajukan");
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userString = localStorage.getItem("user");
            if (userString) {
                try {
                    const user = JSON.parse(userString);
                    setUserData(user);
                    setIsLoggedIn(true);
                } catch (e) {
                    console.error("Gagal parse data user dari localStorage", e);
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        }
    }, []);
    // Ambil wishlist awal agar ikon hati sesuai dengan status server
    useEffect(() => {
        (async () => {
            if (!isLoggedIn) return;
            try {
                const res = await fetchUserFavorites();
                if (res && res.success && Array.isArray(res.data)) {
                    const ids = Array.from(new Set(res.data.map((it: any) => Number(it.property_id)).filter(Boolean)));
                    setFavorites(ids);
                }
            } catch (e) {
                console.warn("Gagal memuat wishlist awal", e as any);
            }
        })();
    }, [isLoggedIn]);
    const debouncedSearchName = useDebounce(filters.title,  500);

    // Initialize filters from URL query on first load or when URL changes externally
    useEffect(() => {
        if (!searchParams) return;
        const urlTitle = searchParams.get("title") || searchParams.get("name") || ""; // Tambahkan fallback 'name'
        const urlDescription = searchParams.get("description") || urlTitle; // Gunakan urlTitle sebagai fallback untuk description
        const urlCity = searchParams.get("city") || "";
        // Support both old 'tipeProperti' and new 'propertyType'
    const urlType = searchParams.get("propertyType") || searchParams.get("tipeProperti") || "";
        // Prefer new minPrice/maxPrice; fallback to legacy 'budget'
        const urlMinPrice = searchParams.get("minPrice");
        const urlMaxPrice = searchParams.get("maxPrice");
        const urlBudget = deriveBudgetValueFromQuery(urlMinPrice, urlMaxPrice) || searchParams.get("budget") || "";

        // Only set when different to avoid unnecessary renders
        setFilters((prev) => {
            if (
                prev.title === urlTitle &&
                prev.description === urlDescription &&
                prev.location === urlCity &&
                // backend expects uppercase, UI shows capitalized; keep raw here
                (prev.type?.toUpperCase?.() || "") === (urlType || "") &&
                prev.budget === urlBudget
            ) {
                return prev;
            }
            return {
                title: urlTitle,
                description: urlDescription,
                location: urlCity,
                type: normalizeTypeLabel(urlType),
                budget: urlBudget,
            };
        });
    }, [searchParams]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const priceRange = parseBudget(filters.budget);
                const { items } = await fetchPropertyList({
                    title: debouncedSearchName || undefined,
                    description: debouncedSearchName || undefined, // Menggunakan nilai input yang sama untuk title dan description
                    city: filters.location || undefined,
                    propertyType: filters.type ? filters.type.toLowerCase() : undefined,
                    minPrice: priceRange?.min,
                    maxPrice: priceRange?.max,
                });
                setItems(items);
            } catch (e: any) {
                setError(e.message || "Gagal memuat data");
            } finally {
                setLoading(false);
            }
        })();
    }, [debouncedSearchName, filters.location, filters.type, filters.budget]);

    // Build URL query from current filters
    const buildQueryFromFilters = () => {
        const sp = new URLSearchParams();
        if (filters.title) sp.set("title", filters.title);
        if (filters.description) sp.set("description", filters.description);
        if (filters.location) sp.set("city", filters.location);
        if (filters.type) sp.set("propertyType", filters.type.toLowerCase());
        const range = parseBudget(filters.budget);
        if (range?.min !== undefined) sp.set("minPrice", String(range.min));
        if (range?.max !== undefined) sp.set("maxPrice", String(range.max));
        return sp.toString();
    };

    // Debounce URL updates to prevent hitting replaceState limits
    const debouncedUrlQuery = useDebounce(buildQueryFromFilters(), 400);
    const lastUrlQueryRef = useRef<string>("");

    // Sync filters to URL (address bar) with debounced updates and loop guard
    useEffect(() => {
        const newQuery = debouncedUrlQuery;
        const nextUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
        // Prefer window.location for current value to avoid object identity churn
        const current = typeof window !== "undefined"
            ? window.location.search.replace(/^\?/, "")
            : "";
        if (newQuery && lastUrlQueryRef.current === newQuery) return;
        if (current !== newQuery) {
            lastUrlQueryRef.current = newQuery;
            router.replace(nextUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedUrlQuery, pathname, router]);

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // LOGIKA PERBAIKAN SINTAKSIS DAN LOGIKA
        if (name === 'title') {
            // Input pencarian utama: sync nilai ke title DAN description
            setFilters((prev) =>
                ({
                    ...prev,
                    title: value,
                    description: value // Menyinkronkan nilai ke description untuk ditampilkan di URL
                }));
        } else if (name === 'type') {
            setFilters((prev) => ({ ...prev, type: normalizeTypeLabel(value) }));
        } else {
            // Filter lain (location, type, budget)
            setFilters((prev) => ({ ...prev, [name]: value }));
        }

        // Pindahkan setCurrentPage ke sini (setelah state diperbarui)
        setCurrentPage(1);
    };

    const handleToggleFavorite = async (houseId: number) => {
        if (!isLoggedIn || !userData) {
            const current = typeof window !== "undefined"
                ? window.location.search.replace(/^\?/, "")
                : "";
            const nextPath = current ? `${pathname}?${current}` : pathname;
            setLoginNextUrl(nextPath);
            setLoginPromptReason("favorite");
            setShowLoginDialog(true);
            return;
        }

        try {
            const response = await toggleFavorite(houseId);

            if (response.success) {
                const status = response.data.status;

                if (status === "added") {
                    setFavorites((prev) => Array.from(new Set([...prev, houseId])));
                } else if (status === "removed") {
                    setFavorites((prev) => prev.filter((id) => id !== houseId));
                }
            } else {
                setError(response.message || "Terjadi kesalahan.");
            }
        } catch (error) {
            console.error(error);
            setError("Terjadi kesalahan koneksi saat mengubah favorit.");
        }
    };
    const handleAjukan = (house: PropertyListItem) => {
        const params = new URLSearchParams({
            propertiId: String(house.id),
            propertiNama: house.title,
            propertiLokasi: house.city || "",
            hargaProperti: String(house.price),
        });
        const target = `/user/pengajuan?${params.toString()}`;
        if (!isLoggedIn) {
            setLoginNextUrl(target);
            setLoginPromptReason("ajukan");
            setShowLoginDialog(true);
            return;
        }
        router.push(target);
    };

    const locationOptions = useMemo(() => {
        const s = new Set<string>();
        // Always include the currently selected location so the select doesn't reset when no results
        if (filters.location) s.add(filters.location);
        items.forEach((i) => i.city && s.add(i.city));
        return Array.from(s);
    }, [items, filters.location]);

    const typeOptions = useMemo(() => {
        const s = new Set<string>();
        // Preserve current selection even if not present in items
        if (filters.type) s.add(normalizeTypeLabel(filters.type));
        items.forEach((i) => {
            const raw = (i.property_type || i.listing_type || "").toString();
            if (!raw) return;
            // Normalize to user-facing labels
            s.add(normalizeTypeLabel(raw));
        });
        // Fallback to common types if still empty
        if (s.size === 0) {
            s.add("Rumah");
            s.add("Apartemen");
        }
        return Array.from(s);
    }, [items, filters.type]);
    const budgetOptions = [
        { label: "< Rp 1 Miliar", value: "0-1000000000" },
        { label: "Rp 1 M - 2 M", value: "1000000000-2000000000" },
        { label: "Rp 2 M - 5 M", value: "2000000000-5000000000" },
        { label: "> Rp 5 Miliar", value: "5000000000" },
    ];

    const filtered = items.filter((i) => {
        return true;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    const currentHouses = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <section className="mb-12">
                <div className="bg-teal-100 rounded-2xl">
                    <div className="px-8 sm:px-12 lg:px-16 xl:px-20 py-12">
                        <h1 className="text-4xl font-extrabold text-center tracking-tight bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mb-6">
                            Eksplor Rumah Impian
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mt-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Cari Rumah
                            </label>
                            <input
                                type="text"
                                name="title" // PERBAIKAN: Harus 'title'
                                placeholder="Nama Rumah Impianmu"
                                value={filters.title}
                                onChange={handleFilterChange}
                                className="w-full appearance-none bg-white border border-black rounded-lg py-2.5 px-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Lokasi
                            </label>
                            <div className="relative">
                                <select
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="w-full appearance-none bg-white border border-black rounded-lg py-2.5 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                >
                                    <option value="">Semua Lokasi</option>
                                    {locationOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Tipe
                            </label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full appearance-none bg-white border border-black rounded-lg py-2.5 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                >
                                    <option value="">Semua Tipe</option>
                                    {typeOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Rentang Harga
                            </label>
                            <div className="relative">
                                <select
                                    name="budget"
                                    value={filters.budget}
                                    onChange={handleFilterChange}
                                    className="w-full appearance-none bg-white border border-black rounded-lg py-2.5 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                                >
                                    <option value="">Semua Harga</option>
                                    {budgetOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                {loading ? (
                    <div className="text-center py-20">Memuat data…</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-600">{error}</div>
                ) : currentHouses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentHouses.map((house) => (
                                <HouseCard
                                    key={house.id}
                                    house={house}
                                    isFavorite={favorites.includes(house.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    onAjukan={() => handleAjukan(house)}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Back
                                </button>
                                <span className="text-sm text-gray-700">
                  Hal <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 col-span-full">
                        <h3 className="text-2xl font-bold text-bni-dark-blue">
                            Tidak ada rumah yang cocok.
                        </h3>
                        <p className="mt-2 text-bni-gray">
                            Silakan ubah kriteria pencarian Anda.
                        </p>
                    </div>
                )}
            </section>

            <Dialog
              open={showLoginDialog}
              title="Masuk ke Akun"
              description={
                <p>
                  {loginPromptReason === "favorite"
                    ? "Silakan login untuk menyimpan favorit."
                    : "Untuk mengajukan KPR, silakan masuk terlebih dahulu."}
                </p>
              }
              onClose={() => setShowLoginDialog(false)}
              actions={
                <button
                  type="button"
                  onClick={() => router.push(`/login?next=${encodeURIComponent(loginNextUrl)}`)}
                  className="px-4 py-2 rounded-md bg-[#FF8500] text-white hover:bg-[#e67800]"
                >
                  Masuk Sekarang
                </button>
              }
            />
        </div>
    );
}

// Helper to rebuild dropdown value from URL's minPrice/maxPrice
function deriveBudgetValueFromQuery(minStr: string | null, maxStr: string | null) {
    const min = minStr ? parseInt(minStr, 10) : undefined;
    const max = maxStr ? parseInt(maxStr, 10) : undefined;
    if (Number.isFinite(min) && Number.isFinite(max)) return `${min}-${max}`;
    if (Number.isFinite(min) && !Number.isFinite(max)) return `${min}`;
    return "";
}

function parseBudget(v: string) {
    if (!v) return null;
    const [minStr, maxStr] = v.split("-");
    const min = parseInt(minStr, 10);
    const max = maxStr ? parseInt(maxStr, 10) : undefined;
    return {
        min: isNaN(min) ? undefined : min,
        max: isNaN(Number(max)) ? undefined : max,
    };
}

function HouseCard({
                       house,
                       isFavorite,
                       onToggleFavorite,
                       onAjukan,
                   }: {
    house: PropertyListItem;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    onAjukan: () => void;
}) {
    const router = useRouter();
    const formattedPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(house.price);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState<string>(house.main_image || "/img.png");

    const goToDetail = () => router.push(`/detail-rumah/${house.id}`);

    // Normalisasi fitur agar bisa ditampilkan dengan ikon seperti di desain
    const featureMap = new Map<string, string>();
    (house.parsedFeatures || []).forEach((f) => {
        if (f?.key) featureMap.set(String(f.key).toLowerCase(), String(f.value ?? ""));
    });

    const getFeature = (aliases: string[]) => {
        for (const a of aliases) {
            const v = featureMap.get(a.toLowerCase());
            if (v) return v;
        }
        return null;
    };

  const bedroom = getFeature(["kamar tidur", "bedroom", "kamar_tidur", "bedrooms"]); // jumlah
  const bathroom = getFeature(["kamar mandi", "bathroom", "kamar_mandi", "bathrooms"]);
  // Prefer direct numeric fields from body; fallback to parsed features string
  const buildingArea = (house as any).building_area != null
    ? `${(house as any).building_area} m²`
    : getFeature(["luas bangunan", "building area", "luas_bangunan", "lb"]);
  const landArea = (house as any).land_area != null
    ? `${(house as any).land_area} m²`
    : getFeature(["luas tanah", "land area", "luas_tanah", "lt"]);
  const isDeveloperPilihan = (house as any).is_developer_pilihan ?? String(house.listing_type || "").toUpperCase() === "PRIMARY";
  const developerBadge = isDeveloperPilihan ? "Developer Pilihan" : "Developer Kerja Sama";

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={goToDetail}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col cursor-pointer"
        >
            <div className="relative w-full aspect-[16/9]">
                {!imgLoaded && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow">
                            <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                            <span className="text-sm font-semibold text-gray-700">Loading. . .</span>
                        </div>
                    </div>
                )}
                <Image
                    src={imgSrc}
                    alt="Background"
                    fill
                    priority={false}
                    className="object-cover blur-xl scale-105 brightness-95"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    aria-hidden
                />
                <Image
                    src={imgSrc}
                    alt={house.title}
                    fill
                    priority={false}
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onLoadingComplete={() => setImgLoaded(true)}
                    onError={() => {
                        setImgLoaded(true);
                        setImgSrc("/img.png");
                    }}
                    unoptimized
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          <span className="inline-flex self-start bg-orange-500 text-white text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {(house.property_type || "Rumah").toString().toUpperCase()}
          </span>
          <span
            className={`inline-flex self-start text-white text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm uppercase ${
              isDeveloperPilihan ? "bg-red-600" : "bg-gray-500"
            }`}
          >
            {developerBadge}
          </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(house.id);
                    }}
                    className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 rounded-full transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 z-20"
                    // className="absolute top-3 right-3 bg-white/80 hover:bg-white shadow-md backdrop-blur-xl p-2 rounded-full transition z-20 border border-gray-200"

                    aria-label="Toggle Favorite"
                    aria-pressed={isFavorite}
                >
                    <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    className={
                        isFavorite
                        ? "fill-red-500 text-red-500 transition-all duration-300"
                        : "fill-transparent text-gray-700 transition-all duration-300"
                    }
                    >
                    <path
                        d="M12.1 20.55l-.1.1-.11-.1C7.14 16.24 4 13.39 4 9.88 4 7.17 6.17 5 8.88 5c1.54 0 3.04.73 4.12 1.88A5.93 5.93 0 0 1 17.12 5C19.83 5 22 7.17 22 9.88c0 3.51-3.14 6.36-7.89 10.67z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                </button>
            </div>

            <div className="px-3 pb-3 pt-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-lg truncate mt-1">
                    {house.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1 mb-0.5">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    {house.city}
                </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 mt-0.5 py-1 border-y border-black min-h-[48px]">
                    {[
                        { Icon: BedDouble, label: "Kamar Tidur", value: bedroom },
                        { Icon: Bath, label: "Kamar Mandi", value: bathroom },
                        { Icon: HomeIcon, label: "Luas Bangunan", value: buildingArea },
                        { Icon: HomeIcon, label: "Luas Tanah", value: landArea },
                    ].map(({ Icon, label, value }, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                <Icon size={16} className="text-green-600" />
                            </div>
                            <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">
                  {value ?? "-"}
                </span>
                <span className="text-gray-500">{label}</span>
              </div>
            </div>
          ))}
        </div>
                <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-0.5">Harga mulai</p>
                    <p className="text-xl font-bold mb-0.5">
                      <span className="text-bni-orange">Rp</span>{" "}
                      <span className="text-bni-orange">{formattedPrice.replace(/^Rp\s*/, "")}</span>
                    </p>
                </div>

        <div className="mt-0.5 pt-0.5 flex-grow flex items-end">
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAjukan();
              }}
                            className="py-2 rounded-lg font-semibold text-sm text-white shadow transition hover:opacity-90"
                            style={{ backgroundColor: "#FF8500" }}
                        >
                            Ajukan
                        </button>
                        <Link
                            href={`/detail-rumah/${house.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="py-2 rounded-lg font-semibold text-sm text-center text-gray-900 shadow transition hover:opacity-90"
                            style={{ backgroundColor: "#DDEE59" }}
                        >
                            Detail
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CariRumahPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Memuat halaman…</div>}>
            <CariRumahContent />
        </Suspense>
    );
}
