import Database from 'better-sqlite3';

const db = new Database('shot-de-estudo.db');

// tabela de histórico: cada tema sorteado vira uma linha
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    category TEXT NOT NULL,
    drawn_at TEXT NOT NULL
  )
`);

// tabela de streak: só existe uma linha (id = 1), guardando o estado atual
db.exec(`
  CREATE TABLE IF NOT EXISTS streak (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    count INTEGER NOT NULL DEFAULT 0,
    shots_today INTEGER NOT NULL DEFAULT 0,
    last_date TEXT
  )
`);

// garante que a linha do streak já existe, começando zerada
db.exec(`
  INSERT OR IGNORE INTO streak (id, count, shots_today, last_date)
  VALUES (1, 0, 0, NULL)
`);

export default db;