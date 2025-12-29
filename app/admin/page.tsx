'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Log {
    id: number
    created_at: string
    guru_nama: string
    kelas: string
    durasi_jp?: number // Tambahan field durasi
}

interface JadwalItem {
    ke: number | string
    start: string
    end: string
}

export default function AdminPage() {
    // 1. CONFIG: 35 RUANGAN
    const daftarKelas = [
        '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H', '7I', '7J', '7K',
        '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I',
        '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H', '9I', '9J', '9K',
        'Ruang UKM', 'LAB IPA', 'PERPUSTAKAAN', 'LAB KOMPUTER'
    ]

    // 2. CONFIG: JADWAL
    const getJadwalHariIni = (): JadwalItem[] => {
        const hari = new Date().getDay() // 0 = Minggu, 1 = Senin, ... 6 = Sabtu

        // JUMAT
        if (hari === 5) {
            return [
                { ke: 1, start: '07:00', end: '07:45' },
                { ke: 2, start: '07:45', end: '08:25' },
                { ke: 3, start: '08:25', end: '09:05' },
                { ke: 4, start: '09:05', end: '09:45' },
                { ke: 'ISTIRAHAT', start: '09:45', end: '10:00' },
                { ke: 5, start: '10:00', end: '10:40' },
                { ke: 6, start: '10:40', end: '11:20' },
            ]
        }

        // SABTU
        if (hari === 6) {
            return [
                { ke: 1, start: '07:00', end: '07:45' },
                { ke: 2, start: '07:45', end: '08:25' },
                { ke: 3, start: '08:25', end: '09:05' },
                { ke: 4, start: '09:05', end: '09:45' },
                { ke: 'ISTIRAHAT', start: '09:45', end: '10:00' },
                { ke: 5, start: '10:00', end: '10:40' },
                { ke: 6, start: '10:40', end: '11:20' },
                { ke: 7, start: '11:20', end: '12:00' },
                { ke: 8, start: '12:00', end: '12:40' },
            ]
        }

        // SENIN - KAMIS (Default)
        return [
            { ke: 1, start: '07:00', end: '07:45' },
            { ke: 2, start: '07:45', end: '08:25' },
            { ke: 3, start: '08:25', end: '09:05' },
            { ke: 4, start: '09:05', end: '09:45' },
            { ke: 'ISTIRAHAT 1', start: '09:45', end: '10:00' },
            { ke: 5, start: '10:00', end: '10:40' },
            { ke: 6, start: '10:40', end: '11:20' },
            { ke: 7, start: '11:20', end: '12:00' },
            { ke: 8, start: '12:00', end: '12:40' },
            { ke: 'ISTIRAHAT 2', start: '12:40', end: '13:10' },
            { ke: 9, start: '13:10', end: '13:50' },
            { ke: 10, start: '13:50', end: '14:30' },
        ]
    }

    const [logs, setLogs] = useState<Log[]>([])
    const [jamSekarang, setJamSekarang] = useState<JadwalItem | null>(null) // Info Jam Ke-berapa
    const [waktuServer, setWaktuServer] = useState('')

    // Fungsi Cek Jam Pelajaran Sekarang
    const cekJadwalAktif = () => {
        const now = new Date()
        const jamMenit = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')
        setWaktuServer(jamMenit)

        const jadwalHariIni = getJadwalHariIni()
        const jadwalAktif = jadwalHariIni.find(j => jamMenit >= j.start && jamMenit < j.end)
        setJamSekarang(jadwalAktif || null)
    }

    useEffect(() => {
        // Timer buat update jam setiap detik
        const timer = setInterval(cekJadwalAktif, 1000)
        cekJadwalAktif()

        // Ambil Data Logs
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('absensi_logs')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setLogs(data as Log[])
        }
        fetchLogs()

        // Realtime Listener
        const channel = supabase
            .channel('realtime-logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'absensi_logs' }, (payload) => {
                setLogs((current) => [payload.new as Log, ...current])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
            clearInterval(timer)
        }
    }, [])

    // 3. LOGIKA UTAMA: Filter Data Sesuai Jam & Durasi JP
    const getStatusKelas = (namaKelas: string) => {
        // Kalau diluar jam pelajaran (atau istirahat), semua dianggap kosong
        if (!jamSekarang || typeof jamSekarang.ke === 'string') {
            return { status: 'KOSONG', guru: '', jam: '' }
        }

        const jadwalHariIni = getJadwalHariIni()
        const currentKe = jamSekarang.ke as number

        // Cari log yang valid untuk kelas ini
        const logAktif = logs.find(log => {
            if (log.kelas !== namaKelas) return false

            // Cek apakah log dibuat HARI INI
            const logDate = new Date(log.created_at)
            const today = new Date()
            if (logDate.getDate() !== today.getDate() ||
                logDate.getMonth() !== today.getMonth() ||
                logDate.getFullYear() !== today.getFullYear()) {
                return false
            }

            // Cek Jam Mulai Log
            const logTime = logDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')
            const jadwalLogIndex = jadwalHariIni.findIndex(j => logTime >= j.start && logTime < j.end)

            if (jadwalLogIndex === -1) return false // Log diluar jam pelajaran

            const jadwalLog = jadwalHariIni[jadwalLogIndex]
            if (typeof jadwalLog.ke === 'string') return false // Log pas istirahat dianggap tidak valid untuk KBM

            const startKe = jadwalLog.ke as number
            const durasi = log.durasi_jp || 1

            // HITUNG END KE (Dengan Logika "Tidak Boleh Nyebrang Istirahat")
            let validDuration = 0
            let currentScheduleIndex = jadwalLogIndex

            // Loop untuk mengecek apakah durasi terpotong istirahat
            while (validDuration < durasi) {
                // Cek apakah index masih dalam range jadwal
                if (currentScheduleIndex >= jadwalHariIni.length) break

                const item = jadwalHariIni[currentScheduleIndex]

                // Kalau ketemu ISTIRAHAT, stop perpanjangan durasi
                if (typeof item.ke === 'string') {
                    break
                }

                // Kalau ini jam pelajaran valid, tambah hitungan
                validDuration++
                currentScheduleIndex++
            }

            // End Ke adalah start + validDuration - 1
            const endKe = startKe + validDuration - 1

            // Cek apakah Jam Sekarang masih dalam rentang [startKe, endKe]
            return currentKe >= startKe && currentKe <= endKe
        })

        if (logAktif) {
            return {
                status: 'ISI',
                guru: logAktif.guru_nama,
                jam: new Date(logAktif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }
        }
        return { status: 'KOSONG', guru: '', jam: '' }
    }

    return (
        <div className="h-screen w-screen bg-gray-950 text-white flex flex-col p-2 overflow-hidden font-sans">

            {/* HEADER */}
            <header className="flex justify-between items-center bg-gray-900 px-4 py-1 rounded-lg border-b-2 border-green-600 mb-2 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/20 p-1">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wider text-gray-100">MONITORING KBM MTsN1 Labuhan Batu</h1>
                        {/* Info Jam Ke Berapa */}
                        <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-yellow-400">
                                {jamSekarang
                                    ? (typeof jamSekarang.ke === 'string' ? `☕ ${jamSekarang.ke}` : `📚 JAM PELAJARAN KE-${jamSekarang.ke} (${jamSekarang.start} - ${jamSekarang.end})`)
                                    : '⛔ DILUAR JAM KBM'
                                }
                            </p>
                            <a href="/cetak-qr" target="_blank" className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 transition-colors">
                                🖨️ CETAK QR
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-green-400 leading-none">
                        {waktuServer}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </header>

            {/* MAIN GRID */}
            <main className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 pb-1">
                {daftarKelas.map((kelas) => {
                    const info = getStatusKelas(kelas)
                    const isIsi = info.status === 'ISI'
                    const isInactive = !jamSekarang || typeof jamSekarang.ke === 'string'

                    return (
                        <div
                            key={kelas}
                            className={`
                                relative rounded-lg border-2 shadow-lg flex flex-col overflow-hidden
                                ${isIsi
                                    ? 'bg-gray-800 border-green-500 shadow-green-900/50'
                                    : (isInactive ? 'bg-gray-900 border-gray-800 opacity-40' : 'bg-gray-800 border-red-900/50')
                                }
                            `}
                        >
                            {/* BAGIAN ATAS: NAMA KELAS */}
                            <div className="bg-gray-900/50 border-b border-white/10 py-1 text-center">
                                <span className="text-lg font-black text-gray-300 tracking-wider">{kelas}</span>
                            </div>

                            {/* BAGIAN TENGAH: INDIKATOR LINGKARAN */}
                            <div className="flex-1 flex items-center justify-center bg-gray-800/50 relative">
                                {isInactive ? (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">OFF</span>
                                    </div>
                                ) : (
                                    <div className={`
                                        w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500
                                        ${isIsi
                                            ? 'bg-green-500 border-green-300 shadow-green-500/50 scale-110'
                                            : 'bg-red-900/20 border-red-800 shadow-red-900/20'
                                        }
                                    `}>
                                        {isIsi && <span className="text-white text-xs font-bold">✓</span>}
                                    </div>
                                )}
                            </div>

                            {/* BAGIAN BAWAH: NAMA GURU */}
                            <div className={`
                                py-2 px-1 text-center border-t min-h-[40px] flex items-center justify-center
                                ${isIsi ? 'bg-green-900/30 border-green-500/30' : 'bg-gray-900/30 border-white/5'}
                            `}>
                                {isIsi ? (
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm font-bold text-white leading-tight line-clamp-1">
                                            {info.guru}
                                        </span>
                                        <span className="text-[9px] text-green-300 font-mono mt-0.5">
                                            {info.jam}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold">
                                        {isInactive ? '-' : 'KOSONG'}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </main>
        </div>
    )
}
