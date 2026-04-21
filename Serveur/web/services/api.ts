import { Patient, User, Site } from '../types';

type ApiError = {
  error?: string;
};

async function sha256Hex(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      const isHtml = /^\s*</.test(text);
      const fallback = isHtml ? 'Réponse HTML reçue au lieu de JSON (API/proxy backend indisponible ?)' : 'Réponse non JSON reçue depuis l\'API';
      throw new Error(fallback);
    }
  }

  if (!res.ok) {
    const msg = (data as ApiError | null)?.error || `Erreur API (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

// --- AUTH SERVICE ---
export async function login(username: string, password: string): Promise<User> {
  const identity = username.trim();
  const identitySha256 = await sha256Hex(identity);
  const passwordSha256 = await sha256Hex(password);

  return apiFetch<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: identity,
      password,
      identitySha256,
      emailSha256: identitySha256,
      passwordSha256,
    }),
  });
}

export async function loginWithGoogle(email: string): Promise<User> {
  const emailSha256 = await sha256Hex(email);
  return apiFetch<User>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      email,
      emailSha256
    }),
  });
}

export async function loginWithMicrosoft(email: string): Promise<User> {
  const emailSha256 = await sha256Hex(email);
  return apiFetch<User>('/api/auth/microsoft', {
    method: 'POST',
    body: JSON.stringify({
      email,
      emailSha256
    }),
  });
}

// --- PROFILE ---
export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- DASHBOARD ---
export async function fetchDashboardData(user: User, siteId?: number): Promise<Patient[]> {
  let url = `/api/dashboard?userId=${encodeURIComponent(String(user.id))}`;
  if (siteId) url += `&siteId=${siteId}`;
  return apiFetch<Patient[]>(url);
}

// --- ADMIN MANAGEMENT ---
export async function getEmployees(siteId?: number): Promise<User[]> {
  const url = siteId ? `/api/employees?siteId=${siteId}` : '/api/employees';
  return apiFetch<User[]>(url);
}

export async function addPatient(name: string, room: string, age: number, site_id?: number): Promise<void> {
  await apiFetch('/api/patients', {
    method: 'POST',
    body: JSON.stringify({ name, room, age, site_id }),
  });
}

export async function editPatient(id: number, name: string, room: string, age: number): Promise<void> {
  await apiFetch(`/api/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name, room, age }),
  });
}

export async function removePatient(id: number): Promise<void> {
  await apiFetch(`/api/patients/${id}`, { method: 'DELETE' });
}

export async function addEmployee(email: string, nom: string, prenom: string, telephone?: string, adresse?: string, password?: string, role: 'admin' | 'employe' | 'patient' = 'employe', site_id?: number): Promise<void> {
  const emailSha256 = await sha256Hex(email);
  const passwordSha256 = password ? await sha256Hex(password) : undefined;

  await apiFetch('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      email,
      emailSha256,
      nom,
      prenom,
      telephone,
      adresse,
      password,
      passwordSha256,
      role,
      site_id,
    }),
  });
}

export async function removeEmployee(id: number): Promise<void> {
  await apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
}

export async function toggleAssignment(patientId: number, employeeId: number): Promise<void> {
  await apiFetch('/api/assignments/toggle', {
    method: 'POST',
    body: JSON.stringify({ patientId, employeeId }),
  });
}


export async function getSites(): Promise<Site[]> {
  return apiFetch<Site[]>('/api/sites');
}

export async function addSite(nom: string, adresse: string): Promise<void> {
  await apiFetch('/api/sites', {
    method: 'POST',
    body: JSON.stringify({ nom, adresse }),
  });
}

export async function deleteSite(id: number): Promise<void> {
  await apiFetch(`/api/sites/${id}`, { method: 'DELETE' });
}
