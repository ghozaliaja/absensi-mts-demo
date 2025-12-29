import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-950">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-400">MTsN1 Labuhan Batu</h1>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/dashboard"
                        className="block px-6 py-3 text-gray-300 hover:bg-blue-900/50 hover:text-blue-400"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/students"
                        className="block px-6 py-3 text-gray-300 hover:bg-blue-900/50 hover:text-blue-400"
                    >
                        Data Siswa
                    </Link>
                    <Link
                        href="/dashboard/attendance"
                        className="block px-6 py-3 text-gray-300 hover:bg-blue-900/50 hover:text-blue-400"
                    >
                        Absensi
                    </Link>
                    <Link
                        href="/dashboard/reports"
                        className="block px-6 py-3 text-gray-300 hover:bg-blue-900/50 hover:text-blue-400"
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
