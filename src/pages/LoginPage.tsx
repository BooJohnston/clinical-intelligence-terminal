import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'clinician', label: 'Clinician' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'care-manager', label: 'Care Manager' },
  { value: 'institution-admin', label: 'Institution Admin' },
  { value: 'platform-admin', label: 'Platform Admin' },
];

const FACILITY_TYPES = ['Academic Medical Center', 'Community Hospital', 'Private Practice', 'VA Medical Center', 'Research Institute', 'Outpatient Clinic', 'Long-Term Care', 'Other'];

export default function LoginPage() {
  const { login, register, demoLogin, loading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'demo'>('login');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ name: '', title: '', facility_type: 'Academic Medical Center', email: '', role: 'clinician' as UserRole });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await login(email.trim().toLowerCase());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.email.trim()) return;
    await register({ ...form, email: form.email.trim().toLowerCase() });
  };

  return (
    <div className="login-page">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 70%)', top: -150, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,158,255,0.04) 0%, transparent 70%)', bottom: -100, left: -50 }} />
      </div>

      <div className="login-card" style={{ width: mode === 'register' ? 460 : 420 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bg-0)" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="6" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="15" width="7" height="6" rx="1" /></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-0)' }}>Clinical Intelligence Terminal</div>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '.8rem', marginBottom: 20, lineHeight: 1.5 }}>
          Multi-database clinical evidence support platform.
        </p>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-2)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
          {[{ key: 'login' as const, label: 'Sign In' }, { key: 'register' as const, label: 'Register' }, { key: 'demo' as const, label: 'Demo' }].map(tab => (
            <button key={tab.key} onClick={() => setMode(tab.key)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)', fontSize: '.82rem', fontWeight: 600,
                background: mode === tab.key ? 'var(--accent-dim)' : 'transparent',
                color: mode === tab.key ? 'var(--accent)' : 'var(--text-3)',
                border: mode === tab.key ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                transition: 'all .15s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: '8px 12px', background: 'rgba(255,77,106,.08)', border: '1px solid rgba(255,77,106,.15)', borderRadius: 'var(--radius-sm)', marginBottom: 14, fontSize: '.78rem', color: 'var(--negative)' }}>
            {error}
          </div>
        )}

        {/* LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input-full" type="email" placeholder="your.email@institution.org" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p style={{ marginTop: 12, fontSize: '.72rem', color: 'var(--text-3)', textAlign: 'center' }}>
              Don't have an account? <button type="button" onClick={() => setMode('register')} style={{ color: 'var(--accent)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.72rem' }}>Register here</button>
            </p>
          </form>
        )}

        {/* REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input-full" placeholder="Dr. Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Professional Title</label>
              <input className="form-input-full" placeholder="Attending Physician, Research Director, etc." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Facility Type</label>
                <select className="form-input-full" value={form.facility_type} onChange={e => setForm({ ...form, facility_type: e.target.value })}>
                  {FACILITY_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input-full" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input-full" type="email" placeholder="your.email@institution.org" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p style={{ marginTop: 10, fontSize: '.68rem', color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.5 }}>
              By registering you acknowledge this platform is for clinical reference and evidence review only.
            </p>
          </form>
        )}

        {/* DEMO */}
        {mode === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: '.78rem', color: 'var(--text-2)', marginBottom: 8 }}>Quick access with a demo role — no registration needed.</p>
            {ROLES.map(r => (
              <button key={r.value} onClick={() => demoLogin(r.value)}
                style={{ padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 'var(--radius)', textAlign: 'left', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--accent)'; (e.currentTarget).style.background = 'var(--accent-dim)'; }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border-1)'; (e.currentTarget).style.background = 'var(--bg-2)'; }}>
                <div style={{ fontWeight: 600, color: 'var(--text-0)', fontSize: '.88rem' }}>{r.label}</div>
              </button>
            ))}
          </div>
        )}

        <p style={{ marginTop: 16, fontSize: '.65rem', color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.5 }}>
          For clinical reference, evidence review, and care-planning support only.<br />Not a substitute for clinician judgment.
        </p>
      </div>
    </div>
  );
}
