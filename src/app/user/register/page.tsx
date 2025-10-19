"use client";

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================================================
// KOMPONEN-KOMPONEN REUSABLE
// ============================================================================

const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 transition-all duration-300 ${
                error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'
            }`}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
);

const SelectField = ({ label, name, value, onChange, error, children }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 appearance-none transition-all duration-300 ${
                error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'
            }`}
        >
            {children}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
);

const TextAreaField = ({ label, name, placeholder, value, onChange, error }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 transition-all duration-300 ${
                error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-yellow-400 focus:border-yellow-400'
            }`}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
);

// ============================================================================
// KOMPONEN UTAMA HALAMAN REGISTER
// ============================================================================
export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Data Pribadi
        fullName: "", email: "", phone: "", nik: "", birthPlace: "", birthDate: "", gender: "", maritalStatus: "",
        // Step 2: Alamat
        address: "", city: "", province: "", postalCode: "",
        // Step 3: Pekerjaan
        occupation: "", companyName: "", monthlyIncome: "", workExperience: "",
        // Step 4: Informasi KPR
        propertyType: "", tenor: "",
        // Step 5: Akun
        password: "", confirmPassword: "", agreeTerms: false, agreePrivacy: false,
    });
    
    // <<< INI PERBAIKANNYA >>>
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const steps = [
        { number: 1, title: 'Data Pribadi' }, { number: 2, title: 'Alamat' },
        { number: 3, title: 'Pekerjaan' }, { number: 4, title: 'Informasi KPR' },
        { number: 5, title: 'Buat Akun' },
    ];

    const formatSalary = (value: string): string => {
        const rawValue = value.replace(/[^0-9]/g, "");
        if (!rawValue) return "";
        return new Intl.NumberFormat("id-ID").format(Number(rawValue));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        let finalValue: string | boolean = type === 'checkbox' ? checked : value;

        if (name === "nik" || name === "postalCode") {
            finalValue = value.replace(/[^0-9]/g, "");
        } else if (name === "monthlyIncome") {
            finalValue = formatSalary(value);
        }
        
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: { [key: string]: string } = {};
        
        if (step === 1) {
            if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi.";
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format email tidak valid.";
            if (!formData.nik || formData.nik.length !== 16) newErrors.nik = "NIK harus 16 digit.";
            if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi.";
        }
        if (step === 2) {
            if (!formData.address) newErrors.address = "Alamat wajib diisi.";
            if (!formData.city) newErrors.city = "Kota/Kabupaten wajib diisi.";
            if (!formData.province) newErrors.province = "Provinsi wajib diisi.";
            if (!formData.postalCode) newErrors.postalCode = "Kode Pos wajib diisi.";
        }
        if (step === 3) {
            if (!formData.occupation) newErrors.occupation = "Pekerjaan wajib diisi.";
            if (!formData.companyName) newErrors.companyName = "Nama perusahaan wajib diisi.";
            if (!formData.monthlyIncome) newErrors.monthlyIncome = "Penghasilan wajib diisi.";
            if (!formData.workExperience) newErrors.workExperience = "Pengalaman kerja wajib diisi.";
        }
        if (step === 4) {
            if (!formData.propertyType) newErrors.propertyType = "Jenis properti wajib diisi.";
            if (!formData.tenor) newErrors.tenor = "Tenor wajib diisi.";
        }
        if (step === 5) {
            if (!formData.password || formData.password.length < 8) newErrors.password = "Password minimal 8 karakter.";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
            if (!formData.agreeTerms) newErrors.agreeTerms = "Anda harus menyetujui Syarat & Ketentuan.";
            if (!formData.agreePrivacy) newErrors.agreePrivacy = "Anda harus menyetujui Kebijakan Privasi.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleNext = () => {
        if (validateStep(currentStep) && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(5)) {
            console.log("Form Submitted:", formData);
            alert("Pendaftaran berhasil! (Demo)");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
            {/* <Header /> */}
            <motion.div
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Daftar Akun KPR BNI</h1>
                    <p className="mt-2 text-gray-500">Lengkapi data Anda untuk mengajukan KPR</p>
                </div>

                {/* Symmetrical Progress Bar */}
                <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-8 mb-12">
                    {/* Background line */}
                    <div className="absolute top-5 left-0 right-0 h-[3px] bg-gray-200" 
                         style={{ 
                           marginLeft: 'calc(2.5rem)',
                           marginRight: 'calc(2.5rem)' 
                         }} 
                    />
                    
                    {/* Progress line */}
                    <div 
                        className="absolute top-5 left-0 h-[3px] bg-green-500 transition-all duration-500 ease-out"
                        style={{ 
                          width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${2.5 * (1 - (currentStep - 1) / (steps.length - 1))}rem)`,
                          marginLeft: 'calc(2.5rem)'
                        }}
                    />

                    {/* Steps */}
                    <div className="relative flex justify-between items-start">
                        {steps.map((step) => {
                          const isComplete = currentStep > step.number;
                          const isActive = currentStep === step.number;
                          const isInactive = currentStep < step.number;

                          return (
                            <div key={step.number} className="flex flex-col items-center" style={{ flex: 1 }}>
                              {/* Circle */}
                              <div
                                className={`
                                  w-10 h-10 flex items-center justify-center rounded-full font-bold 
                                  shadow-md transition-all duration-300 relative z-10
                                  ${isComplete ? "bg-green-500 text-white" : ""}
                                  ${isActive ? "bg-orange-500 text-white scale-110" : ""}
                                  ${isInactive ? "bg-gray-200 text-gray-400" : ""}
                                `}
                              >
                                {isComplete ? "✓" : step.number}
                              </div>

                              {/* Label */}
                              <p
                                className={`
                                  mt-3 text-xs sm:text-sm text-center font-semibold leading-tight
                                  transition-colors duration-300 px-1
                                  ${isComplete || isActive ? "text-gray-800" : "text-gray-400"}
                                `}
                              >
                                {step.title}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                            {currentStep === 1 && (
                                <StepContent title="Informasi Data Pribadi">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <InputField label="Nama Lengkap *" name="fullName" placeholder="Sesuai KTP" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                                        <InputField label="Email *" name="email" type="email" placeholder="contoh@email.com" value={formData.email} onChange={handleChange} error={errors.email} />
                                        <InputField label="Nomor Telepon *" name="phone" type="tel" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                        <InputField label="NIK *" name="nik" placeholder="16 digit NIK" value={formData.nik} onChange={handleChange} error={errors.nik} />
                                        <InputField label="Tempat Lahir *" name="birthPlace" placeholder="Kota Kelahiran" value={formData.birthPlace} onChange={handleChange} error={errors.birthPlace} />
                                        <InputField label="Tanggal Lahir *" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />
                                        <SelectField label="Jenis Kelamin *" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender}><option value="">Pilih</option><option value="male">Laki-laki</option><option value="female">Perempuan</option></SelectField>
                                        <SelectField label="Status Pernikahan *" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus}><option value="">Pilih</option><option value="single">Belum Menikah</option><option value="married">Menikah</option><option value="divorced">Cerai</option></SelectField>
                                    </div>
                                </StepContent>
                            )}
                            {currentStep === 2 && (
                                <StepContent title="Informasi Alamat">
                                    <div className="space-y-6">
                                        <TextAreaField label="Alamat Lengkap *" name="address" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" value={formData.address} onChange={handleChange} error={errors.address} />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                            <InputField label="Kota / Kabupaten *" name="city" placeholder="Kota/Kabupaten" value={formData.city} onChange={handleChange} error={errors.city} />
                                            <InputField label="Provinsi *" name="province" placeholder="Provinsi" value={formData.province} onChange={handleChange} error={errors.province} />
                                            <InputField label="Kode Pos *" name="postalCode" placeholder="Kode Pos" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
                                        </div>
                                    </div>
                                </StepContent>
                            )}
                            {currentStep === 3 && (
                                <StepContent title="Informasi Pekerjaan">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <InputField label="Pekerjaan *" name="occupation" placeholder="Contoh: Karyawan Swasta" value={formData.occupation} onChange={handleChange} error={errors.occupation} />
                                        <InputField label="Nama Perusahaan *" name="companyName" placeholder="Tempat Bekerja" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
                                        <InputField label="Penghasilan Bulanan (Rp) *" name="monthlyIncome" placeholder="Contoh: 10.000.000" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} />
                                        <InputField label="Pengalaman Kerja *" name="workExperience" placeholder="Contoh: 5 Tahun" value={formData.workExperience} onChange={handleChange} error={errors.workExperience} />
                                    </div>
                                </StepContent>
                            )}
                             {currentStep === 4 && (
                                <StepContent title="Informasi KPR">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <SelectField label="Jenis Properti *" name="propertyType" value={formData.propertyType} onChange={handleChange} error={errors.propertyType}><option value="">Pilih Jenis Properti</option><option value="house">Rumah</option><option value="apartment">Apartemen</option></SelectField>
                                        <SelectField label="Tenor (Jangka Waktu) *" name="tenor" value={formData.tenor} onChange={handleChange} error={errors.tenor}><option value="">Pilih Tenor</option><option value="10">10 Tahun</option><option value="15">15 Tahun</option><option value="20">20 Tahun</option></SelectField>
                                    </div>
                                </StepContent>
                            )}
                             {currentStep === 5 && (
                                <StepContent title="Informasi Akun">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <InputField label="Password *" name="password" type="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} error={errors.password} />
                                        <InputField label="Retype Password *" name="confirmPassword" type="password" placeholder="Ulangi password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        <label className="flex items-center gap-3 text-sm text-gray-600">
                                            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"/> 
                                            Saya menyetujui <Link to="/terms" className="text-blue-600 hover:underline font-medium">Syarat & Ketentuan BNI</Link> *
                                        </label>
                                        {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}
                                        <label className="flex items-center gap-3 text-sm text-gray-600">
                                            <input type="checkbox" name="agreePrivacy" checked={formData.agreePrivacy} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"/> 
                                            Saya menyetujui <Link to="/privacy" className="text-blue-600 hover:underline font-medium">Kebijakan Privasi BNI</Link> *
                                        </label>
                                        {errors.agreePrivacy && <p className="text-red-500 text-xs">{errors.agreePrivacy}</p>}
                                    </div>
                                </StepContent>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="flex justify-between items-center mt-12">
                        <button type="button" onClick={handlePrevious} disabled={currentStep === 1} className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-300">
                            Sebelumnya
                        </button>
                        {currentStep < steps.length ? (
                            <button type="button" onClick={handleNext} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg transition-all hover:bg-orange-600">
                                Selanjutnya
                            </button>
                        ) : (
                            <button type="submit" className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg transition-all hover:bg-green-600">
                                Daftar Sekarang
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
            {/* <Footer /> */}
        </div>
    );
}

// Komponen Helper untuk judul setiap step
const StepContent = ({ title, children }: { title: string; children: ReactNode }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">{title}</h2>
        {children}
    </div>
);
