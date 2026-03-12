import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { registerUser, loginUser, getStoredAuth, storeAuth, clearAuth, type RegisteredUser } from '../services/supabaseService';

interface AuthCtx {
  user: User | null;
  registeredUser: RegisteredUser | null;
  loading: boolean;
  error: string;
  login: (email: string) => Promise<boolean>;
  register: (data: { name: string; title: string; facility_type: string; email: string; role: UserRole }) => Promise<boolean>;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null, registeredUser: null, loading: false, error: '',
  login: async () => false, register: async () => false, demoLogin: () => {}, logout: () => {},
});

const DEMO_USERS: Record<string, { name: string; title: string; facility: string }> = {
  'clinician': { name: 'Dr. Sarah Chen', title: 'Attending Physician', facility: 'Academic Medical Center' },
  'researcher': { name: 'Dr. James Mitchell', title: 'Research Director', facility: 'Research Institute' },
  'care-manager': { name: 'Maria Rodriguez, RN', title: 'Care Manager', facility: 'Medical Center' },
  'institution-admin': { name: 'Admin User', title: 'System Administrator', facility: 'Medical Center' },
  'platform-admin': { name: 'Platform Admin', title: 'Platform Administrator', facility: 'CIT Platform' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [user, setUser] = useState<User | null>(stored?.user || null);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(stored?.registered || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true); setError('');
    try {
      const found = await loginUser(email);
      if (!found) { setError('No account found with that email. Please register first.'); setLoading(false); return false; }
      const u: User = { id: found.id || email, email: found.email, name: found.name, role: found.role || 'clinician', institution: found.facility_type };
      storeAuth(u, found);
      setUser(u);
      setRegisteredUser(found);
      setLoading(false);
      return true;
    } catch (e) { setError('Login failed. Please try again.'); setLoading(false); return false; }
  }, []);

  const register = useCallback(async (data: { name: string; title: string; facility_type: string; email: string; role: UserRole }): Promise<boolean> => {
    setLoading(true); setError('');
    try {
      const reg = await registerUser(data);
      if (!reg) { setError('Registration failed. Please try again.'); setLoading(false); return false; }
      const u: User = { id: reg.id || data.email, email: data.email, name: data.name, role: data.role, institution: data.facility_type };
      storeAuth(u, reg);
      setUser(u);
      setRegisteredUser(reg);
      setLoading(false);
      return true;
    } catch (e) { setError('Registration failed. Please try again.'); setLoading(false); return false; }
  }, []);

  const demoLogin = useCallback((role: UserRole) => {
    const d = DEMO_USERS[role] || DEMO_USERS['clinician'];
    const u: User = { id: `demo-${role}`, email: `${role}@cit.demo`, name: d.name, role, institution: d.facility };
    const reg: RegisteredUser = { id: `demo-${role}`, name: d.name, title: d.title, facility_type: d.facility, email: u.email, role };
    storeAuth(u, reg);
    setUser(u);
    setRegisteredUser(reg);
  }, []);

  const logout = useCallback(() => { clearAuth(); setUser(null); setRegisteredUser(null); setError(''); }, []);

  return (
    <AuthContext.Provider value={{ user, registeredUser, loading, error, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
