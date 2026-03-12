import { useState } from 'react';
import { PATHWAYS } from '../data/pathways';
import { getStrengthColor } from '../services/clinicalServices';

const typeIcons: Record<string, string> = { recommendation:'💊', monitoring:'📊', followup:'📋', education:'📖', redflag:'🚨', contraindication:'⚠️', discharge:'🏠', escalation:'🔺' };

export default function PathwayExplorerPage() {
  const [selected, setSelected] = useState(0);
  const pw = PATHWAYS[selected];

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Pathway Explorer</div><div className="page-subtitle">Browse guideline-linked clinical pathways</div></div></div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {PATHWAYS.map((p,i) => <button key={p.id} className={`btn ${i===selected?'btn-primary':'btn-secondary'}`} onClick={()=>setSelected(i)}>{p.condition}</button>)}
      </div>
      <div className="grid-2">
        <div>
          <div className="card">
            <div className="card-accent-top"/>
            <div className="card-title" style={{marginBottom:6}}>{pw.condition}</div>
            <div style={{fontSize:'.88rem',color:'var(--text-0)',marginBottom:12}}>{pw.scenario}</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
              <span className="badge badge-source">{pw.specialty}</span>
              <span className="badge badge-guideline">v{pw.version}</span>
              <span style={{fontSize:'.7rem',color:'var(--text-3)'}}>Updated {pw.lastUpdated}</span>
            </div>
            <div className="card-title" style={{marginBottom:8}}>Guideline Sources</div>
            {pw.guidelineSources.map((gs,i)=><div key={i} style={{fontSize:'.8rem',color:'var(--text-1)',padding:'4px 0',borderBottom:'1px solid var(--border-1)'}}>{gs.name} ({gs.year})</div>)}
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title" style={{marginBottom:12}}>Pathway Nodes ({pw.nodes.length})</div>
            {pw.nodes.map(n => (
              <div key={n.id} style={{padding:'10px 12px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)',marginBottom:8,borderLeft:`3px solid ${n.type==='redflag'?'var(--negative)':n.type==='contraindication'?'var(--warning)':'var(--accent)'}`}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                  <span>{typeIcons[n.type]||'📄'}</span>
                  <span style={{fontSize:'.85rem',fontWeight:600,color:'var(--text-0)'}}>{n.title}</span>
                  <span className="badge" style={{marginLeft:'auto',background:`${getStrengthColor(n.certainty)}20`,color:getStrengthColor(n.certainty),fontSize:'.6rem'}}>{n.evidenceLevel}</span>
                </div>
                <div style={{fontSize:'.8rem',color:'var(--text-2)',lineHeight:1.5}}>{n.description}</div>
                <div style={{display:'flex',gap:4,marginTop:6}}>{n.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
