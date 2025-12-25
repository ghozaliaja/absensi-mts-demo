'use client'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GuruPage() {
    const [nama, setNama] = useState('')
    const [scanResult, setScanResult] = useState('')
    const [loading, setLoading] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        if (result && result.length > 0 && !loading && nama) {
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
            setTimeout(() => setLoading(false), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Mobile */}
            <div className="bg-white p-4 shadow-sm text-center sticky top-0 z-10">
                <h1 className="font-bold text-green-700 text-lg">ABSENSI GURU MTs</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">

                {/* Card Utama */}
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    <div className="p-6">
                        <label className="block text-gray-600 text-sm font-bold mb-2 ml-1">Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Contoh: Ust. Ghozali"
                            className="w-full bg-gray-50 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium placeholder-gray-400"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                        />
                    </div>

                    {/* Area Kamera */}
                    <div className="relative bg-black aspect-square">
                        {!nama ? (
                            <div className="absolute inset-0 flex items-center justify-center text-white/70 p-6 text-center">
                                <p>🔒 Ketik nama Anda di atas untuk membuka kamera.</p>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <Scanner
                                    onScan={handleScan}
                                    allowMultiple={true}
                                    scanDelay={500}
                                    components={{
                                        finder: false,
                                    }}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                                    }}
                                />
                                {/* Overlay Frame Scanner */}
                                <div className="absolute inset-0 border-[40px] border-black/50 flex items-center justify-center pointer-events-none">
                                    <div className="w-48 h-48 border-4 border-green-500 rounded-lg animate-pulse relative">
                                        <div className="absolute -top-10 w-full text-center text-white font-bold text-sm shadow-black drop-shadow-md">
                                            ARAHKAN KE QR CODE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Status */}
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
