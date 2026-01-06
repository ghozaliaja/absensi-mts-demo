export interface JadwalItem {
    ke: number | string
    start: string
    end: string
}

export const getJadwalHariIni = (): JadwalItem[] => {
    const hari = new Date().getDay() // 0 = Minggu, 1 = Senin, ... 6 = Sabtu

    // JUMAT
    if (hari === 5) {
        return [
            { ke: 1, start: '07:00', end: '07:45' },
            { ke: 2, start: '07:45', end: '08:25' },
            { ke: 3, start: '08:25', end: '09:05' },
            { ke: 4, start: '09:05', end: '09:45' },
            { ke: 'ISTIRAHAT', start: '09:45', end: '10:00' },
            { ke: 5, start: '10:00', end: '10:40' },
            { ke: 6, start: '10:40', end: '11:20' },
        ]
    }

    // SABTU
    if (hari === 6) {
        return [
            { ke: 1, start: '07:00', end: '07:45' },
            { ke: 2, start: '07:45', end: '08:25' },
            { ke: 3, start: '08:25', end: '09:05' },
            { ke: 4, start: '09:05', end: '09:45' },
            { ke: 'ISTIRAHAT', start: '09:45', end: '10:00' },
            { ke: 5, start: '10:00', end: '10:40' },
            { ke: 6, start: '10:40', end: '11:20' },
            { ke: 7, start: '11:20', end: '12:00' },
            { ke: 8, start: '12:00', end: '12:40' },
        ]
    }

    // SENIN - KAMIS (Default)
    return [
        { ke: 1, start: '07:00', end: '07:45' },
        { ke: 2, start: '07:45', end: '08:25' },
        { ke: 3, start: '08:25', end: '09:05' },
        { ke: 4, start: '09:05', end: '09:45' },
        { ke: 'ISTIRAHAT 1', start: '09:45', end: '10:00' },
        { ke: 5, start: '10:00', end: '10:40' },
        { ke: 6, start: '10:40', end: '11:20' },
        { ke: 7, start: '11:20', end: '12:00' },
        { ke: 8, start: '12:00', end: '12:40' },
        { ke: 'ISTIRAHAT 2', start: '12:40', end: '13:10' },
        { ke: 9, start: '13:10', end: '13:50' },
        { ke: 10, start: '13:50', end: '14:30' },
    ]
}
