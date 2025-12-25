import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">Absensi MTs</h1>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/dashboard"
                        className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/students"
                        className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Data Siswa
                    </Link>
                    <Link
                        href="/dashboard/attendance"
                        className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Absensi
                    </Link>
                    <Link
                        href="/dashboard/reports"
                        className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Laporan
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
