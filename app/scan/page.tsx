'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
// import { QrReader } from 'react-qr-reader'; // Uncomment when installed

// Mock School Coordinates (Example: Monas, Jakarta)
// Change this to the actual school coordinates
const SCHOOL_LAT = -6.175392;
const SCHOOL_LNG = 106.827153;
const MAX_DISTANCE_METERS = 100; // Allowed radius

export default function ScanPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        // Get current location on mount
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    setLocationError('Gagal mengambil lokasi. Pastikan GPS aktif!');
                }
            );
        } else {
            setLocationError('Browser tidak mendukung Geolocation.');
        }
    }, []);

    // Haversine Formula to calculate distance in meters
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const handleScan = async (data: string | null) => {
        if (!data) return;

        setLoading(true);
        setMessage(null);

        try {
            // 1. Validate Location
            if (!location) {
                throw new Error('Lokasi belum ditemukan. Tunggu sebentar...');
            }

            const distance = calculateDistance(location.lat, location.lng, SCHOOL_LAT, SCHOOL_LNG);
            if (distance > MAX_DISTANCE_METERS) {
                throw new Error(`Anda berada di luar jangkauan sekolah! (${Math.round(distance)}m)`);
            }

            // 2. Parse QR JSON
            let qrData;
            try {
                qrData = JSON.parse(data);
            } catch (e) {
                throw new Error('QR Code tidak valid! (Bukan format JSON)');
            }

            const { id_kelas, kode_rahasia } = qrData;
            if (!id_kelas || !kode_rahasia) {
                throw new Error('Data QR Code tidak lengkap!');
            }

            // 3. Insert Attendance
            // Assuming we have a logged-in user (teacher)
            // For demo, we might skip user check or use a dummy ID

            const { error } = await supabase
                .from('attendance')
                .insert([
                    {
                        class_id: id_kelas, // Assuming column name
                        teacher_id: 'dummy-teacher-id', // Replace with actual auth user ID
                        status: 'Hadir',
                        timestamp: new Date().toISOString(),
                        location: `Lat: ${location.lat}, Lng: ${location.lng}`
                    },
                ]);

            if (error) throw error;

            setMessage({ type: 'success', text: `Berhasil Absen di Kelas ${id_kelas}!` });

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Mock Scan for Testing
    const handleMockScan = () => {
        const mockQR = JSON.stringify({ id_kelas: "7A", kode_rahasia: "xyz123" });
        handleScan(mockQR);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto space-y-4">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    &larr; Kembali
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Scan QR Kelas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {locationError ? (
                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                                {locationError}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                Status GPS: {location ? '✅ Terkunci' : '⏳ Mencari...'}
                            </div>
                        )}

                        <div className="bg-black h-64 rounded-lg flex items-center justify-center text-white relative overflow-hidden">
                            {/* <QrReader
                onResult={(result, error) => {
                  if (!!result) handleScan(result?.getText());
                }}
                style={{ width: '100%' }}
              /> */}
                            <p className="text-center p-4 z-10">
                                Kamera Area<br />(Install react-qr-reader)
                            </p>
                        </div>

                        <Button
                            onClick={handleMockScan}
                            className="w-full"
                            variant="secondary"
                            disabled={loading || !location}
                        >
                            {loading ? 'Memproses...' : 'Simulasi Scan (Kelas 7A)'}
                        </Button>

                        {message && (
                            <div className={`p-4 rounded-md font-medium text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
