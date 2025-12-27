'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Slide {
    id: number
    title: string
    type: 'text' | 'image'
    content: string
    caption?: string // Tambahan field caption
    created_at: string
}

export default function InfoPage() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // 1. Fetch Slides
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data, error } = await supabase
                    .from('info_slides')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error

                if (data && data.length > 0) {
                    setSlides(data as Slide[])
                }
            } catch (err: any) {
                console.error('Error fetching slides:', err)
                setErrorMsg(err.message || 'Gagal mengambil data slide')
            } finally {
                setLoading(false)
            }
        }

        fetchSlides()

        // Realtime Subscription
        const channel = supabase
            .channel('public:info_slides')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'info_slides' }, () => {
                fetchSlides()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // 2. Auto Rotation Logic
    useEffect(() => {
        if (slides.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 60000) // Ganti setiap 60 detik

        return () => clearInterval(interval)
    }, [slides])

    // 3. Render Content
    if (loading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-white">Loading...</div>

    // Default Slide if Empty
    if (slides.length === 0) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-green-800 to-black flex flex-col items-center justify-center text-white p-10 text-center">
                <img src="/logo.png" alt="Logo" className="w-40 h-40 mb-8 animate-pulse" />
                <h1 className="text-6xl font-bold mb-4">SELAMAT DATANG</h1>
                <h2 className="text-4xl font-light">DI MTS NEGERI 1 LABUHAN BATU</h2>
                <p className="mt-8 text-xl opacity-70">Pusat Informasi Digital</p>
                {errorMsg && (
                    <div className="mt-8 p-4 bg-red-900/50 border border-red-500 rounded text-red-200 max-w-lg">
                        <p className="font-bold">⚠️ Error Debugging:</p>
                        <p className="font-mono text-sm">{errorMsg}</p>
                    </div>
                )}
            </div>
        )
    }

    const currentSlide = slides[currentIndex]

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
            {/* Progress Bar (Optional Visual Indicator) */}
            <div className="absolute top-0 left-0 h-1 bg-green-500 z-50 animate-[width_60s_linear_infinite]" style={{ width: '100%' }}></div>

            {currentSlide.type === 'image' ? (
                // TAMPILAN GAMBAR (Full Screen)
                <div className="w-full h-full relative">
                    <img
                        src={currentSlide.content}
                        alt={currentSlide.title}
                        className="w-full h-full object-contain bg-black"
                    />
                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-10 pt-32">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">{currentSlide.title}</h1>
                        {currentSlide.caption && (
                            <p className="text-2xl text-gray-200 drop-shadow-md max-w-4xl leading-relaxed">
                                {currentSlide.caption}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                // TAMPILAN TEKS (Pengumuman)
                <div className="w-full h-full flex flex-col items-center justify-center p-20 bg-gradient-to-br from-blue-900 to-slate-900 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain blur-sm"></div>

                    <div className="relative z-10 max-w-5xl text-center">
                        <h1 className="text-6xl font-black text-yellow-400 mb-12 drop-shadow-md uppercase tracking-wide border-b-4 border-yellow-400/50 pb-4 inline-block">
                            {currentSlide.title}
                        </h1>
                        <div className="text-4xl leading-relaxed font-medium text-gray-100 whitespace-pre-wrap">
                            {currentSlide.content}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Clock */}
            <div className="absolute bottom-4 right-6 text-right opacity-80 z-50">
                <p className="text-2xl font-mono font-bold">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-sm uppercase">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </div>
    )
}
