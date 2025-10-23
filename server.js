import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());
app.use(cors());

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'systemDB',
});

app.get('/getAll', async (req, res)=>{
    const list = await getAllList();
    res.json(list);
});

app.get('/get', async (req, res) => {
    const id = req.query.id;
    const data = await getWater(id);
    res.json(data);
});

app.post('/addWater', async (req, res) => {
   const { title, bonmun } = req.body;
   try {
    const result = await addWater(title, bonmun);
    res.json({ success: true, id: result });
   } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message})
   }
});

app.delete('/deleteWater', async (req, res) => {
    const id = req.query.id;
    try {
        await deleteWater(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/updateWater', async (req, res) => {
    const { id, title, bonmun } = req.body;
    console.log(id)
    try {
        await updateWater(id, title, bonmun);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

async function getAllList() {
    const sql = 'SELECT * FROM water';
    const [rows] = await conn.query(sql);
    return rows;
}

async function getWater(id) {
    const sql = 'SELECT * from water WHERE id = ?';
    const [rows]  = await conn.query(sql, [id]);
    return rows;
}

async function addWater(title, bonmun) {
    const sql = 'INSERT INTO water (title, bonmun) values (?,?)';
    const [result] = await conn.query(sql, [title, bonmun]);
    return result.insertId;
}

async function updateWater(id, title, bonmun) {
    const sql = 'UPDATE water SET id = ?, title = ?, bonmun = ?';
    const [result] = await conn.query(sql, [id, title, bonmun]);
    return result;
}

async function deleteWater(id) {
    const sql = 'DELETE FROM water where id = ?';
    const [result]  = await conn.query(sql, [id]);
    return result.affectedRows;
}

app.listen(8000, ()=>console.log('http://localhost:8000'));