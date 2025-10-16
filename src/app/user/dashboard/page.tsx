"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CheckCircle2, FileText, Loader2, RefreshCcw, MapPin, Sparkles, Home, Phone, Mail, MapPinned, Facebook, Instagram, Linkedin,
} from "lucide-react";

type AppStatus = "Disetujui" | "Dalam Review" | "Ditolak";
type Application = { id:number; cluster:string; city:string; status:AppStatus; loanAmount:number; date:string; image:string; };

export default function DashboardPage() {
  const COLORS = { teal: "#3FD8D4", gray: "#757575", orange: "#FF8500", lime: "#DDEE59", blue: "#C5F3F3" };

  const [applications] = useState<Application[]>([
    { id:1, cluster:"Cluster Green Valley", city:"Serpong, Banten", status:"Disetujui", loanAmount:1500000, date:"15 Juli 2025", image:"/images/rumah1.jpg" },
    { id:2, cluster:"Cluster Green Valley", city:"Serpong, Banten", status:"Disetujui", loanAmount:1500000, date:"15 Juli 2025", image:"/images/rumah2.jpg" },
  ]);

  const totalApps = applications.length;
  const approved = applications.filter(a=>a.status==="Disetujui").length;
  const inReview = applications.filter(a=>a.status==="Dalam Review").length;
  const totalLoan = useMemo(()=>applications.reduce((s,a)=>s+a.loanAmount,0),[applications]);
  const formatIDR = (n:number)=> n.toLocaleString("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0});

  const statusStyle = (status:AppStatus) => ({
    "Disetujui":   { chip:"text-green-700 border-green-600",  dot:"bg-green-600" },
    "Dalam Review":{ chip:"text-yellow-700 border-yellow-600", dot:"bg-yellow-500" },
    "Ditolak":     { chip:"text-red-700 border-red-600",       dot:"bg-red-600" },
  }[status]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image src="/logo-satuatap.png" alt="Logo" fill className="object-contain"/>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#FF8500]">satuatap</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <a className="text-gray-700 hover:text-[#FF8500] transition" href="/">Beranda</a>
            <a className="text-gray-700 hover:text-[#FF8500] transition" href="/user/cari-rumah">Cari Rumah</a>
            <a className="text-gray-700 hover:text-[#FF8500] transition" href="/user/simulasi">Simulasi</a>
          </nav>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded-full text-white text-sm shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "#0f766e" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* DASHBOARD HEADER */}
      <section className="py-12" style={{ backgroundColor: COLORS.blue }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              Dashboard Tracking KPR
            </h1>
            <p className="text-gray-700 mt-2">
              Kelola aplikasi KPR Anda dengan mudah melalui dashboard ini
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard icon={<FileText size={28}/>} title="Total Aplikasi" value={String(totalApps)} accent="#3FD8D4" sub="Aplikasi tercatat"/>
            <SummaryCard icon={<CheckCircle2 size={28}/>} title="Disetujui" value={String(approved)} accent="#16a34a" sub="Lolos verifikasi"/>
            <SummaryCard icon={<Loader2 size={28}/>} title="Dalam Review" value={String(inReview)} accent="#FF8500" sub="Menunggu proses"/>
            <SummaryCard icon={<RefreshCcw size={28}/>} title="Total Pinjaman" value={formatIDR(totalLoan)} accent="#4f46e5" sub="Akumulasi nilai" isMoney/>
          </div>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Total Aplikasi KPR Saya</h2>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600"><Sparkles size={16}/> <span>Tampilan baru dengan tema SatuAtap</span></div>
        </div>

        <div className="flex flex-col gap-6">
          {applications.map(app=>{
            const s = statusStyle(app.status);
            return (
              <div key={app.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className="grid md:grid-cols-[320px_1fr]">
                  <div className="relative h-48 md:h-full">
                    <Image src={app.image} alt={app.cluster} fill className="object-cover" sizes="(min-width: 768px) 320px, 100vw"/>
                    <div className="absolute inset-0" style={{ background:`linear-gradient(180deg, transparent 40%, ${COLORS.teal}22 100%)` }}/>
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-gray-800 bg-white/80 backdrop-blur border border-white/60 shadow-sm"><Home size={14}/> Properti</div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 bg-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{app.cluster}</h3>
                        <p className="flex items-center text-gray-600 mt-1 text-sm"><MapPin size={16} className="mr-1"/> {app.city}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm font-semibold border ${s.chip}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${s.dot}`}/>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <InfoItem label="ID Aplikasi" value={`KPR-${app.id.toString().padStart(4,"0")}`}/>
                      <InfoItem label="Jumlah Pinjaman" value={formatIDR(app.loanAmount)}/>
                      <InfoItem label="Tanggal Pengajuan" value={app.date}/>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="inline-flex items-center gap-1"><MapPinned size={14}/> Lokasi strategis</div>
                        <div className="inline-flex items-center gap-1"><Sparkles size={14}/> Promo KPR BNI*</div>
                      </div>
                      <button className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-md transition" style={{ background:`linear-gradient(90deg, ${COLORS.teal}, ${COLORS.lime})` }}>Lihat Detail</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


    </div>
  );
}

function SummaryCard({ icon, title, value, sub, accent, isMoney=false }:{
  icon:React.ReactNode; title:string; value:string; sub?:string; accent:string; isMoney?:boolean;
}) {
  return (
    <div className="relative rounded-2xl p-5 bg-white/80 backdrop-blur border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition" style={{ boxShadow:`0 8px 28px -12px ${accent}55` }}>
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white shadow" style={{ background:`linear-gradient(135deg, ${accent}, ${accent}cc)` }}>{icon}</div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background:accent }}>{sub ?? "—"}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-1 font-extrabold tracking-tight ${isMoney ? "text-xl":"text-3xl"}`}>{value}</p>
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-1 rounded-b-2xl" style={{ background:`linear-gradient(90deg, ${accent}, transparent)` }}/>
    </div>
  );
}
function InfoItem({ label, value }:{ label:string; value:string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <p className="text-xs font-semibold" style={{ color: "#757575" }}>{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}