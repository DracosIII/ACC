import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const createEmployeeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit employee creation attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, '../dist'), { dotfiles: 'allow' }));

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'acc_data',
  API_PORT = '4000',
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

function toIso(dt) {
  if (!dt) return null;
  // mysql2 can return Date objects
  if (dt instanceof Date) return dt.toISOString();
  // or string "YYYY-MM-DD HH:mm:ss"
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function normalizeLowerTrim(value) {
  return String(value || '').trim().toLowerCase();
}

async function verifyPassword(storedHash, rawPassword, passwordSha256) {
  const normalizedStored = String(storedHash || '');
  const clientSha = normalizeLowerTrim(passwordSha256);
  const fallbackSha = normalizeLowerTrim(rawPassword);

  if (!normalizedStored) return false;

  // bcrypt hash format
  if (normalizedStored.startsWith('$2')) {
    if (clientSha) {
      const okSha = await bcrypt.compare(clientSha, normalizedStored);
      if (okSha) return true;
    }
    if (rawPassword) {
      const okRaw = await bcrypt.compare(String(rawPassword), normalizedStored);
      if (okRaw) return true;
    }
    if (fallbackSha) {
      return bcrypt.compare(fallbackSha, normalizedStored);
    }
    return false;
  }

  // plain SHA-256 hex fallback
  if (/^[a-f0-9]{64}$/i.test(normalizedStored)) {
    if (clientSha && clientSha === normalizedStored.toLowerCase()) return true;
    if (fallbackSha && fallbackSha === normalizedStored.toLowerCase()) return true;
    return false;
  }

  // last-resort plain comparison
  return rawPassword ? normalizedStored === String(rawPassword) : false;
}

function normalizeUser(row) {
  if (!row) return null;
  const displayName = row.name ?? `${row.nom ?? ''} ${row.prenom ?? ''}`.trim();
  let normalizedRole = row.role;
  if (normalizedRole === 'employé') normalizedRole = 'employe';
  
  return {
    id: row.id,
    username: row.username ?? row.email,
    name: displayName,
    role: normalizedRole,
    site_id: row.site_id ?? null,
    adresse: row.adresse ?? undefined,
    tel_urgence: row.tel_urgence ?? row.telephone ?? undefined,
    contact_urgence_nom: row.contact_urgence_nom ?? row.nom ?? undefined,
  };
}

function normalizePatient(row, bpmHistory = [], assignedEmployeeIds = []) {
  return {
    id: row.id,
    name: row.name,
    room: row.room,
    age: row.age,
    bpmHistory,
    currentAlerts: {
      chute_detecte: Boolean(row.chute_detecte),
      chute_date: toIso(row.chute_date),
      bnt_presse: Boolean(row.bnt_presse),
      bnt_date: toIso(row.bnt_date),
    },
    assignedEmployeeIds,
    linkedUserId: row.linked_user_id ?? undefined,
  };
}

app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB unavailable' });
  }
});

