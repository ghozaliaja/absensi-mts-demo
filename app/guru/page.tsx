'use client'
import { useState, useRef, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { getJadwalHariIni } from '@/lib/jadwal'

export default function GuruPage() {
    // 1. CONFIG: KOORDINAT SEKOLAH
    const SCHOOL_LAT = 2.0964 // MTS Negeri 1 (Induk)
    const SCHOOL_LNG = 99.8376

    const BRANCH_LAT = 2.1139608835247765 // MTS Negeri 1 (Cabang 9J & 9K)
    const BRANCH_LNG = 99.88775048364661

    const MAX_DISTANCE_METERS = 500 // Radius toleransi (meter) diperluas

    // DATA GURU (ID & Password)
    const daftarGuru = [
        { id: 'AD', nama: 'AHMAD SOLEH DONGORAN, S.Ag' },
        { id: 'NW', nama: 'Dra. Hj. NURMAWATI, MA' },
        { id: 'SY', nama: 'Dra.SYAFRI YUNITA' },
        { id: 'NN', nama: 'Dra. NIRWANA' },
        { id: 'SS', nama: 'SAMSIDAR RITONGA, S.Pd' },
        { id: 'ER', nama: 'ELVIRA RAHMAINI, S.Pd' },
        { id: 'SI', nama: 'SAANIM S.Pd' },
        { id: 'NA', nama: 'NURBANI, M.Pd.I' },
        { id: 'NH', nama: 'NURMAHAYA HARAHAP, S.Pd.I' },
        { id: 'IZ', nama: 'INATUL ZAMROH, S.Ag' },
        { id: 'UK', nama: 'UMMI KALSUM, S.Pd.I' },
        { id: 'MH', nama: 'MARHIDUN, S.Pd.I' },
        { id: 'RV', nama: 'RIKA VALIANTI, S.Pd' },
        { id: 'RS', nama: 'ROSITA, M.Pd' },
        { id: 'LM', nama: 'LENNI MARIA, S.Pd' },
        { id: 'MD', nama: 'MASDIANA NASUTION, S.Pd' },
        { id: 'TR', nama: 'TRINAWATI, S.Ag' },
        { id: 'FW', nama: 'FITRAWATI, S.Pd' },
        { id: 'VA', nama: 'VIVI ARIANI LUBIS, S.Pd' },
        { id: 'NR', nama: 'NURHASANAH NASUTION, S.Pd' },
        { id: 'SM', nama: 'SRI HARIANI MANURUNG S.Pd' },
        { id: 'SU', nama: 'SURATMIN, S.Pd' },
        { id: 'AY', nama: 'AFRIYENNI, S.Pd' },
        { id: 'ZA', nama: 'H. ZAINUL AMRI,S.Ag.M.Ag' },
        { id: 'AM', nama: 'Dra.AMARNA' },
        { id: 'NBN', nama: 'NURIBAN, S.Ag' },
        { id: 'RJ', nama: 'RAJA SORAYA S.Ag' },
        { id: 'MW', nama: 'MASNAWATI HARAHAP, S.Ag' },
        { id: 'EP', nama: 'EPRIWAN, S.Ag' },
        { id: 'AR', nama: 'AMRIAH SIREGAR SH' },
        { id: 'SW', nama: 'SARINAWITA, SH' },
        { id: 'IY', nama: 'ISMAYUDDIN,S.Ag' },
        { id: 'RD', nama: 'RIDWAN PANGGABEAN S.P' },
        { id: 'FR', nama: 'FITRI RAHMAWATI HARAHAP, S.Pd' },
        { id: 'SF', nama: 'SARIFAH NURAINI S.Pd.I' },
        { id: 'WW', nama: 'WIWING DEVIKA,S.Pd' },
        { id: 'NB', nama: 'NURHABIBAH DMT, S.Ag' },
        { id: 'JT', nama: 'JULIATI, S.Ag' },
        { id: 'LINDA', nama: 'ERLINDA SARUMPAYET S.Ag' },
        { id: 'LZ', nama: 'LIZA HANDAYANI ,S.Psi' },
        { id: 'ST', nama: 'SUPRIATI, S.Pd.I' },
        { id: 'FP', nama: 'FITRIANI POHAN, S.Pd' },
        { id: 'IM', nama: 'INDAH MAHDANI, S.Pd' },
        { id: 'KR', nama: 'KORRY WULANDARA, S.Pd' },
        { id: 'PIA', nama: 'SUPIA SARI, SE' },
        { id: 'IQ', nama: 'ISTIQOMAH SRI ASTUTI, S.Pd' },
        { id: 'AT', nama: 'ATIKA FAZRIANI, S.Pd' },
        { id: 'IN', nama: 'INTAN PERMATA SARI, S.Pd' },
        { id: 'NS', nama: 'NURHASANAH RAMBE S.Pd' },
        { id: 'AMEL', nama: 'AMALIA DYANI PUTRI LUBIS,S.Psi' },
        { id: 'NU', nama: 'NURUL WULANDA, S.Pd' },
        { id: 'DESSY', nama: 'DESSY NOVALIA, S.Pd' },
        { id: 'JK', nama: 'JOKO PRASETYO S.Pd' },
        { id: 'DR', nama: 'DESRIANTI NASUTION S.Pd' },
        { id: 'DH', nama: 'DAHLIA HARAHAP, S.Pd.I' },
        { id: 'ELI', nama: 'ELI RAHMADANI, S.Pd' },
        { id: 'EM', nama: 'EPI MEI LINDA SIREGAR, S.Pd' },
        { id: 'SL', nama: 'SHILATURRAHMAH, S.Pd' },
        { id: 'PS', nama: 'PITRIANI SIBORO, S.Pd' },
        { id: 'MN', nama: 'MILWAN TAUFIK, S.Pd' },
        { id: 'AE', nama: 'ANWAR EFENDI, S.Pd' },
        { id: 'LA', nama: 'LILA SURIANI, S.Pd.I' },
        { id: 'PH', nama: 'SITI SAHARA POHAN, S.Pd' },
        { id: 'HY', nama: 'HAYANI SIREGAR, S.Pd' },
        { id: 'IS', nama: 'ISKANDAR, S.Pd' },
        { id: 'DW', nama: 'DARMAWATI SITORUS, M.Pd' },
        { id: 'MA', nama: 'MUHAMMAD ARIF SIAGIAN, S.Pd' },
        { id: 'SP', nama: 'SURYA PUTRA, S.Pd' },
        { id: 'MKN', nama: 'MUSTAFA KAMAL NASUTION, S.Pd.I, M.Pd' },
    ]

    const [step, setStep] = useState<'LOGIN' | 'SCAN'>('LOGIN')
    const [inputId, setInputId] = useState('')
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

                // Hitung jarak ke Sekolah Induk & Cabang
                const distMain = calculateDistance(latitude, longitude, SCHOOL_LAT, SCHOOL_LNG)
                const distBranch = calculateDistance(latitude, longitude, BRANCH_LAT, BRANCH_LNG)

                // Ambil jarak terdekat
                const minDist = Math.min(distMain, distBranch)
                setDistance(minDist)
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
        if (!inputId) return alert("Isi ID dulu Tadz!")

        // Cari Guru
        const guru = daftarGuru.find(g => g.id === inputId)

        if (!guru) {
            return alert("ID tidak ditemukan!")
        }

        // Validasi Lokasi (AKTIF)
        if (distance === null) {
            checkLocation()
            return alert("Sedang mengambil lokasi... Tunggu sebentar.")
        }

        if (distance > MAX_DISTANCE_METERS) {
            return alert(`❌ KEJAUHAN! \n\nJarak Anda: ${Math.round(distance)} meter dari sekolah.\nBatas Maksimal: ${MAX_DISTANCE_METERS} meter.\n\nSilakan merapat ke sekolah dulu Tadz!`)
        }

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


                // LOGIKA BARU: Cek apakah durasi terpotong istirahat
                let finalDurasi = selectedDurasi
                const jadwal = getJadwalHariIni()
                const now = new Date()
                const jamMenit = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')

                const currentIndex = jadwal.findIndex(j => jamMenit >= j.start && jamMenit < j.end)

                if (currentIndex !== -1) {
                    const currentItem = jadwal[currentIndex]
                    // Hanya validasi jika scan dilakukan saat jam pelajaran (bukan istirahat)
                    if (typeof currentItem.ke === 'number') {
                        let validDuration = 0
                        let checkIndex = currentIndex

                        // Loop cek ke depan apakah nabrak istirahat
                        while (validDuration < selectedDurasi) {
                            if (checkIndex >= jadwal.length) break
                            const item = jadwal[checkIndex]

                            // Kalau ketemu ISTIRAHAT, stop
                            if (typeof item.ke === 'string') break

                            validDuration++
                            checkIndex++
                        }

                        // Jika durasi valid lebih kecil dari yang dipilih, potong!
                        if (validDuration > 0 && validDuration < selectedDurasi) {
                            finalDurasi = validDuration
                            alert(`⚠️ DURASI DIPOTONG! \n\nAnda memilih ${selectedDurasi} JP, tapi terpotong waktu ISTIRAHAT.\nSistem otomatis mengubah menjadi ${finalDurasi} JP.\n\nSilakan scan lagi setelah istirahat untuk jam berikutnya.`)
                        }
                    }
                }

                // Kirim Data ke Supabase (Termasuk Durasi JP yang sudah divalidasi)
                const { error: insertError } = await supabase
                    .from('absensi_logs')
                    .insert([
                        {
                            guru_nama: guruLogin.nama,
                            kelas: qrText,
                            durasi_jp: finalDurasi // Pakai durasi hasil validasi
                        }
                    ])

                if (!insertError) {
                    alert(`✅ Berhasil! \n\n${guruLogin.nama}\nKelas: ${qrText}\nDurasi: ${finalDurasi} JP\n\nData sudah masuk ke Monitor.`)
                } else {
                    console.error(insertError)
                    // Fallback kalau kolom durasi_jp belum ada, coba kirim tanpa durasi
                    const { error: retryError } = await supabase
                        .from('absensi_logs')
                        .insert([{ guru_nama: guruLogin.nama, kelas: `${qrText}|${finalDurasi}` }])

                    if (!retryError) {
                        alert(`✅ Berhasil Absen! (Note: Durasi JP mungkin tidak tersimpan karena database belum update)`)
                    } else {
                        alert(`❌ Gagal mengirim data! \n\nError: ${retryError?.message || insertError?.message}`)
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
                        <p className="text-gray-500 text-sm">MTsN1 Labuhan Batu</p>
                    </div>

                    {/* Info Lokasi (AKTIF) */}
                    <div className="mb-6 p-3 rounded-lg text-sm text-center bg-green-100 text-green-700 border border-green-200">
                        <p className="font-bold">📍 VALIDASI LOKASI AKTIF</p>
                        <p className="text-xs mt-1">Pastikan berada di area sekolah</p>
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

                        {/* Password Field Removed */}

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
