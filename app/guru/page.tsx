'use client'
import { useState, useRef } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GuruPage() {
    const [nama, setNama] = useState('')
    const [scanResult, setScanResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false) // State baru buat kontrol kamera

    const isProcessing = useRef(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        if (result && result.length > 0 && nama) {
            if (isProcessing.current) return

            isProcessing.current = true
            setLoading(true)

            const qrText = result[0].rawValue

            if (qrText) {
                setScanResult(qrText)
                const { error: insertError } = await supabase
                    .from('absensi_logs')
                    .insert([{ guru_nama: nama, kelas: qrText }])

                if (!insertError) {
                    alert(`✅ Berhasil! Data terkirim ke Piket.`)
                }
            }

            setTimeout(() => {
                isProcessing.current = false
                setLoading(false)
            }, 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-4 shadow-sm text-center sticky top-0 z-10">
                <h1 className="font-bold text-green-700 text-lg">ABSENSI GURU MTs</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">

                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    <div className="p-6">
                        <label className="block text-gray-600 text-sm font-bold mb-2 ml-1">Nama Lengkap</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Contoh: Ust. Ghozali"
                                className="w-full bg-gray-50 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium placeholder-gray-400"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                disabled={isCameraOpen} // Disable input pas kamera nyala biar gak berat
                            />
                        </div>
                    </div>

                    {/* Area Kamera */}
                    <div className="relative bg-black aspect-square flex flex-col items-center justify-center">
                        {!isCameraOpen ? (
                            <div className="text-center p-6">
                                <p className="text-white/70 mb-4">
                                    {nama ? 'Siap untuk scan?' : 'Isi nama dulu untuk membuka kamera'}
                                </p>
                                <button
                                    onClick={() => setIsCameraOpen(true)}
                                    disabled={!nama}
                                    className={`px-6 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 ${nama
                                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    📸 BUKA KAMERA
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
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

                                {/* Overlay Frame */}
                                <div className="absolute inset-0 border-[40px] border-black/50 flex items-center justify-center pointer-events-none">
                                    <div className="w-48 h-48 border-4 border-green-500 rounded-lg animate-pulse relative">
                                        <div className="absolute -top-10 w-full text-center text-white font-bold text-sm shadow-black drop-shadow-md">
                                            ARAHKAN KE QR CODE
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Tutup Kamera */}
                                <button
                                    onClick={() => setIsCameraOpen(false)}
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm z-50 pointer-events-auto"
                                >
                                    ❌ TUTUP KAMERA
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-1">Status Terakhir:</p>
                        <p className="font-bold text-green-600 truncate">
                            {scanResult || 'Belum ada scan...'}
                        </p>
                    </div>
                </div>

                <Link href="/" className="mt-8 text-gray-400 text-sm hover:text-gray-600">
                    ← Kembali ke Halaman Depan
                </Link>
            </div>
        </div>
    )
}
