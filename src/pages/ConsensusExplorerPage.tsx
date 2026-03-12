import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { EVIDENCE } from '../data/evidence';
import { computeConsensus, getStrengthColor } from '../services/clinicalServices';

const TOPICS = [
  { label:'Post-MI / ACS', tags:['post-MI','ACS','DAPT','secondary-prevention','beta-blocker'] },
  { label:'Heart Failure GDMT', tags:['heart-failure','HFrEF','SGLT2i','ARNI'] },
  { label:'HBOT Radiation Injury', tags:['HBOT','radiation'] },
  { label:'Stroke Prevention', tags:['stroke','anticoagulation','DOAC','blood-pressure'] },
  { label:'Smoking Cessation', tags:['smoking-cessation'] },
];

export default function ConsensusExplorerPage() {
  const [sel, setSel] = useState(0);
  const topic = TOPICS[sel];
  const ev = EVIDENCE.filter(e => topic.tags.some(t => e.topicTags.some(et => et.toLowerCase().includes(t.toLowerCase()))));
  const cons = computeConsensus(ev);
  const sentData = [{ name:'Pos', value:cons.positiveCount, color:'#00D4AA' },{ name:'Neu', value:cons.neutralCount, color:'#F5B731' },{ name:'Neg', value:cons.negativeCount, color:'#FF4D6A' }];
  const yearData = Object.entries(ev.reduce<Record<number,number>>((a,e)=>{a[e.year]=(a[e.year]||0)+1;return a},{})).map(([y,c])=>({year:+y,count:c})).sort((a,b)=>a.year-b.year);

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Consensus Explorer</div><div className="page-subtitle">Topic-level consensus analysis</div></div></div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>{TOPICS.map((t,i)=><button key={i} className={`btn ${i===sel?'btn-primary':'btn-secondary'}`} onClick={()=>setSel(i)}>{t.label}</button>)}</div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-accent-top"/>
        <div className="card-title" style={{marginBottom:16}}>Consensus: {topic.label}</div>
        <div className="grid-4" style={{marginBottom:16}}>
          <div style={{textAlign:'center'}}><div className="stat-value">{cons.totalStudies}</div><div className="stat-label">Studies</div></div>
          <div style={{textAlign:'center'}}><div className="stat-value" style={{color:'var(--positive)'}}>{cons.positivePercent}%</div><div className="stat-label">Positive</div></div>
          <div style={{textAlign:'center'}}><div className="stat-value" style={{color:'var(--accent-2)'}}>{cons.weightedConfidence.toFixed(2)}</div><div className="stat-label">Confidence</div></div>
          <div style={{textAlign:'center'}}><div className="stat-value" style={{color:cons.contradictionIndex==='high'?'var(--negative)':cons.contradictionIndex==='medium'?'var(--warning)':'var(--positive)'}}>{cons.contradictionIndex.toUpperCase()}</div><div className="stat-label">Contradictions</div></div>
        </div>
        <div style={{padding:'12px 16px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)',fontSize:'.88rem',color:'var(--text-0)',lineHeight:1.6}}>{cons.conclusion}</div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Direction</div>
          <div style={{display:'flex',alignItems:'center'}}><ResponsiveContainer width="50%" height={160}><PieChart><Pie data={sentData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58} strokeWidth={0}>{sentData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer>
          <div>{sentData.map(d=>(<div key={d.name} style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}><div style={{width:7,height:7,borderRadius:2,background:d.color}}/><span style={{fontSize:'.78rem',color:'var(--text-1)'}}>{d.name}: {d.value}</span></div>))}</div></div>
        </div>
        <div className="card"><div className="card-title" style={{marginBottom:12}}>Publication Timeline</div>
          <ResponsiveContainer width="100%" height={160}><BarChart data={yearData} barSize={18}><XAxis dataKey="year" tick={{fill:'#8492A8',fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8492A8',fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/><Tooltip contentStyle={{background:'#152038',border:'1px solid #253A5E',borderRadius:8,fontSize:11}}/><Bar dataKey="count" fill="var(--accent-2)" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
        </div>
      </div>
      {cons.researchGaps.length>0 && <div className="card mt-md" style={{borderColor:'rgba(245,183,49,.2)'}}><div className="card-title" style={{color:'var(--warning)',marginBottom:10}}>Research Gaps</div>{cons.researchGaps.map((g,i)=><div key={i} style={{fontSize:'.82rem',color:'var(--text-1)',padding:'5px 0'}}>{g}</div>)}</div>}
      {cons.contradictions.length>0 && <div className="card mt-md" style={{borderColor:'rgba(255,77,106,.2)'}}><div className="card-title" style={{color:'var(--negative)',marginBottom:10}}>Contradictions</div>{cons.contradictions.map(c=><div key={c.id} style={{padding:10,background:'var(--bg-2)',borderRadius:'var(--radius-sm)',marginBottom:8}}><div style={{fontSize:'.78rem',color:'var(--positive)',marginBottom:3}}>Supporting: {c.supporting}</div><div style={{fontSize:'.78rem',color:'var(--negative)',marginBottom:3}}>Opposing: {c.opposing}</div><div style={{fontSize:'.72rem',color:'var(--text-3)'}}>Likely cause: {c.cause}</div></div>)}</div>}
    </div>
  );
}
