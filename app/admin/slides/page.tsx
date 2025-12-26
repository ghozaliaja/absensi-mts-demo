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
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">📺 MANAJEMEN SLIDE INFO</h1>
                    <Link href="/admin" className="text-blue-600 hover:underline">← Kembali ke Dashboard</Link>
                </div>

                {/* FORM TAMBAH SLIDE */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Tambah Slide Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Judul</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full border p-2 rounded"
                                placeholder="Contoh: Pengumuman Rapat"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Tipe Slide</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="text"
                                        checked={type === 'text'}
                                        onChange={() => setType('text')}
                                    /> Teks
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="image"
                                        checked={type === 'image'}
                                        onChange={() => setType('image')}
                                    /> Gambar (URL)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">
                                {type === 'text' ? 'Isi Pesan' : 'URL Gambar'}
                            </label>
                            {type === 'text' ? (
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full border p-2 rounded h-32"
                                    placeholder="Tulis pengumuman di sini..."
                                    required
                                />
                            ) : (
                                <input
                                    type="url"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    placeholder="https://example.com/foto.jpg"
                                    required
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Menyimpan...' : '💾 SIMPAN SLIDE'}
                        </button>
                    </form>
                </div>

                {/* LIST SLIDE */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Daftar Slide Aktif</h2>
                    {loading ? <p>Loading...</p> : (
                        <div className="space-y-4">
                            {slides.map(slide => (
                                <div key={slide.id} className={`border p-4 rounded-lg flex justify-between items-center ${!slide.is_active && 'bg-gray-100 opacity-60'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded text-white ${slide.type === 'text' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                {slide.type.toUpperCase()}
                                            </span>
                                            <h3 className="font-bold text-lg">{slide.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{slide.content}</p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => toggleActive(slide.id, slide.is_active)}
                                            className={`px-3 py-1 rounded text-xs font-bold ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-300 text-gray-700'}`}
                                        >
                                            {slide.is_active ? 'AKTIF' : 'NON-AKTIF'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200"
                                        >
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {slides.length === 0 && <p className="text-gray-500 text-center py-4">Belum ada slide. Silakan tambah baru.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
