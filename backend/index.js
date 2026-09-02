import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor do Shot de Estudo funcionando!');
});

// pega o estado atual do streak
app.get('/api/streak', (req, res) => {
  const row = db.prepare('SELECT count, shots_today, last_date FROM streak WHERE id = 1').get();
  res.json(row);
});

// pega os últimos temas sorteados (histórico)
app.get('/api/history', (req, res) => {
  const rows = db.prepare('SELECT topic, category, drawn_at FROM history ORDER BY id DESC LIMIT 8').all();
  res.json(rows);
});

// registra um tema sorteado no histórico
app.post('/api/history', (req, res) => {
  const { topic, category } = req.body;
  if (!topic || !category) {
    return res.status(400).json({ error: 'topic e category são obrigatórios' });
  }
  const drawnAt = new Date().toISOString();
  db.prepare('INSERT INTO history (topic, category, drawn_at) VALUES (?, ?, ?)').run(topic, category, drawnAt);
  res.json({ ok: true });
});

// registra um shot completo (atualiza o streak)
app.post('/api/shots', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const current = db.prepare('SELECT count, shots_today, last_date FROM streak WHERE id = 1').get();

  let { count, shots_today, last_date } = current;

  if (last_date === today) {
    shots_today += 1;
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    count = last_date === yesterday ? count + 1 : 1;
    shots_today = 1;
    last_date = today;
  }

  db.prepare('UPDATE streak SET count = ?, shots_today = ?, last_date = ? WHERE id = 1')
    .run(count, shots_today, last_date);

  res.json({ count, shots_today, last_date });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});