'use client'

export default function CetakQRPage() {
    const daftarKelas = [
        '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H', '7I', '7J', '7K',
        '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I',
        '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H', '9I', '9J', '9K',
        'Ruang UKM', 'LAB IPA', 'PERPUSTAKAAN', 'LAB KOMPUTER'
    ]

    return (
        <div className="min-h-screen bg-white p-8 font-sans">
            <div className="text-center mb-8 no-print">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">🖨️ CETAK QR CODE KELAS</h1>
                <p className="text-gray-600 mb-6">Silakan print halaman ini dan tempel di depan pintu kelas masing-masing.</p>
                <button
                    onClick={() => window.print()}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-colors"
                >
                    🖨️ PRINT HALAMAN INI
                </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {daftarKelas.map((kelas) => (
                    <div key={kelas} className="border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center break-inside-avoid">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">{kelas}</h2>

                        {/* Pakai API QR Code sederhana */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${kelas}`}
                            alt={`QR ${kelas}`}
                            className="w-32 h-32 mb-2"
                        />

                        <p className="text-xs text-gray-500 font-mono">SCAN UNTUK ABSEN</p>
                        <div className="flex items-center justify-center gap-1 mt-1 opacity-50">
                            <img src="/logo.png" alt="Logo" className="w-3 h-3 object-contain" />
                            <p className="text-[10px] text-gray-400">MTS NEGERI 1 LABUHAN BATU</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            background: white;
          }
        }
      `}</style>
        </div>
    )
}
