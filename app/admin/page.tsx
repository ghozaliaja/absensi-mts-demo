'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Log {
    id: number
    created_at: string
    guru_nama: string
    kelas: string
}

export default function AdminPage() {
    const [logs, setLogs] = useState<Log[]>([])

    // 1. Ambil data awal pas halaman dibuka
    useEffect(() => {
        const fetchLogs = async () => {
            const { data, error } = await supabase
                .from('absensi_logs')
                .select('*')
                .order('created_at', { ascending: false }) // Yang terbaru diatas

            if (data) setLogs(data as Log[])
        }

        fetchLogs()
    }, [])

    // 2. Jurus "Mata Dewa" (Realtime Listener)
    useEffect(() => {
        const channel = supabase
            .channel('realtime-logs')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'absensi_logs'
            }, (payload) => {
                // Kalo ada data baru masuk, langsung tangkap & taruh paling atas!
                console.log('Ada guru scan!', payload.new)
                setLogs((currentLogs) => [payload.new as Log, ...currentLogs])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
                MONITORING KEHADIRAN GURU (REALTIME)
            </h1>

            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-300 uppercase">
                        <tr>
                            <th className="px-6 py-4">Waktu Scan</th>
                            <th className="px-6 py-4">Nama Guru</th>
                            <th className="px-6 py-4">Kelas</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">
                                    Belum ada data masuk hari ini...
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-700/50 transition-colors animate-pulse-once">
                                    <td className="px-6 py-4">
                                        {new Date(log.created_at).toLocaleTimeString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lg">{log.guru_nama}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                            {log.kelas}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-green-400 font-bold">
                                        ✅ HADIR
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
