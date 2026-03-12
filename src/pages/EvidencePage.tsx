import { useState } from 'react';
import { EVIDENCE } from '../data/evidence';
import { getStrengthColor } from '../services/clinicalServices';
import type { NormalizedRecord } from '../types';

type SortKey = 'evidenceScore' | 'year' | 'citationCount';

export default function EvidencePage() {
  const [sort, setSort] = useState<SortKey>('evidenceScore');
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const ev = (EVIDENCE as NormalizedRecord[])
    .filter(e => !filter || `${e.title} ${e.topicTags.join(' ')} ${e.intervention || ''}`.toLowerCase().includes(filter.toLowerCase()))
    .filter(e => !typeFilter || e.studyType === typeFilter)
    .sort((a, b) => sort === 'year' ? b.year - a.year : sort === 'citationCount' ? b.citationCount - a.citationCount : b.evidenceScore - a.evidenceScore);

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Evidence Database</div><div className="page-subtitle">Browse and filter the evidence base ({EVIDENCE.length} records)</div></div></div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <input style={{flex:1,minWidth:200}} placeholder="Search evidence..." value={filter} onChange={e=>setFilter(e.target.value)} />
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{fontSize:'.82rem',padding:'6px 10px'}}>
            <option value="">All Types</option>
            <option value="meta-analysis">Meta-Analysis</option><option value="systematic-review">Systematic Review</option>
            <option value="rct">RCT</option><option value="cohort">Cohort</option><option value="case-control">Case-Control</option>
          </select>
          {(['evidenceScore','year','citationCount'] as SortKey[]).map(k=>(
            <button key={k} className={`btn btn-sm ${sort===k?'btn-secondary':'btn-ghost'}`} onClick={()=>setSort(k)} style={{fontSize:'.7rem'}}>
              {k==='evidenceScore'?'Strength':k==='citationCount'?'Citations':'Year'}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        {ev.map(e => (
          <div key={e.id} style={{padding:'10px 0',borderBottom:'1px solid var(--border-1)',cursor:'pointer'}} onClick={()=>setExpanded(expanded===e.id?null:e.id)}>
            <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
              <div style={{width:4,minHeight:36,borderRadius:2,background:getStrengthColor(e.evidenceStrength),flexShrink:0,marginTop:2}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'.88rem',fontWeight:500,color:'var(--text-0)',lineHeight:1.35}}>{e.title}</div>
                <div style={{display:'flex',gap:5,marginTop:5,flexWrap:'wrap',alignItems:'center'}}>
                  <span className="badge badge-source">{e.source}</span>
                  <span className={`badge ${e.resultDirection==='positive'?'badge-positive':e.resultDirection==='negative'?'badge-negative':'badge-neutral'}`}>{e.resultDirection}</span>
                  <span className="tag">{e.studyType}</span>
                  <span style={{fontSize:'.72rem',color:'var(--text-3)'}}>{e.journal}, {e.year}</span>
                  {e.sampleSize && <span style={{fontSize:'.72rem',color:'var(--text-3)'}}>n={e.sampleSize.toLocaleString()}</span>}
                  <span style={{fontSize:'.72rem',color:'var(--text-3)'}}>Cited: {e.citationCount.toLocaleString()}</span>
                  <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',fontWeight:700,color:getStrengthColor(e.evidenceStrength)}}>{e.evidenceScore}</span>
                </div>
                {expanded===e.id && (
                  <div style={{marginTop:8,padding:'10px 12px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)'}}>
                    <div style={{fontSize:'.82rem',color:'var(--text-1)',lineHeight:1.5,marginBottom:8}}>{e.abstract}</div>
                    <div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:'.72rem',color:'var(--text-3)'}}>
                      {e.authors.length>0 && <span><strong>Authors:</strong> {e.authors.join(', ')}</span>}
                      {e.doi && <span><strong>DOI:</strong> {e.doi}</span>}
                      {e.intervention && <span><strong>Intervention:</strong> {e.intervention}</span>}
                      {e.population && <span><strong>Population:</strong> {e.population}</span>}
                      <span><strong>Retrieved:</strong> {new Date(e.retrievalDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {ev.length===0 && <div className="empty-state" style={{padding:30}}>No evidence matches current filters.</div>}
      </div>
    </div>
  );
}
