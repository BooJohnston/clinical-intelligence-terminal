import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <div className="empty-state" style={{minHeight:'60vh'}}><div style={{fontFamily:'var(--mono)',fontSize:'3rem',color:'var(--text-3)',marginBottom:12}}>404</div><div style={{fontSize:'1.1rem',color:'var(--text-2)',marginBottom:20}}>Page not found</div><Link to="/" className="btn btn-primary">Return to Dashboard</Link></div>;
}
