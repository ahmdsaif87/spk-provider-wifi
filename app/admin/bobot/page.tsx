'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { kriteria } from '@/constants/data';

export default function AdminBobotPage() {
    const [nama, setNama] = useState('');
    const [bobot, setBobot] = useState([0.2, 0.2, 0.2, 0.2, 0.2]);
    type Preset = { id: number; nama: string; bobot: string };
    const [presets, setPresets] = useState<Preset[]>([]);

    const fetchPresets = async () => {
        const res = await fetch('/api/presets');
        const data = await res.json();
        setPresets(data);
    };

    useEffect(() => {
        fetchPresets();
    }, []);

    const handleSubmit = async () => {
        await fetch('/api/presets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, bobot }),
        });
        setNama('');
        setBobot([0.2, 0.2, 0.2, 0.2, 0.2]);
        fetchPresets();
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/presets/${id}`, { method: 'DELETE' });
        fetchPresets();
    };

    return (
        <main className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Bobot Preset</h1>

            <div className="space-y-2 mb-6">
                <Label>Nama Preset</Label>
                <Input value={nama} onChange={(e) => setNama(e.target.value)} />
                <div className="grid grid-cols-5 gap-4">
                    {bobot.map((b, i) => (
                        <div key={i} className="flex flex-col items-start">
                            <label className="text-xs text-muted-foreground mb-1">
                                {kriteria[i].nama}
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={b}
                                onChange={(e) => {
                                    const updated = [...bobot];
                                    updated[i] = parseFloat(e.target.value);
                                    setBobot(updated);
                                }}
                            />
                        </div>
                    ))}
                </div>
                <Button onClick={handleSubmit}>Tambah Preset</Button>
            </div>

            <h2 className="text-lg font-semibold mb-2">Daftar Preset</h2>
            <ul className="space-y-2">
                {presets.map((p) => (
                    <li key={p.id} className="flex justify-between items-center border p-2 rounded">
                        <span>
                            <strong>{p.nama}</strong> - {JSON.parse(p.bobot).join(', ')}
                        </span>
                        <Button variant="destructive" onClick={() => handleDelete(p.id)}>
                            Hapus
                        </Button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
