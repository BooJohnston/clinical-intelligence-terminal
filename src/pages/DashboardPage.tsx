import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { EVIDENCE } from '../data/evidence';
import { WATCHLISTS, QUERIES, OUTCOMES } from '../data/demoData';

const strengthDist = ['very-high','high','moderate','low','very-low'].map(c => ({ name: c.replace('-',' '), count: EVIDENCE.filter(e => e.evidenceStrength === c).length, color: {'very-high':'#00D4AA','high':'#3B9EFF','moderate':'#F5B731','low':'#FF7A45','very-low':'#FF4D6A'}[c]! }));
const sentimentData = [{ name:'Positive', value:EVIDENCE.filter(e=>e.resultDirection==='positive').length, color:'#00D4AA' },{ name:'Neutral', value:EVIDENCE.filter(e=>e.resultDirection==='neutral').length, color:'#F5B731' },{ name:'Negative', value:EVIDENCE.filter(e=>e.resultDirection==='negative').length, color:'#FF4D6A' }];
const unread = WATCHLISTS.reduce((s,w)=>s+w.alerts.filter(a=>!a.read).length,0);

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <div className="page-header"><div><div className="page-title">Dashboard</div><div className="page-subtitle">Welcome, {user?.name}</div></div><span className="badge badge-positive" style={{padding:'4px 10px',fontSize:'.75rem'}}>Demo Mode</span></div>
      <div className="grid-4 fade-in">
        <div className="card card-sm"><div className="stat-value">{EVIDENCE.length}</div><div className="stat-label">Evidence Records</div></div>
        <div className="card card-sm"><div className="stat-value">{QUERIES.length}</div><div className="stat-label">Saved Queries</div></div>
        <div className="card card-sm"><div className="stat-value">{OUTCOMES.length}</div><div className="stat-label">Outcomes</div></div>
        <div className="card card-sm"><div className="stat-value" style={{color:unread>0?'var(--warning)':undefined}}>{unread}</div><div className="stat-label">Alerts</div></div>
      </div>
      <div className="grid-2 mt-md fade-in">
        <div className="card"><div className="card-title" style={{marginBottom:14}}>Evidence Strength Distribution</div>
          <ResponsiveContainer width="100%" height={190}><BarChart data={strengthDist} barSize={24}><XAxis dataKey="name" tick={{fill:'#8492A8',fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8492A8',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#152038',border:'1px solid #253A5E',borderRadius:8,fontSize:11}}/><Bar dataKey="count" radius={[4,4,0,0]}>{strengthDist.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer>
        </div>
        <div className="card"><div className="card-title" style={{marginBottom:14}}>Finding Direction</div>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <ResponsiveContainer width="50%" height={170}><PieChart><Pie data={sentimentData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={62} strokeWidth={0}>{sentimentData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer>
            <div>{sentimentData.map(d=>(<div key={d.name} style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}><div style={{width:8,height:8,borderRadius:2,background:d.color}}/><span style={{fontSize:'.8rem',color:'var(--text-1)',flex:1}}>{d.name}</span><span style={{fontFamily:'var(--mono)',fontWeight:600,color:'var(--text-0)'}}>{d.value}</span></div>))}</div>
          </div>
        </div>
      </div>
      <div className="grid-2 mt-md fade-in">
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Recent Queries</div>
          {QUERIES.slice(0,4).map(q=>(<div key={q.id} style={{padding:'8px 0',borderBottom:'1px solid var(--border-1)'}}><div style={{fontSize:'.82rem',color:'var(--text-0)',lineHeight:1.4}}>{q.starred && <span style={{color:'var(--warning)',marginRight:5}}>★</span>}{q.scenario}</div><div style={{fontSize:'.68rem',color:'var(--text-3)',marginTop:2}}>{new Date(q.timestamp).toLocaleDateString()} • {q.resultCount} results</div></div>))}
        </div>
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Watchlist Alerts</div>
          {WATCHLISTS.flatMap(w=>w.alerts).filter(a=>!a.read).slice(0,4).map(a=>(<div key={a.id} style={{padding:'8px 0',borderBottom:'1px solid var(--border-1)'}}><span className={`badge ${a.type==='contradiction'?'badge-negative':a.type==='new-evidence'?'badge-positive':'badge-neutral'}`}>{a.type.replace(/-/g,' ')}</span><div style={{fontSize:'.8rem',color:'var(--text-1)',marginTop:4,lineHeight:1.4}}>{a.message}</div></div>))}
          {unread===0 && <div className="empty-state" style={{padding:20}}><div style={{fontSize:'.82rem'}}>No unread alerts</div></div>}
        </div>
      </div>
    </div>
  );
}
