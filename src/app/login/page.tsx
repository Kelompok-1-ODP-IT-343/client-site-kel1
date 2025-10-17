'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import { motion } from 'framer-motion';
import { Eye, EyeOff, LoaderCircle, ShieldAlert } from 'lucide-react';
import { loginApi } from '../lib/coreApi';

// Impor Header & Footer (asumsikan path-nya benar)
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Login() {
  const router = useRouter(); // <-- Inisialisasi router
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState(''); // <-- State untuk error dari API

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(''); // Hapus error API saat pengguna mulai mengetik lagi
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = { identifier: formData.email, password: formData.password };
      const data = await loginApi(payload);

      // Dukung berbagai bentuk respons: flat (jwt/token) atau nested (data.token)
      const flatToken = (data?.jwt as string) || (data?.token as string) || (data?.access_token as string);
      const nestedToken = (data?.data?.token as string) || undefined;
      const token = flatToken || nestedToken;
      const tokenType = (data?.data?.type as string) || 'Bearer';

      if (token) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('token_type', tokenType);
        if (data?.jwt) localStorage.setItem('jwt', data.jwt);
      }

      // Redirect ke dashboard
      router.push('/user/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || 'Terjadi kesalahan saat masuk. Coba lagi.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <Image
              src="/illustration-login.svg"
              alt="Ilustrasi KPR BNI"
              width={500}
              height={500}
              className="w-full h-auto"
            />
             <div className="mt-8 text-center text-gray-600">
                <h2 className="text-2xl font-bold text-bni-dark-blue">Wujudkan Rumah Impian Anda</h2>
                <p className="mt-2">Ajukan KPR BNI dengan mudah dan cepat melalui platform digital kami.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
              <div className="text-center mb-8">
                <Image src="/logo-satuatap.png" alt="SatuAtap BNI" width={60} height={60} className="mx-auto mb-4"/>
                <h1 className="text-3xl font-bold text-bni-dark-blue mb-2">
                  Selamat Datang Kembali
                </h1>
                <p className="text-bni-gray">
                  Masuk untuk melanjutkan proses KPR Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-bni-dark-blue mb-2">Email</label>
                  <input
                    type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-all ${ errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-bni-orange'}`}
                    placeholder="nama@email.com"
                  />
                  {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-bni-dark-blue mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-all ${ errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-bni-orange'}`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-bni-blue transition-colors">
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange}
                      className="h-4 w-4 text-bni-orange focus:ring-bni-orange border-gray-300 rounded" />
                    <label htmlFor="rememberMe" className="ml-2 block text-bni-gray">Ingat saya</label>
                  </div>
                  <Link href="#" className="font-medium text-bni-orange hover:text-bni-orange/80">Lupa password?</Link>
                </div>

                {/* Menampilkan Error dari API */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center">
                    <ShieldAlert size={20} className="mr-2 flex-shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Tombol dinonaktifkan jika form kosong atau sedang loading */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full flex justify-center items-center bg-bni-orange text-white font-semibold py-3 px-4 rounded-lg hover:bg-bni-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bni-orange transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? <><LoaderCircle className="animate-spin mr-2" size={20} /> Memproses...</> : 'Masuk'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-bni-gray">
                  Belum punya akun?{' '}
                  <Link href="/register" className="font-semibold text-bni-orange hover:text-bni-orange/80">Daftar sekarang</Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center px-4">
              <p className="text-xs text-bni-gray">
                Dengan masuk, Anda menyetujui{' '}
                <Link href="#" className="font-medium text-bni-dark-blue hover:underline">Syarat & Ketentuan</Link>
                {' '}serta{' '}
                <Link href="#" className="font-medium text-bni-dark-blue hover:underline">Kebijakan Privasi</Link>
                {' '}kami.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
