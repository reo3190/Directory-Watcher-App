import path from "path";
import { app } from "electron";
import Database from "better-sqlite3";
// const Database = require('better-sqlite3');

interface DB_Watcher {
  name: string;
  path: string;
  room_name: string;
  room_id: string;
  icon: string;
  message_template: string;
  mute: string;
  depth: string;
}

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

// アプリのuserDataフォルダ内にデータベースを作成
export const dbPath = isDebug
  ? path.join(__dirname, "assets", "logs.sqlite")
  : path.join(app.getPath("userData"), "logs.sqlite");
const db = new Database(dbPath);

// テーブル作成（なければ）

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    message TEXT NOT NULL,
    state TEXT NOT NULL
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS watcher (
    name TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    room_name TEXT NOT NULL,
    room_id TEXT NOT NULL,
    icon TEXT NOT NULL,
    message_template TEXT NOT NULL,
    mute TEXT NOT NULL,
    depth TEXT NOT NULL
  )
`
).run();

const defCol_watcher: { [key: string]: string } = {
  name: "''",
  path: "''",
  room_name: "''",
  room_id: "''",
  icon: "''",
  message_template: "''",
  mute: "0",
  depth: "0",
};

const defCol_logs: { [key: string]: string } = {
  id: "''",
  name: "''",
  timestamp: "''",
  message: "''",
  state: "''",
};

const migrateDB = (
  table: string,
  primary: string,
  defCol: { [key: string]: string }
) => {
  const columnsInfo = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  const existingColumns = new Set(columnsInfo.map((c) => c.name));

  // 足りないカラムをチェック
  const missingColumns = Object.keys(defCol).filter(
    (col) => !existingColumns.has(col)
  );

  if (missingColumns.length === 0) {
    return; // すでに正しい構造
  }

  console.log(`[DB] ${table}テーブルのマイグレーションを実施します`);

  // 一時テーブル作成
  const tempTable = `
    CREATE TABLE ${table}_temp (
      ${Object.entries(defCol)
        .map(([key, _]) => {
          return primary == key ? `${key} TEXT PRIMARY KEY` : `${key} TEXT`;
        })
        .join(", ")}
    )
  `;
  db.prepare(tempTable).run();

  // データをコピー（既存カラムのみ）
  const defaultInsertColumns = Object.keys(defCol)
    .map((col) => (existingColumns.has(col) ? col : `${defCol[col]} AS ${col}`))
    .join(", ");

  db.prepare(
    `INSERT INTO ${table}_temp SELECT ${defaultInsertColumns} FROM ${table}`
  ).run();

  // 古いテーブル削除 & 新テーブルリネーム
  db.prepare(`DROP TABLE ${table}`).run();
  db.prepare(`ALTER TABLE ${table}_temp RENAME TO ${table}`).run();

  console.log(`[DB] ${table}テーブルのマイグレーション完了`);
};
migrateDB("watcher", "name", defCol_watcher);
migrateDB("logs", "id", defCol_logs);

const regsterWatch = (info: Watcher) => {
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO watcher (name, path, room_name, room_id, icon, message_template, mute, depth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    info.name,
    info.path,
    info.room?.name,
    info.room?.id,
    info.room?.icon,
    info.msgTemplate,
    info.mute ? "1" : "0",
    info.depth.toString()
  );
};

const unregsterWatch = (info: Watcher) => {
  const stmt = db.prepare("DELETE FROM watcher WHERE name = ?");
  const result = stmt.run(info.name);
  // return result.changes; // 削除された行数（0なら対象がなかった）
};

const getAllWatchs = (): Watcher[] => {
  const stmt = db.prepare("SELECT * FROM watcher");
  const rows = stmt.all() as DB_Watcher[];
  const ret: Watcher[] = [];
  rows.forEach((e) => {
    const info: Watcher = {
      name: e.name,
      path: e.path,
      room: { name: e.room_name, id: e.room_id, icon: e.icon },
      msgTemplate: e.message_template,
      mute: e.mute == "1" ? true : false,
      depth: Number(e.depth),
      log: [],
    };
    const _info = getLogs(info);
    ret.push(_info);
  });
  return ret;
};

const saveLog = (info: Watcher, message: string, id: string) => {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO logs (id, name, timestamp, message, state) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(id, info.name, now, message, "none");
};

const editLog = (log: LogEntry): LogEntry => {
  log.state = "edit";
  const stmt = db.prepare(
    "UPDATE logs SET message = ?, state = ? WHERE id = ?"
  );
  stmt.run(log.message, log.state, log.id);
  return log;
};

const deleteLog = (log: LogEntry): LogEntry => {
  log.state = "delete";
  const stmt = db.prepare("UPDATE logs SET state = ? WHERE id = ?");
  stmt.run(log.state, log.id);
  return log;
};

const getLogs = (info: Watcher): Watcher => {
  const stmt = db.prepare(
    "SELECT id, timestamp, message, state FROM logs WHERE name = ? ORDER BY timestamp DESC"
  );
  info.log = stmt.all(info.name) as LogEntry[];
  return info;
};

const deleteAllLogs = (info: Watcher): number => {
  const stmt = db.prepare("DELETE FROM logs WHERE name = ?");
  const result = stmt.run(info.name);
  return result.changes;
};

const ToggleMute = (info: Watcher) => {
  const stmt = db.prepare(`
    UPDATE watcher
    SET mute = ?
    WHERE name = ?
  `);
  const result = stmt.run(info.mute ? "1" : "0", info.name);
  // return result.changes;
};

const isMute = (info: Watcher): boolean => {
  const stmt = db.prepare("SELECT mute FROM watcher WHERE name = ?");
  const row = stmt.get(info.name) as { mute: string };
  if (!row) return false;
  return row.mute == "1" ? true : false;
};

const getAllPaths = (): string[] => {
  const stmt = db.prepare("SELECT DISTINCT file_path FROM logs");
  const rows = stmt.all() as { file_path: string }[];
  return rows.map((row) => row.file_path);
};

export {
  regsterWatch,
  unregsterWatch,
  getAllWatchs,
  saveLog,
  editLog,
  deleteLog,
  getLogs,
  deleteAllLogs,
  isMute,
  ToggleMute,
  getAllPaths,
};
