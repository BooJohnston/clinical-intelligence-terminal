import type { User, UserRole } from '../types';

// ── RUNTIME CONFIG ───────────────────────────────────────────────────────────
// Reads from window.__CIT_CONFIG (set in public/config.js loaded before the app)
// This allows configuring Supabase AFTER building, perfect for drag-and-drop deploys
function getConfig() {
  const win = (window as any).__CIT_CONFIG || {};
  return {
    url: win.SUPABASE_URL || '',
    key: win.SUPABASE_ANON_KEY || '',
  };
}

function sb() {
  const { url, key } = getConfig();
  if (!url || !key) return null;
  return { url, key };
}

async function req(path: string, options: RequestInit = {}) {
  const s = sb();
  if (!s) return null;
  try {
    const res = await fetch(`${s.url}/rest/v1/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': s.key,
        'Authorization': `Bearer ${s.key}`,
        'Prefer': options.method === 'POST' ? 'return=representation' : '',
        ...options.headers,
      },
    });
    if (!res.ok) { console.warn('Supabase:', res.status); return null; }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (e) { console.warn('Supabase error:', e); return null; }
}

// ── USERS ────────────────────────────────────────────────────────────────────
export interface RegisteredUser {
  id?: string; name: string; title: string; facility_type: string;
  email: string; role: UserRole; created_at?: string;
}

export async function registerUser(user: Omit<RegisteredUser, 'id' | 'created_at'>): Promise<RegisteredUser | null> {
  const data = await req('users', { method: 'POST', body: JSON.stringify({ ...user, created_at: new Date().toISOString() }) });
  if (data?.[0]) return data[0];
  const demo: RegisteredUser = { ...user, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
  sessionStorage.setItem('cit_registered_user', JSON.stringify(demo));
  return demo;
}

export async function loginUser(email: string): Promise<RegisteredUser | null> {
  const data = await req(`users?email=eq.${encodeURIComponent(email)}&limit=1`);
  if (data?.[0]) return data[0];
  const stored = sessionStorage.getItem('cit_registered_user');
  if (stored) { const u = JSON.parse(stored); if (u.email === email) return u; }
  return null;
}

export function getStoredAuth(): { user: User; registered: RegisteredUser } | null {
  try { const s = sessionStorage.getItem('cit_session'); return s ? JSON.parse(s) : null; } catch { return null; }
}
export function storeAuth(user: User, registered: RegisteredUser) { sessionStorage.setItem('cit_session', JSON.stringify({ user, registered })); }
export function clearAuth() { sessionStorage.removeItem('cit_session'); }

// ── SEARCH RESULTS ───────────────────────────────────────────────────────────
export interface StoredSearchResult {
  id?: string; user_email: string; query_text: string; query_intent: string;
  sources_used: string[]; result_count: number; evidence_ids: string[];
  consensus_score: number; contradiction_index: string; brief_summary: string; created_at?: string;
}

export async function saveSearchResult(result: Omit<StoredSearchResult, 'id' | 'created_at'>): Promise<boolean> {
  const data = await req('search_results', {
    method: 'POST',
    body: JSON.stringify({ ...result, sources_used: JSON.stringify(result.sources_used), evidence_ids: JSON.stringify(result.evidence_ids), created_at: new Date().toISOString() }),
  });
  if (data) return true;
  const existing = JSON.parse(localStorage.getItem('cit_search_history') || '[]');
  existing.unshift({ ...result, id: `sr-${Date.now()}`, created_at: new Date().toISOString() });
  if (existing.length > 100) existing.length = 100;
  localStorage.setItem('cit_search_history', JSON.stringify(existing));
  return true;
}

export async function getSearchHistory(email: string, limit = 20): Promise<StoredSearchResult[]> {
  const data = await req(`search_results?user_email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=${limit}`);
  if (data?.length) return data;
  const existing: StoredSearchResult[] = JSON.parse(localStorage.getItem('cit_search_history') || '[]');
  return existing.filter(r => r.user_email === email).slice(0, limit);
}

export function isSupabaseActive(): boolean { return !!sb(); }
