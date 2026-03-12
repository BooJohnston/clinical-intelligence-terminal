import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const IC = (d: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;

export default function Sidebar() {
  const { user } = useAuth();
  const loc = useLocation();
  const cl = (p: string) => `sidebar-link ${loc.pathname === p ? 'active' : ''}`;
  const isAdmin = user?.role === 'platform-admin' || user?.role === 'institution-admin';

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="6" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/></svg></div>
        <div><div className="sidebar-brand-text">Clinical Intel</div><div className="sidebar-brand-sub">Terminal</div></div>
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-section">Clinical</div>
        <NavLink to="/" className={cl('/')}>{IC('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z')} Dashboard</NavLink>
        <NavLink to="/query" className={cl('/query')}>{IC('M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z')} Query Workspace</NavLink>
        <NavLink to="/pathways" className={cl('/pathways')}>{IC('M22 12h-2.48a2 2 0 00-1.93 1.46l-2.35 8.36a.25.25 0 01-.48 0L9.24 2.18a.25.25 0 00-.48 0l-2.35 8.36A2 2 0 014.49 12H2')} Pathway Explorer</NavLink>
        <NavLink to="/evidence" className={cl('/evidence')}>{IC('M4 7V4a2 2 0 012-2h8.5L20 7.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-3')} Evidence</NavLink>
        <div className="sidebar-section">Analysis</div>
        <NavLink to="/consensus" className={cl('/consensus')}>{IC('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5')} Consensus</NavLink>
        <NavLink to="/timeline" className={cl('/timeline')}>{IC('M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2')} Timeline</NavLink>
        <div className="sidebar-section">Institutional</div>
        <NavLink to="/outcomes" className={cl('/outcomes')}>{IC('M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75')} Outcomes</NavLink>
        <NavLink to="/reports" className={cl('/reports')}>{IC('M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7zM14 2v4a2 2 0 002 2h4')} Reports</NavLink>
        <NavLink to="/fhir" className={cl('/fhir')}>{IC('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z')} FHIR Context</NavLink>
        {isAdmin && <>
          <div className="sidebar-section">System</div>
          <NavLink to="/admin" className={cl('/admin')}>{IC('M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2zM12 15a3 3 0 100-6 3 3 0 000 6z')} Admin</NavLink>
        </>}
      </div>
      <div className="sidebar-footer">Demo Mode • v1.0.0 • {user?.role}</div>
    </nav>
  );
}
