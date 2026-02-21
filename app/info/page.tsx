'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Slide {
    id: number
    title: string
    type: 'text' | 'image'
    content: string
    caption?: string // Tambahan field caption
    duration: number // Durasi per slide
    created_at: string
}

export default function InfoPage() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [runningText, setRunningText] = useState('')
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

        const fetchSettings = async () => {
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'running_text')
                .single()
            if (data) setRunningText(data.value)
        }

        fetchSlides()
        fetchSettings()

        // Realtime Subscription Slides
        const slidesChannel = supabase
            .channel('public:info_slides')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'info_slides' }, () => {
                fetchSlides()
            })
            .subscribe()

        // Realtime Subscription Settings
        const settingsChannel = supabase
            .channel('public:app_settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings', filter: 'key=eq.running_text' }, (payload) => {
                if (payload.new && payload.new.value) {
                    setRunningText(payload.new.value)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(slidesChannel)
            supabase.removeChannel(settingsChannel)
        }
    }, [])

    // 2. Auto Rotation Logic
    useEffect(() => {
        if (slides.length <= 1) return

        const currentDuration = slides[currentIndex]?.duration || 60 // Default 60 detik
        const intervalMs = currentDuration * 1000

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, intervalMs)

        return () => clearTimeout(timer)
    }, [currentIndex, slides])

    // 3. Render Content
    if (loading) return (
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif'
        }}>
            Loading...
        </div>
    )

    // Default Slide if Empty
    if (slides.length === 0) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                background: 'linear-gradient(to bottom right, #166534, #000000)', // fallback for bg-gradient-to-br from-green-800 to-black
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}>
                <img src="/logo.png" alt="Logo" style={{ width: '160px', height: '160px', marginBottom: '32px' }} />
                <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '16px', margin: 0 }}>SELAMAT DATANG</h1>
                <h2 style={{ fontSize: '36px', fontWeight: '300', margin: 0 }}>DI MTS NEGERI 1 LABUHAN BATU</h2>
                <p style={{ marginTop: '32px', fontSize: '20px', opacity: 0.7 }}>Pusat Informasi Digital</p>
            </div>
        )
    }

    const currentSlide = slides[currentIndex]

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: 'black',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Progress Bar */}
            <div
                key={currentIndex}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '4px',
                    backgroundColor: '#22c55e', // green-500
                    zIndex: 50,
                    width: '0%',
                    animation: `progress ${slides[currentIndex]?.duration || 60}s linear forwards`
                }}
            ></div>

            {/* Running Text Banner */}
            {runningText && (
                <div style={{
                    position: 'absolute',
                    top: '4px', // Below progress bar
                    left: 0,
                    width: '100%',
                    backgroundColor: '#facc15', // yellow-400
                    color: 'black',
                    zIndex: 60,
                    padding: '12px 0',
                    fontWeight: '900',
                    fontSize: '28px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}>
                    <div className="marquee-content" style={{ display: 'inline-block', paddingLeft: '100%' }}>
                        {runningText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {runningText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {runningText}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .marquee-content {
                    animation: marquee-anim 35s linear infinite;
                    white-space: nowrap;
                    will-change: transform;
                }
                @keyframes marquee-anim {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
            `}</style>

            {currentSlide.type === 'image' ? (
                // TAMPILAN GAMBAR (Full Screen)
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img
                        src={currentSlide.content}
                        alt={currentSlide.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            backgroundColor: 'black'
                        }}
                    />
                    {/* Caption Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                        padding: '40px',
                        paddingTop: '128px'
                    }}>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 4px 6px rgba(0,0,0,0.5)',
                            marginBottom: '8px',
                            margin: 0
                        }}>{currentSlide.title}</h1>
                        {currentSlide.caption && (
                            <p style={{
                                fontSize: '24px',
                                color: '#e5e7eb', // gray-200
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                maxWidth: '56rem',
                                lineHeight: '1.625',
                                margin: 0
                            }}>
                                {currentSlide.caption}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                // TAMPILAN TEKS (Pengumuman)
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'linear-gradient(to bottom right, #1e3a8a, #0f172a)', // blue-900 to slate-900
                    position: 'relative'
                }}>
                    {/* Background Pattern */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: "url('/logo.png')",
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        filter: 'blur(4px)'
                    }}></div>

                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '64rem',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            fontSize: '60px',
                            fontWeight: '900',
                            color: '#facc15', // yellow-400
                            marginBottom: '48px',
                            textShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '4px solid rgba(250, 204, 21, 0.5)',
                            paddingBottom: '16px',
                            display: 'inline-block',
                            margin: '0 0 48px 0'
                        }}>
                            {currentSlide.title}
                        </h1>
                        <div style={{
                            fontSize: '36px',
                            lineHeight: '1.625',
                            fontWeight: '500',
                            color: '#f3f4f6', // gray-100
                            whiteSpace: 'pre-wrap'
                        }}>
                            {currentSlide.content}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Clock */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '24px',
                textAlign: 'right',
                opacity: 0.8,
                zIndex: 50
            }}>
                <p style={{
                    fontSize: '24px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    margin: 0
                }}>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                <p style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    margin: 0
                }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </div>
    )
}
