import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { OUTCOMES } from '../data/demoData';

const respColors: Record<string,string> = { 'Complete cessation':'#00D4AA','Good response':'#00D4AA','Partial response':'#3B9EFF','Stable':'#F5B731','Progression':'#FF7A45','Adverse':'#FF4D6A' };
const respDist = Object.entries(OUTCOMES.reduce<Record<string,number>>((a,o)=>{a[o.responseCategory]=(a[o.responseCategory]||0)+1;return a},{})).map(([name,count])=>({name,count,color:respColors[name]||'#3B9EFF'}));

export default function OutcomesPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="page-header"><div><div className="page-title">Outcomes</div><div className="page-subtitle">De-identified real-world evidence capture</div></div><button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>{showForm?'View Analytics':'+ Submit Outcome'}</button></div>
      <div style={{padding:'8px 14px',background:'rgba(255,77,106,.06)',border:'1px solid rgba(255,77,106,.12)',borderRadius:'var(--radius-sm)',marginBottom:16,fontSize:'.75rem',color:'var(--negative)',display:'flex',alignItems:'center',gap:6}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z"/></svg>
        <strong>No PHI.</strong> All submissions must be de-identified. No patient names, DOBs, MRNs, or direct identifiers.
      </div>
      {showForm ? (
        <div className="card"><div className="card-accent-top"/><div className="card-title" style={{marginBottom:14}}>De-Identified Outcome Submission</div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Condition / Topic</label><input className="form-input-full" placeholder="e.g., Post-MI ACS"/></div>
            <div className="form-group"><label className="form-label">Care Scenario</label><input className="form-input-full" placeholder="e.g., Discharge after PCI with DAPT"/></div>
            <div className="form-group"><label className="form-label">Age Bucket</label><select className="form-input-full"><option>18-24</option><option>25-44</option><option>45-54</option><option>55-64</option><option>65-74</option><option>75+</option></select></div>
            <div className="form-group"><label className="form-label">Response Category</label><select className="form-input-full"><option>Good response</option><option>Partial response</option><option>Stable</option><option>Progression</option><option>Adverse</option><option>Complete cessation</option></select></div>
            <div className="form-group"><label className="form-label">Intervention Category</label><input className="form-input-full" placeholder="e.g., GDMT initiation"/></div>
            <div className="form-group"><label className="form-label">Follow-Up Duration</label><input className="form-input-full" placeholder="e.g., 12 months"/></div>
          </div>
          <div className="form-group"><label className="form-label">Notes (No PHI)</label><textarea className="form-input-full" placeholder="Describe outcomes without patient identifiers..."/></div>
          <div style={{display:'flex',gap:8}}><button className="btn btn-primary">Submit</button><button className="btn btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div>
        </div>
      ) : (
        <>
          <div className="grid-2" style={{marginBottom:16}}>
            <div className="card"><div className="card-title" style={{marginBottom:12}}>Response Distribution</div>
              <ResponsiveContainer width="100%" height={160}><BarChart data={respDist} barSize={24}><XAxis dataKey="name" tick={{fill:'#8492A8',fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8492A8',fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/><Tooltip contentStyle={{background:'#152038',border:'1px solid #253A5E',borderRadius:8,fontSize:11}}/><Bar dataKey="count" radius={[4,4,0,0]}>{respDist.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer>
            </div>
            <div className="card"><div className="card-title" style={{marginBottom:12}}>Summary</div>
              <div className="grid-2"><div><div className="stat-value">{OUTCOMES.length}</div><div className="stat-label">Submissions</div></div><div><div className="stat-value">{(OUTCOMES.reduce((s,o)=>s+o.outcomeScore,0)/OUTCOMES.length).toFixed(1)}</div><div className="stat-label">Avg Score</div></div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{marginBottom:12}}>Recent Submissions</div>
            <table><thead><tr><th>Condition</th><th>Intervention</th><th>Response</th><th>Score</th><th>Date</th></tr></thead><tbody>
              {OUTCOMES.map(o=><tr key={o.id}><td style={{color:'var(--text-0)'}}>{o.condition}</td><td>{o.interventionCategory.substring(0,30)}</td><td><span className="badge" style={{background:`${respColors[o.responseCategory]||'#3B9EFF'}20`,color:respColors[o.responseCategory]||'#3B9EFF'}}>{o.responseCategory}</span></td><td style={{fontFamily:'var(--mono)'}}>{o.outcomeScore}/10</td><td style={{fontSize:'.75rem',color:'var(--text-3)'}}>{new Date(o.submittedAt).toLocaleDateString()}</td></tr>)}
            </tbody></table>
          </div>
        </>
      )}
    </div>
  );
}
