'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminSettingsPage() {
    const [runningText, setRunningText] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'running_text')
                .single()

            if (data) {
                setRunningText(data.value)
            } else if (error && error.code !== 'PGRST116') {
                console.error('Error fetching settings:', error)
            }
            setLoading(false)
        }

        fetchSettings()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const { error } = await supabase
            .from('app_settings')
            .upsert({ key: 'running_text', value: runningText }, { onConflict: 'key' })

        if (error) {
            alert('Gagal menyimpan settings: ' + error.message)
        } else {
            alert('Settings berhasil disimpan!')
        }
        setIsSaving(false)
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-8 font-sans text-gray-100">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        ⚙️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">PENGATURAN APLIKASI</span>
                    </h1>
                    <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">← Kembali</Link>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-yellow-400">
                                🏃 RUNNING TEXT (PENGUMUMAN BERJALAN)
                            </label>
                            <textarea
                                value={runningText}
                                onChange={e => setRunningText(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 p-4 rounded-lg h-32 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder-gray-600"
                                placeholder="Tulis pesan yang akan berjalan di TV..."
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                *Teks ini akan muncul secara otomatis di bagian atas layar TV Slideshow.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || isSaving}
                            className="bg-yellow-600 hover:bg-yellow-500 text-black font-black py-3 px-8 rounded-lg transition-all shadow-lg shadow-yellow-900/20 disabled:opacity-50 w-full"
                        >
                            {isSaving ? 'SEDANG MENYIMPAN...' : '💾 SIMPAN PERUBAHAN'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h3 className="text-blue-400 font-bold mb-1">💡 Tips</h3>
                    <p className="text-sm text-gray-400">
                        Gunakan kalimat yang singkat dan padat agar mudah dibaca saat berjalan.
                        Teks akan langsung terupdate di TV secara real-time.
                    </p>
                </div>
            </div>
        </div>
    )
}
