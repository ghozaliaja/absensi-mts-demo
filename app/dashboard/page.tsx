import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-100">Dashboard Guru</h2>
                <Link href="/scan">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        📷 Mulai Scan Absensi
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Total Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-400">--</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Hadir Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-400">--</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Tidak Hadir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-400">--</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">Belum ada data absensi hari ini.</p>
                </CardContent>
            </Card>
        </div>
    );
}
