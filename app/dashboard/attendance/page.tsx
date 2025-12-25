'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AttendancePage() {
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Absensi Siswa</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Filter Absensi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Pilih Kelas</option>
                                <option value="7A">7A</option>
                                <option value="7B">7B</option>
                                <option value="8A">8A</option>
                                <option value="8B">8B</option>
                                <option value="9A">9A</option>
                                <option value="9B">9B</option>
                            </select>
                        </div>
                        <div>
                            <Input
                                type="date"
                                label="Tanggal"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">Tampilkan Siswa</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Daftar Absensi - {selectedClass || '...'}</CardTitle>
                        <Button variant="primary">Simpan Absensi</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">NIS</th>
                                    <th className="px-6 py-3">Nama Lengkap</th>
                                    <th className="px-6 py-3 text-center">Hadir</th>
                                    <th className="px-6 py-3 text-center">Sakit</th>
                                    <th className="px-6 py-3 text-center">Izin</th>
                                    <th className="px-6 py-3 text-center">Alpha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Placeholder Data */}
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">12345</td>
                                    <td className="px-6 py-4">Ahmad Fulan</td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-1" defaultChecked /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-1" /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-1" /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-1" /></td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">12346</td>
                                    <td className="px-6 py-4">Siti Fulanah</td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-2" defaultChecked /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-2" /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-2" /></td>
                                    <td className="px-6 py-4 text-center"><input type="radio" name="status-2" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
