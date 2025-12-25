import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function StudentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Data Siswa</h2>
                <Button>Tambah Siswa</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Daftar Siswa</CardTitle>
                        <div className="w-64">
                            <Input placeholder="Cari siswa..." />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">NIS</th>
                                    <th className="px-6 py-3">Nama Lengkap</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Jenis Kelamin</th>
                                    <th className="px-6 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Placeholder Data */}
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">12345</td>
                                    <td className="px-6 py-4">Ahmad Fulan</td>
                                    <td className="px-6 py-4">7A</td>
                                    <td className="px-6 py-4">Laki-laki</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">12346</td>
                                    <td className="px-6 py-4">Siti Fulanah</td>
                                    <td className="px-6 py-4">7A</td>
                                    <td className="px-6 py-4">Perempuan</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Hapus</Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
