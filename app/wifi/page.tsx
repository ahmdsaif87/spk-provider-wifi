'use client';

import { useEffect, useState } from 'react';
import BobotForm from '@/components/BobotForm';
import RankingTable from '@/components/RankingTable';
import { Label } from '@/components/ui/label';
import { alternatif, kriteria } from '@/constants/data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function WifiPage() {
    const [bobot, setBobot] = useState<number[]>([0.2, 0.2, 0.2, 0.2, 0.2]);
    const [selectedPresetId, setSelectedPresetId] = useState<string>('');
    type Ranking = { nama: string; nilai: number; ranking: number };
    type Preset = { id: number; nama: string; bobot: string };

    const [hasil, setHasil] = useState<Ranking[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);

    useEffect(() => {
        fetch('/api/presets')
            .then((res) => res.json())
            .then((data) => setPresets(data));
    }, []);

    const handleSubmit = async (bobot: number[]) => {
        const res = await fetch('/api/saw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bobot }),
        });

        const data = await res.json();
        if (!data.error) {
            setHasil(data);
        } else {
            alert(data.error);
        }
    };

    const handlePresetChange = async (value: string) => {
        setSelectedPresetId(value);
        if (value === 'rekomendasi') {
            const res = await fetch('/api/bobot/rekomendasi');
            const data = await res.json();
            setBobot(data.bobot);
        } else {
            const preset = presets.find((p) => p.id.toString() === value);
            if (preset && typeof preset.bobot === 'string') {
                try {
                    const parsed = JSON.parse(preset.bobot);
                    if (Array.isArray(parsed)) {
                        setBobot(parsed);
                    } else {
                        console.warn('Bobot tidak berbentuk array');
                    }
                } catch (e) {
                    console.error('Gagal parse preset.bobot:', e);
                }
            } else {
                console.warn('Preset tidak ditemukan atau bobot kosong');
            }
        }
    };

    return (
        <main className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">SPK Pemilihan Provider WiFi</h1>
            <p className="text-sm text-muted-foreground mb-8">
                Sistem Pendukung Keputusan untuk memilih provider WiFi terbaik berdasarkan kriteria yang telah ditentukan.
            </p>

            <div className="mt-6 mb-10">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                    Berikut adalah daftar provider WiFi yang tersedia:
                </p>
                <div className="overflow-auto">
                    <table className="w-full text-sm border">
                        <thead>
                            <tr className="bg-muted text-center">
                                <th className="border p-2">Provider</th>
                                <th className="border p-2">Tarif</th>
                                <th className="border p-2">Kecepatan</th>
                                <th className="border p-2">FUP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alternatif.map((alt, i) => (
                                <tr key={i} className="text-center">
                                    <td className="border p-2 font-medium">{alt.nama}</td>
                                    <td className="border p-2">{alt.nilai[0]}</td>
                                    <td className="border p-2">{alt.nilai[1]}</td>
                                    <td className="border p-2">{alt.nilai[4]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                    Masukkan bobot untuk tiap kriteria (total = 1) atau pilih preset di bawah
                </p>
                <Label className="mb-1 block">Pilih Bobot Preset</Label>
                <Select onValueChange={handlePresetChange} value={selectedPresetId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih preset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rekomendasi">
                            Bobot Rata-rata 20 Customer
                        </SelectItem>
                        {presets.map((preset) => (
                            <SelectItem key={preset.id} value={preset.id.toString()}>
                                {preset.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <BobotForm onSubmit={handleSubmit} bobot={bobot} setBobot={setBobot} />
            {hasil.length > 0 && <RankingTable data={hasil} />}
        </main>
    );
}
