import { useState } from 'react';
import { EVIDENCE } from '../data/evidence';
import { OUTCOMES, AUDIT_LOG } from '../data/demoData';

export default function AdminPage() {
  const [disclaimer, setDisclaimer] = useState('For clinical reference, evidence review, and care-planning support only. Not a substitute for clinician judgment.');
  return (
    <div>
      <div className="page-header"><div><div className="page-title">Admin Console</div><div className="page-subtitle">Platform configuration and system management</div></div><span className="badge badge-neutral">Admin Only</span></div>
      <div className="grid-2">
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Disclaimer</div><div className="form-group"><label className="form-label">Banner Text</label><textarea className="form-input-full" value={disclaimer} onChange={e=>setDisclaimer(e.target.value)} style={{minHeight:50}}/></div><button className="btn btn-primary btn-sm">Save</button></div>
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Platform Stats</div><div className="grid-2"><div><div className="stat-value">{EVIDENCE.length}</div><div className="stat-label">Evidence Records</div></div><div><div className="stat-value">{OUTCOMES.length}</div><div className="stat-label">Outcomes</div></div><div><div className="stat-value">{AUDIT_LOG.length}</div><div className="stat-label">Audit Events</div></div><div><div className="stat-value" style={{color:'var(--warning)'}}>DEMO</div><div className="stat-label">Mode</div></div></div></div>
      </div>
      <div className="card mt-md"><div className="card-title" style={{marginBottom:12}}>Audit Log</div><table><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{AUDIT_LOG.map(e=><tr key={e.id}><td style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--text-3)'}}>{new Date(e.timestamp).toLocaleString()}</td><td>{e.userId}</td><td><span className="tag">{e.action}</span></td><td style={{fontSize:'.78rem',color:'var(--text-2)'}}>{e.details}</td></tr>)}</tbody></table></div>
      <div className="card mt-md"><div className="card-title" style={{marginBottom:12}}>Feature Flags</div>
        {['AI Synthesis','Outcome Reporting','FHIR Integration','Live API Adapters','Pathway Explorer','CDS Hooks'].map((f,i) => (
          <div key={f} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border-1)'}}>
            <span style={{fontSize:'.85rem',color:'var(--text-1)'}}>{f}</span>
            <div style={{width:32,height:18,borderRadius:9,background:i<3?'var(--accent)':'var(--border-2)',position:'relative',cursor:'pointer'}}><div style={{width:14,height:14,borderRadius:'50%',background:'white',position:'absolute',top:2,left:i<3?16:2,transition:'left .2s'}}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}
