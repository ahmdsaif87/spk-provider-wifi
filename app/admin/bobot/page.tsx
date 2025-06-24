'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AdminBobotPage() {
    const [nama, setNama] = useState('');
    const [bobot, setBobot] = useState<number[]>([0.2, 0.2, 0.2, 0.2, 0.2]);
    const [presets, setPresets] = useState<{ id: string; nama: string; bobot: string }[]>([]);

    const kriteriaLabels = ['Tarif', 'Kecepatan', 'Servis', 'Kelancaran', 'FUP'];

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

    const handleDelete = async (id: string) => {
        await fetch(`/api/presets/${id}`, { method: 'DELETE' });
        fetchPresets();
    };

    return (
        <main className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Bobot Preset</h1>

            {/* Form Tambah Preset */}
            <div className="space-y-2 mb-6">
                <Label>Nama Preset</Label>
                <Input value={nama} onChange={(e) => setNama(e.target.value)} />

                <div className="grid grid-cols-5 gap-4">
                    {bobot.map((b, i) => (
                        <div key={i} className="flex flex-col items-start">
                            <label className="text-xs text-muted-foreground mb-1">
                                {kriteriaLabels[i]}
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={b}
                                onChange={(e) => {
                                    const updated = [...bobot];
                                    updated[i] = parseFloat(e.target.value) || 0;
                                    setBobot(updated);
                                }}
                            />
                        </div>
                    ))}
                </div>
                <Button onClick={handleSubmit}>Tambah Preset</Button>
            </div>

            {/* Daftar Preset */}
            <h2 className="text-lg font-semibold mb-2">Daftar Preset</h2>
            <ul className="space-y-2">
                {presets.map((p, index) => (
                    <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-3 rounded"
                    >
                        <div className="mb-2 sm:mb-0">
                            <strong>{p.nama}</strong>
                            <div className="text-sm text-muted-foreground">
                                {JSON.parse(p.bobot).map((b: number, i: number) => (
                                    <span key={i}>
                                        {kriteriaLabels[i]}: <span className="font-mono">{b}</span>
                                        {i < 4 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                            Hapus
                        </Button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
