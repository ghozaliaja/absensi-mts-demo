'use client'
import { useState, useRef } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GuruPage() {
    // SIMULASI DATABASE GURU (Hardcode buat Demo)
    const daftarGuru = [
        "Ust. Kamal",
        "Ust. Toni",
        "Ustadzah Siti",
        "Pak Budi (IPA)",
        "Bu Rini (MTK)"
    ]

    const [step, setStep] = useState<'LOGIN' | 'SCAN'>('LOGIN')
    const [selectedGuru, setSelectedGuru] = useState('')
    const [password, setPassword] = useState('')
    const [scanResult, setScanResult] = useState('')
    const [loading, setLoading] = useState(false)

    // Lock untuk mencegah double scan
    const isProcessing = useRef(false)

    // 1. FUNGSI LOGIN BOONGAN
    const handleLogin = () => {
        if (!selectedGuru) return alert("Pilih nama guru dulu Tadz!")

        // Password universal buat demo
        if (password === '123456') {
            setStep('SCAN')
        } else {
            alert("Password salah! Coba: 123456")
        }
    }

    // 2. FUNGSI SCAN (Updated with @yudiel/react-qr-scanner logic)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        if (result && result.length > 0 && selectedGuru) {
            if (isProcessing.current) return

            isProcessing.current = true
            setLoading(true)

            const qrText = result[0].rawValue

            if (qrText) {
                setScanResult(qrText)
                // Kirim nama guru yang sudah "Login"
                const { error: insertError } = await supabase
                    .from('absensi_logs')
                    .insert([{ guru_nama: selectedGuru, kelas: qrText }])

                if (!insertError) {
                    alert(`✅ Berhasil! Data ${selectedGuru} masuk ke Monitor.`)
                }
            }

            // Delay sebelum bisa scan lagi
            setTimeout(() => {
                isProcessing.current = false
                setLoading(false)
            }, 3000)
        }
    }

    // TAMPILAN 1: HALAMAN LOGIN
    if (step === 'LOGIN') {
        return (
            <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-green-800">LOGIN GURU</h1>
                        <p className="text-gray-500 text-sm">Absensi Digital MTs</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Nama Anda</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                                value={selectedGuru}
                                onChange={(e) => setSelectedGuru(e.target.value)}
                            >
                                <option value="">-- Pilih Nama --</option>
                                {daftarGuru.map((nama) => (
                                    <option key={nama} value={nama}>{nama}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan PIN (123456)"
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
                        >
                            MASUK SISTEM 🚀
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-gray-400 text-sm hover:text-green-600">Kembali ke Menu Utama</Link>
                    </div>
                </div>
            </div>
        )
    }

    // TAMPILAN 2: HALAMAN SCANNER (Setelah Login)
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="bg-white p-4 shadow-md flex justify-between items-center z-10">
                <div>
                    <p className="text-xs text-gray-500">Login Sebagai:</p>
                    <p className="font-bold text-green-700 text-lg">{selectedGuru}</p>
                </div>
                <button
                    onClick={() => setStep('LOGIN')}
                    className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200"
                >
                    LOGOUT
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                <div className="w-full max-w-sm aspect-square bg-black rounded-2xl overflow-hidden shadow-2xl relative border-4 border-gray-800">
                    <Scanner
                        onScan={handleScan}
                        allowMultiple={true}
                        scanDelay={2000}
                        components={{
                            finder: false,
                        }}
                        styles={{
                            container: { width: '100%', height: '100%' },
                            video: { width: '100%', height: '100%', objectFit: 'cover' }
                        }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 border-[40px] border-black/60 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-4 border-green-500 rounded-lg animate-pulse relative">
                            <div className="absolute -top-10 w-full text-center text-white font-bold text-sm shadow-black drop-shadow-md">
                                ARAHKAN KE QR CODE
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-white text-lg font-bold animate-pulse">
                        {loading ? '⏳ Mengirim Data...' : 'Arahkan kamera ke QR Code Kelas...'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Status: {scanResult ? `Terakhir scan: ${scanResult}` : 'Menunggu scan...'}
                    </p>
                </div>
            </div>
        </div>
    )
}
