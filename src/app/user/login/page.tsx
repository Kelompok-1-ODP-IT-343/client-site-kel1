"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Briefcase, FileText, Lock } from 'lucide-react';

// Asumsikan komponen Header dan Footer sudah ada
// import Header from '@/app/components/layout/Header';
// import Footer from '@/app/components/layout/Footer';

// Komponen Reusable untuk Input Field
const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-800 mb-2">
            {label}
        </label>
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

// Komponen Reusable untuk Select Field (Dropdown)
const SelectField = ({ label, name, value, onChange, error, children }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-800 mb-2">
            {label}
        </label>
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

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        fullName: '',
        email: '',
        phone: '',
        nik: '',
        birthPlace: '',
        birthDate: '',
        gender: '',
        maritalStatus: '',
        // Tambahkan state untuk step lain di sini jika diperlukan
    });
    const [errors, setErrors] = useState<any>({});

    const steps = [
        { number: 1, title: 'Data Pribadi' },
        { number: 2, title: 'Alamat' },
        { number: 3, title: 'Pekerjaan' },
        { number: 4, title: 'Informasi KPR' },
        { number: 5, title: 'Akun' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            // setErrors(prev => ({ ...prev, [name]: null }));
            setErrors((prev: { [key: string]: string }) => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors: any = {};
        if (!formData.fullName) newErrors.fullName = "Nama Lengkap wajib diisi.";
        if (!formData.email) newErrors.email = "Email wajib diisi.";
        // ... tambahkan validasi lain untuk step 1
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = true;
        if (currentStep === 1) {
            isValid = validateStep1();
        }
        // ... tambahkan validasi untuk step lain di sini
        
        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
            {/* <Header /> */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200"
            >
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                        Daftar Akun KPR BNI
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Lengkapi data Anda untuk mengajukan KPR
                    </p>
                </div>

                {/* Stepper Component */}
                <div className="flex items-center justify-center mb-10 px-4">
                    {steps.map((step, index) => (
                        <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300 ${
                                        currentStep > step.number ? 'bg-green-500 text-white' : 
                                        currentStep === step.number ? 'bg-yellow-400 text-gray-800' : 
                                        'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {currentStep > step.number ? '✔' : step.number}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold transition-colors w-20 ${
                                    currentStep >= step.number ? 'text-gray-700' : 'text-gray-400'
                                }`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition-all duration-500 mx-2 ${
                                    currentStep > step.number ? 'border-green-500' : 'border-gray-200'
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Informasi Data Pribadi
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <InputField label="Nama Lengkap *" name="fullName" placeholder="Nama Lengkap" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                                    <InputField label="Email *" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
                                    <InputField label="Nomor Telepon *" name="phone" type="tel" placeholder="Nomor Telepon" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                    <InputField label="NIK *" name="nik" placeholder="NIK" value={formData.nik} onChange={handleChange} error={errors.nik} />
                                    <InputField label="Tempat Lahir *" name="birthPlace" placeholder="Tempat Lahir" value={formData.birthPlace} onChange={handleChange} error={errors.birthPlace} />
                                    <InputField label="Tanggal Lahir *" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />
                                    <SelectField label="Jenis Kelamin *" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender}>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </SelectField>
                                    <SelectField label="Status Pernikahan *" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus}>
                                        <option value="">Pilih Status</option>
                                        <option value="single">Belum Menikah</option>
                                        <option value="married">Menikah</option>
                                        <option value="divorced">Cerai</option>
                                    </SelectField>
                                </div>
                            </div>
                        )}
                        {/* Placeholder untuk step lainnya */}
                        {currentStep === 2 && <div className="text-center p-8 text-gray-500">Isian untuk Alamat akan muncul di sini.</div>}
                        {currentStep === 3 && <div className="text-center p-8 text-gray-500">Isian untuk Pekerjaan akan muncul di sini.</div>}
                        {currentStep === 4 && <div className="text-center p-8 text-gray-500">Isian untuk Informasi KPR akan muncul di sini.</div>}
                        {currentStep === 5 && <div className="text-center p-8 text-gray-500">Isian untuk Akun akan muncul di sini.</div>}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="px-8 py-3 bg-yellow-100 text-yellow-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-yellow-200"
                    >
                        Sebelumnya
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-yellow-400 text-gray-800 font-bold rounded-lg transition-all hover:bg-yellow-500"
                    >
                        {currentStep === steps.length ? 'Daftar Sekarang' : 'Selanjutnya'}
                    </button>
                </div>
            </motion.div>
            {/* <Footer /> */}
        </div>
    );
}