// -------------------------
// Auth
// -------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, email, password, identitySha256, emailSha256, passwordSha256 } = req.body ?? {};
    const identity = String(email || username || '').trim();
    const identityHash = String(identitySha256 || emailSha256 || '').trim().toLowerCase();

    if ((!identity && !identityHash) || (!password && !passwordSha256)) {
      return res.status(400).json({ error: 'identifiant/email et mot de passe requis' });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        email,
        password,
        nom,
        prenom,
        role, site_id,
        adresse,
        telephone
       FROM users
       WHERE email = :identity OR LOWER(SHA2(email, 256)) = :identityHash
       LIMIT 1`,
      { identity, identityHash }
    );
    const row = rows?.[0];
    if (!row) return res.status(401).json({ error: 'Identifiants invalides' });

    const ok = await verifyPassword(row.password, password, passwordSha256);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    return res.json(normalizeUser(row));
  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, emailSha256 } = req.body ?? {};
    const identity = String(email || '').trim();
    const identityHash = String(emailSha256 || '').trim().toLowerCase();

    if (!identity && !identityHash) {
      return res.status(400).json({ error: 'email requis' });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        email,
        password,
        nom,
        prenom,
        role, site_id,
        adresse,
        telephone
       FROM users
       WHERE email = :identity OR LOWER(SHA2(email, 256)) = :identityHash
       LIMIT 1`,
      { identity, identityHash }
    );
    const row = rows?.[0];
    
    // Si l'utilisateur n'existe pas
    if (!row) {
      return res.status(401).json({ error: 'Ce compte Google n\'est associé à aucun utilisateur.' });
    }

    return res.json(normalizeUser(row));
  } catch (error) {
    console.error('Erreur google login:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

app.post('/api/auth/microsoft', async (req, res) => {
  try {
    const { email, emailSha256 } = req.body ?? {};
    const identity = String(email || '').trim();
    const identityHash = String(emailSha256 || '').trim().toLowerCase();

    if (!identity && !identityHash) {
      return res.status(400).json({ error: 'email requis' });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        email,
        password,
        nom,
        prenom,
        role, site_id,
        adresse,
        telephone
       FROM users
       WHERE email = :identity OR LOWER(SHA2(email, 256)) = :identityHash
       LIMIT 1`,
      { identity, identityHash }
    );
    const row = rows?.[0];
    
    // Si l'utilisateur n'existe pas
    if (!row) {
      return res.status(401).json({ error: 'Ce compte Microsoft n\'est associé à aucun utilisateur.' });
    }

    return res.json(normalizeUser(row));
  } catch (error) {
    console.error('Erreur microsoft login:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// -------------------------
// Users
// -------------------------
app.patch('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'id invalide' });

  const allowed = ['nom', 'prenom', 'adresse', 'telephone'];
  const data = req.body ?? {};

  const sets = [];
  const params = { id };
  for (const key of allowed) {
    if (key in data) {
      sets.push(`${key} = :${key}`);
      params[key] = data[key] === '' ? null : data[key];
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'Aucun champ à mettre à jour' });

  await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = :id`, params);
  const [rows] = await pool.query(
    'SELECT id, email, nom, prenom, role, site_id, adresse, telephone FROM users WHERE id = :id LIMIT 1',
    { id }
  );
  return res.json(normalizeUser(rows?.[0]));
});

// -------------------------
// Admin - employees
// -------------------------
app.get('/api/employees', async (req, res) => {
  const targetSiteId = req.query.siteId ? Number(req.query.siteId) : null;
  if (targetSiteId) {
    const [rows] = await pool.query(
      "SELECT id, email, nom, prenom, role, site_id, adresse, telephone FROM users WHERE role != 'patient' AND site_id = :targetSiteId ORDER BY nom ASC",
      { targetSiteId }
    );
    res.json((rows ?? []).map(normalizeUser));
  } else {
    const [rows] = await pool.query(
      "SELECT id, email, nom, prenom, role, site_id, adresse, telephone FROM users WHERE role != 'patient' ORDER BY nom ASC"
    );
    res.json((rows ?? []).map(normalizeUser));
  }
});

app.post('/api/employees', createEmployeeLimiter, async (req, res) => {
  const { email, nom, prenom, telephone, adresse, password, passwordSha256, role, site_id } = req.body ?? {};
  if (!email || !nom || !prenom || (!password && !passwordSha256)) return res.status(400).json({ error: 'email, nom, prenom et password requis' });

  const basePassword = passwordSha256 || String(password).trim();
  const password_hash = await bcrypt.hash(basePassword, 10);
  let dbRole = role || 'employé';
  if (dbRole === 'employe') dbRole = 'employé';

  try {
    const [result] = await pool.query(
      "INSERT INTO users (email, password, nom, prenom, telephone, adresse, role, site_id) VALUES (:email, :password_hash, :nom, :prenom, :telephone, :adresse, :role, :site_id)",
      { email, password_hash, nom, prenom, telephone: telephone || null, adresse: adresse || null, role: dbRole, site_id: site_id || null }
    );
    const id = result.insertId;
    const [rows] = await pool.query(
      'SELECT id, email, nom, prenom, role, site_id, adresse, telephone FROM users WHERE id = :id LIMIT 1',
      { id }
    );
    res.status(201).json(normalizeUser(rows?.[0]));
  } catch (e) {
    // Duplicate email, etc.
    res.status(400).json({ error: "Impossible de créer l'utilisateur (email déjà pris ?)" });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'id invalide' });
  await pool.query('DELETE FROM users WHERE id = :id', { id });
  res.json({ ok: true });
});

// -------------------------
// Admin - patients
// -------------------------
app.post('/api/patients', async (req, res) => {
  const { name, room, age, site_id } = req.body ?? {};
  if (!name || !room || !Number.isFinite(Number(age))) {
    return res.status(400).json({ error: 'name, room, age requis' });
  }

  try {
    // Les patients sont des utilisateurs avec role 'patient'
    const password_hash = await bcrypt.hash('changeme', 10);
    const [nom, ...prenoms] = name.split(' ');
    const prenom = prenoms.join(' ') || ' ';
    const [result] = await pool.query(
      `INSERT INTO users (email, password, nom, prenom, age, site_id, adresse, role)
       VALUES (:email, :password_hash, :nom, :prenom, :age, :site_id, :adresse, 'patient')`,
      {
        email: `patient_${Date.now()}@medimonitor.local`,
        password_hash,
        nom,
        prenom,
        age: Number(age),
        site_id: site_id || null,
        adresse: room || null,
      }
    );
    const patientId = result.insertId;

    // Seed a small initial history (20 points)
    const now = Date.now();
    for (let i = 20; i > 0; i--) {
      await pool.query(
        'INSERT INTO bpm (id_patient, valeur_bpm, date_mesure) VALUES (:id_patient, :valeur_bpm, :date_mesure)',
        {
          id_patient: patientId,
          valeur_bpm: 70,
          date_mesure: new Date(now - i * 60000)
        }
      );
    }

    res.status(201).json({ ok: true, id: patientId });
  } catch (e) {
    res.status(400).json({ error: "Impossible de créer le patient" });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'id invalide' });
  await pool.query('DELETE FROM users WHERE id = :id AND role = "patient"', { id });
  res.json({ ok: true });
});

app.patch('/api/patients/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'id invalide' });
  const { name, room, age } = req.body ?? {};
  
  if (name || room || age !== undefined) {
      await pool.query(
        'UPDATE users SET nom = IFNULL(:name, nom), age = IFNULL(:age, age) WHERE id = :id AND role = "patient"',
        { id, name: name || null, room: room || null, age: Number(age) || null }
      );
  }
  res.json({ ok: true });
});

