import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-800 flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          {/* Logo Sekolah */}
          <div className="w-24 h-24 mx-auto flex items-center justify-center drop-shadow-2xl hover:scale-110 transition-transform duration-500">
            <img src="/logo.png" alt="Logo MTS" className="w-full h-full object-contain" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2 uppercase leading-tight">ABSENSI DIGITAL MONITORING KBM PERKELAS</h1>
        <p className="text-xl mb-10 opacity-90">MTS Negeri 1 Labuhan Batu</p>

        <div className="space-y-4 w-full">
          <Link href="/guru" className="block w-full bg-white text-green-800 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform flex items-center justify-center gap-3">
            📷 SCAN ABSEN (GURU)
          </Link>

          <Link href="/admin" className="block w-full bg-green-900/50 border-2 border-green-400/30 text-white font-semibold py-4 rounded-xl hover:bg-green-900 hover:border-green-400 transition-colors flex items-center justify-center gap-3">
            🖥️ MONITOR PIKET (ADMIN)
          </Link>
        </div>

        <p className="mt-12 text-sm opacity-60">System by Santri Lawas Dev</p>
      </div>
    </div>
  )
}
