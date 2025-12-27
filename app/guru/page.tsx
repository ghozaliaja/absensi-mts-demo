'use client'
import { useState, useRef, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GuruPage() {
    // 1. CONFIG: KOORDINAT SEKOLAH (MTS Negeri 1 Labuhan Batu)
    const SCHOOL_LAT = 2.0964
    const SCHOOL_LNG = 99.8376
    const MAX_DISTANCE_METERS = 100 // Radius toleransi (meter)

    // DATA GURU (ID & Password)
    const daftarGuru = [
        { id: '101', nama: 'MUSTAFA KAMAL NASUTION, S.Pd.I, M.Pd', pass: '123456' },
        { id: '102', nama: 'DARMAWATI SITORUS, M.Pd', pass: '123456' },
        { id: '103', nama: 'MUHAMMAD ARIF SIAGIAN, S.Pd', pass: '123456' },
        { id: '104', nama: 'SURYA PUTRA, S.Pd', pass: '123456' },
        { id: '105', nama: 'AHMAD SOLEH DONGORAN, S.Ag', pass: '123456' },
        { id: '106', nama: 'Dra. Hj. NURMAWATI, MA', pass: '123456' },
        { id: '107', nama: 'Dra.SYAFRI YUNITA', pass: '123456' },
        { id: '108', nama: 'Dra. NIRWANA', pass: '123456' },
        { id: '109', nama: 'SAMSIDAR RITONGA, S.Pd', pass: '123456' },
        { id: '110', nama: 'ELVIRA RAHMAINI, S.Pd', pass: '123456' },
        { id: '111', nama: 'SAANIM S.Pd', pass: '123456' },
        { id: '112', nama: 'NURBANI, M.Pd.I', pass: '123456' },
        { id: '113', nama: 'NURMAHAYA HARAHAP, S.Pd.I', pass: '123456' },
        { id: '114', nama: 'INATUL ZAMROH, S.Ag', pass: '123456' },
        { id: '115', nama: 'UMMI KALSUM, S.Pd.I', pass: '123456' },
        { id: '116', nama: 'MARHIDUN, S.Pd.I', pass: '123456' },
        { id: '117', nama: 'RIKA VALIANTI, S.Pd', pass: '123456' },
        { id: '118', nama: 'ROSITA, M.Pd', pass: '123456' },
        { id: '119', nama: 'LENNI MARIA, S.Pd', pass: '123456' },
        { id: '120', nama: 'MASDIANA NASUTION, S.Pd', pass: '123456' },
        { id: '121', nama: 'TRINAWATI, S.Ag', pass: '123456' },
        { id: '122', nama: 'FITRAWATI, S.Pd', pass: '123456' },
        { id: '123', nama: 'VIVI ARIANI LUBIS, S.Pd', pass: '123456' },
        { id: '124', nama: 'NURHASANAH NASUTION, S.Pd', pass: '123456' },
        { id: '125', nama: 'SRI HARIANI MANURUNG S.Pd', pass: '123456' },
        { id: '126', nama: 'SURATMIN, S.Pd', pass: '123456' },
        { id: '127', nama: 'AFRIYENNI, S.Pd', pass: '123456' },
        { id: '128', nama: 'H. ZAINUL AMRI,S.Ag.M.Ag', pass: '123456' },
        { id: '129', nama: 'Dra.AMARNA', pass: '123456' },
        { id: '130', nama: 'NURIBAN, S.Ag', pass: '123456' },
        { id: '131', nama: 'RAJA SORAYA S.Ag', pass: '123456' },
        { id: '132', nama: 'MASNAWATI HARAHAP, S.Ag', pass: '123456' },
        { id: '133', nama: 'EPRIWAN, S.Ag', pass: '123456' },
        { id: '134', nama: 'AMRIAH SIREGAR SH', pass: '123456' },
        { id: '135', nama: 'SARINAWITA, SH', pass: '123456' },
        { id: '136', nama: 'ISMAYUDDIN,S.Ag', pass: '123456' },
        { id: '137', nama: 'RIDWAN PANGGABEAN S.P', pass: '123456' },
        { id: '138', nama: 'FITRI RAHMAWATI HARAHAP, S.Pd', pass: '123456' },
        { id: '139', nama: 'SARIFAH NURAINI S.Pd.I', pass: '123456' },
        { id: '140', nama: 'WIWING DEVIKA,S.Pd', pass: '123456' },
        { id: '141', nama: 'NURHABIBAH DMT, S.Ag', pass: '123456' },
        { id: '142', nama: 'JULIATI, S.Ag', pass: '123456' },
        { id: '143', nama: 'ERLINDA SARUMPAYET S.Ag', pass: '123456' },
        { id: '144', nama: 'LIZA HANDAYANI ,S.Psi', pass: '123456' },
        { id: '145', nama: 'SUPRIATI, S.Pd.I', pass: '123456' },
        { id: '146', nama: 'FITRIANI POHAN, S.Pd', pass: '123456' },
        { id: '147', nama: 'INDAH MAHDANI, S.Pd', pass: '123456' },
        { id: '148', nama: 'KORRY WULANDARA, S.Pd', pass: '123456' },
        { id: '149', nama: 'SUPIA SARI, SE', pass: '123456' },
        { id: '150', nama: 'ISTIQOMAH SRI ASTUTI, S.Pd', pass: '123456' },
        { id: '151', nama: 'ATIKA FAZRIANI, S.Pd', pass: '123456' },
        { id: '152', nama: 'INTAN PERMATA SARI, S.Pd', pass: '123456' },
        { id: '153', nama: 'NURHASANAH RAMBE S.Pd', pass: '123456' },
        { id: '154', nama: 'AMALIA DYANI PUTRI LUBIS,S.Psi', pass: '123456' },
        { id: '155', nama: 'NURUL WULANDA, S.Pd', pass: '123456' },
        { id: '156', nama: 'DESSY NOVALIA, S.Pd', pass: '123456' },
        { id: '157', nama: 'JOKO PRASETYO S.Pd', pass: '123456' },
        { id: '158', nama: 'DESRIANTI NASUTION S.Pd', pass: '123456' },
        { id: '159', nama: 'ELI RAMAHDANI, S.Pd', pass: '123456' },
        { id: '160', nama: 'DAHLIA HARAHAP, S.Pd.I', pass: '123456' },
        { id: '161', nama: 'EPI MEI LINDA SIREGAR, S.Pd', pass: '123456' },
        { id: '162', nama: 'ISKANDAR, S.Pd', pass: '123456' },
        { id: '163', nama: 'SHILATURRAHMAH, S.Pd', pass: '123456' },
        { id: '164', nama: 'ANWAR EFENDI, S.Pd', pass: '123456' },
        { id: '165', nama: 'LILA SURIANI, S.Pd.I', pass: '123456' },
        { id: '166', nama: 'SITI SAHARA POHAN, S.Pd', pass: '123456' },
        { id: '167', nama: 'HAYANI SIREGAR, S.Pd', pass: '123456' },
        { id: '168', nama: 'PITRIANI SIBORO, S.Pd', pass: '123456' },
        { id: '169', nama: 'MILWAN TAUFIK, S.Pd', pass: '123456' },
    ]

    const [step, setStep] = useState<'LOGIN' | 'SCAN'>('LOGIN')
    const [inputId, setInputId] = useState('')
    const [inputPass, setInputPass] = useState('')
    const [selectedDurasi, setSelectedDurasi] = useState(1) // Default 1 JP
    const [guruLogin, setGuruLogin] = useState<{ id: string, nama: string } | null>(null)

    const [scanResult, setScanResult] = useState('')
    const [loading, setLoading] = useState(false)

    // State Lokasi
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [distance, setDistance] = useState<number | null>(null)
    const [locationError, setLocationError] = useState('')
    const [isCheckingLocation, setIsCheckingLocation] = useState(false)

    const isProcessing = useRef(false)

    // Fungsi Hitung Jarak (Haversine Formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3 // Radius bumi dalam meter
        const φ1 = lat1 * Math.PI / 180
        const φ2 = lat2 * Math.PI / 180
        const Δφ = (lat2 - lat1) * Math.PI / 180
        const Δλ = (lon2 - lon1) * Math.PI / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c // Hasil dalam meter
    }

    // Fungsi Cek Lokasi Realtime
    const checkLocation = () => {
        setIsCheckingLocation(true)
        setLocationError('')

        if (!navigator.geolocation) {
            setLocationError('Browser tidak mendukung Geolocation')
            setIsCheckingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setUserLocation({ lat: latitude, lng: longitude })

                const dist = calculateDistance(latitude, longitude, SCHOOL_LAT, SCHOOL_LNG)
                setDistance(dist)
                setIsCheckingLocation(false)
            },
            (error) => {
                console.error(error)
                setLocationError('Gagal mengambil lokasi. Pastikan GPS aktif!')
                setIsCheckingLocation(false)
            },
            { enableHighAccuracy: true }
        )
    }

    // Cek lokasi pas pertama buka
    useEffect(() => {
        checkLocation()
    }, [])

    const handleLogin = () => {
        if (!inputId || !inputPass) return alert("Isi ID dan Password dulu Tadz!")

        // Cari Guru
        const guru = daftarGuru.find(g => g.id === inputId && g.pass === inputPass)

        if (!guru) {
            return alert("ID atau Password salah!")
        }

        // Validasi Lokasi (DINONAKTIFKAN SEMENTARA)
        // if (distance === null) {
        //     checkLocation()
        //     return alert("Sedang mengambil lokasi... Tunggu sebentar.")
        // }

        // if (distance > MAX_DISTANCE_METERS) {
        //     return alert(`❌ KEJAUHAN! \n\nJarak Anda: ${Math.round(distance)} meter dari sekolah.\nBatas Maksimal: ${MAX_DISTANCE_METERS} meter.\n\nSilakan merapat ke sekolah dulu Tadz!`)
        // }

        // Lolos semua cek
        setGuruLogin(guru)
        setStep('SCAN')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        if (result && result.length > 0 && guruLogin) {
            if (isProcessing.current) return

            isProcessing.current = true
            setLoading(true)

            const qrText = result[0].rawValue

            if (qrText) {
                setScanResult(qrText)

                // Kirim Data ke Supabase (Termasuk Durasi JP)
                const { error: insertError } = await supabase
                    .from('absensi_logs')
                    .insert([
                        {
                            guru_nama: guruLogin.nama,
                            kelas: qrText,
                            durasi_jp: selectedDurasi // Kirim durasi
                        }
                    ])

                if (!insertError) {
                    alert(`✅ Berhasil! \n\n${guruLogin.nama}\nKelas: ${qrText}\nDurasi: ${selectedDurasi} JP\n\nData sudah masuk ke Monitor.`)
                } else {
                    console.error(insertError)
                    // Fallback kalau kolom durasi_jp belum ada, coba kirim tanpa durasi
                    const { error: retryError } = await supabase
                        .from('absensi_logs')
                        .insert([{ guru_nama: guruLogin.nama, kelas: qrText }])

                    if (!retryError) {
                        alert(`✅ Berhasil Absen! (Note: Durasi JP mungkin tidak tersimpan karena database belum update)`)
                    } else {
                        alert('❌ Gagal mengirim data!')
                    }
                }
            }

            setTimeout(() => {
                isProcessing.current = false
                setLoading(false)
            }, 3000)
        }
    }

    if (step === 'LOGIN') {
        return (
            <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-800">LOGIN GURU</h1>
                        <p className="text-gray-500 text-sm">Absensi Digital MTs</p>
                    </div>

                    {/* Info Lokasi (MODE DEBUG) */}
                    <div className="mb-6 p-3 rounded-lg text-sm text-center bg-blue-100 text-blue-700 border border-blue-200">
                        <p className="font-bold">🚧 MODE UJI COBA</p>
                        <p className="text-xs mt-1">Validasi Lokasi: NON-AKTIF</p>
                        {distance !== null && <p className="text-[10px] mt-1 opacity-70">Jarak: {Math.round(distance)}m</p>}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Guru</label>
                            <input
                                type="text"
                                placeholder="Contoh: 101"
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 font-mono"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan Password"
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500"
                                value={inputPass}
                                onChange={(e) => setInputPass(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Mengajar (JP)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((jp) => (
                                    <button
                                        key={jp}
                                        onClick={() => setSelectedDurasi(jp)}
                                        className={`py-2 rounded-lg font-bold border-2 transition-all ${selectedDurasi === jp
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                                            }`}
                                    >
                                        {jp} JP
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">*Pilih berapa jam pelajaran Anda mengajar di kelas ini.</p>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 mt-4"
                        >
                            MASUK & SCAN 🚀
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-gray-400 text-sm hover:text-green-600">Kembali ke Menu Utama</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="bg-white p-4 shadow-md flex justify-between items-center z-10">
                <div>
                    <p className="text-xs text-gray-500">Login Sebagai:</p>
                    <p className="font-bold text-green-700 text-sm md:text-lg line-clamp-1">{guruLogin?.nama}</p>
                    <span className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">
                        Mengajar: {selectedDurasi} JP
                    </span>
                </div>
                <button
                    onClick={() => setStep('LOGIN')}
                    className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200 shrink-0 ml-2"
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
