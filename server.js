import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static('.'));
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.get('/getAll', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM water ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/get', async (req, res) => {
  const id = req.query.id;
  try {
    const result = await pool.query('SELECT * FROM water WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/addWater', async (req, res) => {
  const { title, bonmun } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO water (title, bonmun) VALUES ($1, $2) RETURNING id',
      [title, bonmun]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/updateWater', async (req, res) => {
  const { id, title, bonmun } = req.body;
  try {
    await pool.query('UPDATE water SET title = $1, bonmun = $2 WHERE id = $3', [
      title,
      bonmun,
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/deleteWater', async (req, res) => {
  const id = req.query.id;
  try {
    await pool.query('DELETE FROM water WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(String(PORT)));
