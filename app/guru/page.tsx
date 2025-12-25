'use client'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'

export default function GuruPage() {
    const [nama, setNama] = useState('')
    const [scanResult, setScanResult] = useState('')
    const [loading, setLoading] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        if (result && result.length > 0 && !loading && nama) {
            // Cegah scan ganda (Debounce sederhana)
            setLoading(true)
            const qrText = result[0].rawValue

            // Cek apakah QR ini valid (misal isinya text '7A')
            if (qrText) {
                setScanResult(qrText)

                // Kirim ke Supabase
                const { error: insertError } = await supabase
                    .from('absensi_logs')
                    .insert([
                        { guru_nama: nama, kelas: qrText }
                    ])

                if (!insertError) {
                    alert(`Berhasil Absen di Kelas ${qrText}!`)
                } else {
                    alert('Gagal mengirim data!')
                }
            }

            // Jeda 3 detik sebelum bisa scan lagi
            setTimeout(() => setLoading(false), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
                    ABSENSI GURU
                </h1>

                {/* Input Nama Guru */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Nama Guru</label>
                    <input
                        type="text"
                        placeholder="Ketik Nama Anda..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                    />
                </div>

                {/* Area Scanner */}
                <div className="bg-black rounded-lg overflow-hidden mb-4 relative h-64 flex items-center justify-center">
                    {!nama ? (
                        <p className="text-white text-center px-4">
                            Silakan isi nama dulu untuk mengaktifkan kamera.
                        </p>
                    ) : (
                        <div className="w-full h-full">
                            <Scanner
                                onScan={handleScan}
                                allowMultiple={true}
                                scanDelay={2000}
                            />
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Status Scan:</p>
                    <p className="font-bold text-lg text-green-600">
                        {scanResult || 'Belum ada scan...'}
                    </p>
                </div>
            </div>
        </div>
    )
}
