const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.bobotPreset.createMany({
        data: [
            {
                nama: 'Bobot Mahasiswa',
                bobot: JSON.stringify([0.3, 0.25, 0.2, 0.15, 0.1]),
            },
            {
                nama: 'Bobot IT Expert',
                bobot: JSON.stringify([0.1, 0.3, 0.25, 0.25, 0.1]),
            },
            {
                nama: 'Bobot Rumah Tangga',
                bobot: JSON.stringify([0.4, 0.2, 0.2, 0.1, 0.1]),
            },
            {
                nama: 'Bobot Karyawan',
                bobot: JSON.stringify([0.25, 0.25, 0.25, 0.15, 0.1]),
            },
            {
                nama: 'Bobot Pelajar',
                bobot: JSON.stringify([0.2, 0.3, 0.25, 0.15, 0.1]),
            },

        ],
    });
    console.log('✅ Dummy preset bobot berhasil ditambahkan!');
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
