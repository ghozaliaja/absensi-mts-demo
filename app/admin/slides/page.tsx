'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Slide {
    id: number
    title: string
    type: 'text' | 'image'
    content: string
    is_active: boolean
    created_at: string
}

export default function AdminSlidesPage() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [loading, setLoading] = useState(true)

    // Form State
    const [title, setTitle] = useState('')
    const [type, setType] = useState<'text' | 'image'>('text')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchSlides = async () => {
        const { data } = await supabase
            .from('info_slides')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setSlides(data as Slide[])
        setLoading(false)
    }

    useEffect(() => {
        fetchSlides()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const { error } = await supabase
            .from('info_slides')
            .insert([{ title, type, content, is_active: true }])

        if (!error) {
            setTitle('')
            setContent('')
            fetchSlides()
            alert('Slide berhasil ditambahkan!')
        } else {
            alert('Gagal menambah slide: ' + error.message)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin hapus slide ini?')) return
        await supabase.from('info_slides').delete().eq('id', id)
        fetchSlides()
    }

    const toggleActive = async (id: number, currentStatus: boolean) => {
        await supabase.from('info_slides').update({ is_active: !currentStatus }).eq('id', id)
        fetchSlides()
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-8 font-sans text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        📺 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">MANAJEMEN SLIDE INFO</span>
                    </h1>
                    <Link href="/admin" className="text-green-400 hover:text-green-300 hover:underline transition-colors">← Kembali ke Dashboard</Link>
                </div>

                {/* FORM TAMBAH SLIDE */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl shadow-black/50 mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-green-400">Tambah Slide Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-300">Judul</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-500"
                                placeholder="Contoh: Pengumuman Rapat"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-300">Tipe Slide</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700 transition-colors">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="text"
                                        checked={type === 'text'}
                                        onChange={() => setType('text')}
                                        className="accent-green-500"
                                    /> Teks
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700 transition-colors">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="image"
                                        checked={type === 'image'}
                                        onChange={() => setType('image')}
                                        className="accent-green-500"
                                    /> Gambar (URL)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-300">
                                {type === 'text' ? 'Isi Pesan' : 'URL Gambar'}
                            </label>
                            {type === 'text' ? (
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded h-32 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-500"
                                    placeholder="Tulis pengumuman di sini..."
                                    required
                                />
                            ) : (
                                <input
                                    type="url"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-500"
                                    placeholder="https://example.com/foto.jpg"
                                    required
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-500 disabled:opacity-50 w-full md:w-auto transition-colors shadow-lg shadow-green-900/20"
                        >
                            {isSubmitting ? 'Menyimpan...' : '💾 SIMPAN SLIDE'}
                        </button>
                    </form>
                </div>

                {/* LIST SLIDE */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl shadow-black/50">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-blue-400">Daftar Slide Aktif</h2>
                    {loading ? <p className="text-gray-400 animate-pulse">Loading...</p> : (
                        <div className="space-y-4">
                            {slides.map(slide => (
                                <div key={slide.id} className={`border border-gray-700 bg-gray-800/50 p-4 rounded-lg flex justify-between items-center ${!slide.is_active && 'opacity-50 grayscale'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-white ${slide.type === 'text' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                                {slide.type.toUpperCase()}
                                            </span>
                                            <h3 className="font-bold text-lg text-gray-100">{slide.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{slide.content}</p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => toggleActive(slide.id, slide.is_active)}
                                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${slide.is_active ? 'bg-green-900/30 text-green-400 border border-green-500/30 hover:bg-green-900/50' : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'}`}
                                        >
                                            {slide.is_active ? 'AKTIF' : 'NON-AKTIF'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="bg-red-900/20 text-red-400 border border-red-900/30 px-3 py-1 rounded text-xs font-bold hover:bg-red-900/40 transition-colors"
                                        >
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {slides.length === 0 && <p className="text-gray-500 text-center py-8 italic">Belum ada slide. Silakan tambah baru.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
