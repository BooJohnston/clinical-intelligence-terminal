import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const NAMES: Record<string, string> = { '/':'Dashboard', '/query':'Query Workspace', '/pathways':'Pathway Explorer', '/evidence':'Evidence', '/consensus':'Consensus', '/timeline':'Timeline', '/outcomes':'Outcomes', '/reports':'Reports', '/fhir':'FHIR Context', '/admin':'Admin' };
export default function TopBar() {
  const { user, registeredUser, logout } = useAuth();
  const p = useLocation().pathname;
  return (
    <header className="topbar">
      <div className="topbar-left"><div className="topbar-crumb"><span>CIT</span> / {NAMES[p]||'Page'}</div></div>
      <div className="topbar-right">
        {registeredUser?.title && <span style={{fontSize:'.7rem',color:'var(--text-3)',marginRight:4}}>{registeredUser.title} • {registeredUser.facility_type}</span>}
        <button className="topbar-user" onClick={logout}>
          <div className="topbar-avatar">{user?.name.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
          {user?.name}
        </button>
      </div>
    </header>
  );
}
