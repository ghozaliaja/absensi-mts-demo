'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock Schedule Data
const SCHEDULE = [
    { id: '7A', name: 'Kelas 7A', subject: 'Matematika', teacher: 'Budi Santoso' },
    { id: '7B', name: 'Kelas 7B', subject: 'B. Indonesia', teacher: 'Siti Aminah' },
    { id: '8A', name: 'Kelas 8A', subject: 'IPA', teacher: 'Rudi Hartono' },
    { id: '8B', name: 'Kelas 8B', subject: 'IPS', teacher: 'Dewi Sartika' },
];

export default function MonitorPage() {
    const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // 1. Fetch Initial State (Optional, skipping for demo speed)

        // 2. Subscribe to Realtime Changes
        const channel = supabase
            .channel('realtime-attendance')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'absensi_logs',
                },
                (payload) => {
                    console.log('New attendance:', payload);
                    const newRecord = payload.new;
                    // Update status to Green (True) for the specific class
                    // Mapping: newRecord.kelas -> item.id (e.g., "7A")
                    if (newRecord.kelas) {
                        setAttendanceStatus((prev) => ({
                            ...prev,
                            [newRecord.kelas]: true,
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-white">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
                MONITORING JADWAL PELAJARAN MTsN1 Labuhan Batu (LIVE)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SCHEDULE.map((item) => {
                    const isPresent = attendanceStatus[item.id];

                    return (
                        <Card
                            key={item.id}
                            className={`border-2 transition-all duration-500 ${isPresent
                                ? 'bg-green-900/50 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                                : 'bg-red-900/20 border-red-800'
                                }`}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-2xl ${isPresent ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold">{item.subject}</p>
                                    <p className="text-gray-400">{item.teacher}</p>

                                    <div className={`mt-4 py-2 px-4 rounded-full text-center font-bold text-sm ${isPresent ? 'bg-green-600 text-white' : 'bg-red-900/50 text-red-300'
                                        }`}>
                                        {isPresent ? 'GURU HADIR ✅' : 'BELUM HADIR ❌'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Menunggu data realtime dari Supabase...</p>
                <p>Gunakan halaman /scan untuk simulasi kehadiran.</p>
            </div>
        </div>
    );
}
