'use client';

import { useEffect, useState } from 'react';
import BobotForm from '@/components/BobotForm';
import RankingTable from '@/components/RankingTable';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    const [hasil, setHasil] = useState<{ nama: string; nilai: number; ranking: number }[]>([]);
    const [presets, setPresets] = useState<{ id_pembobotan: string; nama: string; bobot: string }[]>([]);
    const [alternatif, setAlternatif] = useState<{ nama: string; nilai: number[] }[]>([]);

    const [newAlt, setNewAlt] = useState({
        nama: '',
        tarif: '',
        kecepatan: '',
        fup: '',
    });

    useEffect(() => {
        fetch('/api/presets')
            .then((res) => res.json())
            .then((data) => setPresets(data));

        fetch('/api/provider')
            .then((res) => res.json())
            .then((data) => setAlternatif(data));
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

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAlt({ ...newAlt, [e.target.name]: e.target.value });
    };

    const handleAddAlternatif = async () => {
        const payload = {
            ...newAlt,
            tarif: parseFloat(newAlt.tarif),
            kecepatan: parseFloat(newAlt.kecepatan),
            servis: 0,
            kelancaran: 0,
            fup: parseFloat(newAlt.fup),
        };

        const res = await fetch('/api/provider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const updated = await fetch('/api/provider').then((res) => res.json());
            setAlternatif(updated);
            setNewAlt({ nama: '', tarif: '', kecepatan: '', fup: '' });
        } else {
            alert('Gagal menambahkan provider');
        }
    };

    const handlePresetChange = async (value: string) => {
        setSelectedPresetId(value);
        if (value === 'rekomendasi') {
            const res = await fetch('/api/bobot/rekomendasi');
            const data = await res.json();
            setBobot(data.bobot);
        } else {
            const preset = presets.find((p) => p.id_pembobotan === value);
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
        <main className="max-w-2xl mx-auto p-6 justify-between">
            <h1 className="text-2xl text-center font-bold mb-6">SPK Pemilihan Provider WiFi</h1>
            <p className="text-sm text-muted-foreground mb-4">
                Sistem Pendukung Keputusan untuk memilih provider WiFi terbaik berdasarkan kriteria yang telah ditentukan.
            </p>
            <Card className="flex flex-col items-justify p-3 mb-3">
            <div className="mt-2 mb-2">
                <p className="text-lg font-semibold mb-4">
                    Data Provider WiFi yang tersedia:
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
            </Card>

            <Card className="flex flex-col items-justify p-3 mb-3">
            <div className="mt-2 mb-2">
                <h2 className="text-lg font-semibold mb-2">Tambah Provider WiFi</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            name="nama"
                            value={newAlt.nama}
                            onChange={handleAltChange}
                            placeholder="Contoh: MyRepublic"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="tarif">Tarif</Label>
                        <Input
                            id="tarif"
                            name="tarif"
                            type="number"
                            value={newAlt.tarif}
                            onChange={handleAltChange}
                            placeholder="Contoh: 300000"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="kecepatan">Kecepatan</Label>
                        <Input
                            id="kecepatan"
                            name="kecepatan"
                            type="number"
                            value={newAlt.kecepatan}
                            onChange={handleAltChange}
                            placeholder="Contoh: 50"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="fup">FUP</Label>
                        <Input
                            id="fup"
                            name="fup"
                            type="number"
                            value={newAlt.fup}
                            onChange={handleAltChange}
                            placeholder="Contoh: 100"
                        />
                    </div>
                </div>

                <Button onClick={handleAddAlternatif} className="mt-4">
                    Tambah Provider
                </Button>
            </div>
            </Card>

            <Card className="flex flex-col items-justify p-3 mb-3">
            <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                    Masukkan bobot untuk tiap kriteria (total = 1) atau pilih preset di bawah
                </p>
                <Label className="mb-3 block">Pilih Bobot Preset</Label>
                <Select onValueChange={handlePresetChange} value={selectedPresetId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih preset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rekomendasi">
                            Bobot Rata-rata 20 Customer
                        </SelectItem>
                        {presets.map((preset) => (
                            <SelectItem key={preset.id_pembobotan} value={preset.id_pembobotan}>
                                {preset.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <BobotForm onSubmit={handleSubmit} bobot={bobot} setBobot={setBobot} />
            </Card>
            <Card className="flex flex-col items-justify p-3 mb-3">
            {hasil.length > 0 && <RankingTable data={hasil} />}
            </Card>
        </main>
    );
}
