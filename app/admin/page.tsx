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

    useEffect(() => {
        // Ambil data awal
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
                    < h1 className = "text-xl font-bold flex items-center gap-2" >
                        <span>🏫</span> MONITORING PIKET
                    </h1 >
            <span className="text-sm bg-green-800 px-3 py-1 rounded-full animate-pulse">
                🟢 Live Connection
            </span>
                </div >
            </nav >

            <main className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-700">Data Kehadiran Hari Ini</h2>
                        <span className="text-gray-500 text-sm">Total: {logs.length} Guru</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-sm tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Jam</th>
                                    <th className="px-6 py-4">Nama Guru</th>
                                    <th className="px-6 py-4">Lokasi / Kelas</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-gray-400 italic">
                                            Belum ada data masuk... Menunggu scan...
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-green-50 transition-colors group">
                                            <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                                {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-800 text-lg group-hover:text-green-700">
                                                {log.guru_nama}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-medium border border-gray-200">
                                                    {formatKelas(log.kelas)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center w-fit gap-1">
                                                    ✅ HADIR
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div >
    )
}