// Toggle assignment (many-to-many)
app.post('/api/assignments/toggle', async (req, res) => {
  const { patientId, employeeId } = req.body ?? {};
  const pid = Number(patientId);
  const eid = Number(employeeId);
  if (!Number.isFinite(pid) || !Number.isFinite(eid)) return res.status(400).json({ error: 'IDs invalides' });

  const [rows] = await pool.query(
    'SELECT 1 AS ok FROM assignments WHERE id_patient = :pid AND id_employe = :eid LIMIT 1',
    { pid, eid }
  );
  if (rows?.length) {
    await pool.query('DELETE FROM assignments WHERE id_patient = :pid AND id_employe = :eid', { pid, eid });
    return res.json({ ok: true, assigned: false });
  }

  await pool.query('INSERT INTO assignments (id_patient, id_employe) VALUES (:pid, :eid)', { pid, eid });
  return res.json({ ok: true, assigned: true });
});

// -------------------------
// Dashboard (role-based)
// -------------------------
app.get('/api/dashboard', async (req, res) => {
  const userId = Number(req.query.userId);
  if (!Number.isFinite(userId)) return res.status(400).json({ error: 'userId requis' });

  const [urows] = await pool.query(
    'SELECT id, email, nom, prenom, role, site_id, adresse, telephone FROM users WHERE id = :id LIMIT 1',
    { id: userId }
  );
  const user = normalizeUser(urows?.[0]);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

  // Patients selection
  let patientRows = [];
  if (user.role === 'super_admin') {
    const targetSiteId = req.query.siteId ? Number(req.query.siteId) : null;
    if (targetSiteId) {
      const [rows] = await pool.query('SELECT id, nom, prenom, age, role, site_id, adresse, telephone FROM users WHERE role = "patient" AND site_id = :targetSiteId ORDER BY nom ASC', { targetSiteId });
      patientRows = rows ?? [];
    } else {
      const [rows] = await pool.query('SELECT id, nom, prenom, age, role, site_id, adresse, telephone FROM users WHERE role = "patient" ORDER BY nom ASC');
      patientRows = rows ?? [];
    }
  } else if (user.role === 'admin') {
    const [rows] = await pool.query('SELECT id, nom, prenom, age, role, site_id, adresse, telephone FROM users WHERE role = "patient" AND site_id = :site_id ORDER BY nom ASC', { site_id: user.site_id });
    patientRows = rows ?? [];
  } else if (user.role === 'employe') {
    const [rows] = await pool.query(
      `SELECT u.id, u.nom, u.prenom, u.age, u.role, u.site_id, u.adresse, u.telephone
       FROM users u
       JOIN assignments a ON a.id_patient = u.id
       WHERE a.id_employe = :eid AND u.role = 'patient' AND u.site_id = :site_id
       ORDER BY u.nom ASC`,
      { eid: user.id, site_id: user.site_id }
    );
    patientRows = rows ?? [];
  } else {
    // Patient
    patientRows = [urows[0]];
  }

  const patientIds = patientRows.map((p) => p.id);
  if (patientIds.length === 0) return res.json([]);

  // Assignments for these patients
  const [arows] = await pool.query(
    'SELECT id_patient, id_employe FROM assignments WHERE id_patient IN (:ids)',
    { ids: patientIds }
  );
  const assignedByPatient = new Map();
  for (const r of arows ?? []) {
    const arr = assignedByPatient.get(r.id_patient) ?? [];
    arr.push(r.id_employe);
    assignedByPatient.set(r.id_patient, arr);
  }

  // Last 20 bpm readings for all patients
  const [brows] = await pool.query(
    `SELECT id, id_patient, valeur_bpm, date_mesure
     FROM bpm
     WHERE id_patient IN (:ids)
     ORDER BY id_patient ASC, date_mesure ASC`,
    { ids: patientIds }
  );
  const bpmByPatient = new Map();
  for (const r of brows ?? []) {
    const arr = bpmByPatient.get(r.id_patient) ?? [];
    arr.push({
      id: Number(r.id),
      patient_id: Number(r.id_patient),
      valeur: Number(r.valeur_bpm),
      date_mesure: toIso(r.date_mesure),
    });
    bpmByPatient.set(r.id_patient, arr);
  }

  // Keep only last 20 points per patient
  for (const [pid, arr] of bpmByPatient.entries()) {
    if (arr.length > 20) bpmByPatient.set(pid, arr.slice(-20));
  }

  // Get alerts (chute et bnt)
  const [crows] = await pool.query(
    'SELECT id_patient, chute_detectee, date_chute FROM chute WHERE id_patient IN (:ids)',
    { ids: patientIds }
  );
  const chuteByPatient = new Map();
  for (const r of crows ?? []) {
    chuteByPatient.set(r.id_patient, {
      chute_detecte: Boolean(r.chute_detectee),
      chute_date: toIso(r.date_chute),
    });
  }

  const [bntrows] = await pool.query(
    'SELECT id_patient, appui_detecte, date_appui FROM bnt WHERE id_patient IN (:ids)',
    { ids: patientIds }
  );
  const bntByPatient = new Map();
  for (const r of bntrows ?? []) {
    bntByPatient.set(r.id_patient, {
      bnt_presse: Boolean(r.appui_detecte),
      bnt_date: toIso(r.date_appui),
    });
  }

  let patients = patientRows.map((p) => {
    const chute = chuteByPatient.get(p.id) ?? { chute_detecte: false, chute_date: null };
    const bnt = bntByPatient.get(p.id) ?? { appui_detecte: false, date_appui: null };

    return {
      id: p.id,
      name: `${p.nom} ${p.prenom}`,
      room: p.nom, // ou utilise un champ "room" si tu l'as
      age: p.age || 0,
      adresse: p.adresse || '',
      telephone: p.telephone || '',
      bpmHistory: bpmByPatient.get(p.id) ?? [],
      currentAlerts: {
        chute_detecte: chute.chute_detecte,
        chute_date: chute.chute_date,
        bnt_presse: bnt.appui_detecte,
        bnt_date: bnt.date_appui,
      },
      assignedEmployeeIds: assignedByPatient.get(p.id) ?? [],
      linkedUserId: p.id,
    };
  });

  if (user.role === 'employe') {
    // urgences en premier
    patients.sort((a, b) => {
      const ae = a.currentAlerts.chute_detecte || a.currentAlerts.bnt_presse;
      const be = b.currentAlerts.chute_detecte || b.currentAlerts.bnt_presse;
      if (ae && !be) return -1;
      if (!ae && be) return 1;
      return 0;
    });
  }

  res.json(patients);
});

// Fallback for SPA routing - catch all non-API routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return;
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(Number(API_PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`API MediMonitor Pro démarrée sur http://localhost:${API_PORT}`);
});


// -------------------------
// Sites (Super Admin)
// -------------------------
app.get('/api/sites', async (req, res) => {
  const [rows] = await pool.query("SELECT id, nom, adresse FROM sites ORDER BY nom ASC");
  res.json(rows);
});

app.post('/api/sites', async (req, res) => {
  const { nom, adresse } = req.body ?? {};
  if (!nom) return res.status(400).json({ error: 'nom requis' });
  try {
    await pool.query("INSERT INTO sites (nom, adresse) VALUES (:nom, :adresse)", { nom, adresse: adresse || null });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sites/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM sites WHERE id = :id", { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

