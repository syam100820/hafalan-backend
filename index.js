const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Database (Railway akan otomatis mengisi DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 1. Ambil data dari Cloud (GET)
app.get('/riwayat', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM riwayat ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Simpan data ke Cloud (POST)
app.post('/riwayat', async (req, res) => {
  const { nama_surat, nomor_surat, skor, tanggal } = req.body;
  try {
    await pool.query(
      'INSERT INTO riwayat (nama_surat, nomor_surat, skor, tanggal) VALUES ($1, $2, $3, $4)',
      [nama_surat, nomor_surat, skor, tanggal]
    );
    res.status(201).send("Berhasil disimpan di Cloud!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API menyala di port ${PORT}`));