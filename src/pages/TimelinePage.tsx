const events = [
  { year:2001, title:'PROGRESS Trial', desc:'BP lowering reduces recurrent stroke by 28%.', type:'landmark' },
  { year:2009, title:'PLATO Trial', desc:'Ticagrelor superior to clopidogrel in ACS for MACE reduction.', type:'inflection' },
  { year:2011, title:'ARISTOTLE Trial', desc:'Apixaban superior to warfarin for stroke prevention in AF.', type:'landmark' },
  { year:2014, title:'PARADIGM-HF', desc:'Sacubitril/valsartan reduces CV death and HF hospitalization by 20% vs enalapril.', type:'landmark' },
  { year:2015, title:'SPRINT Trial', desc:'Intensive BP target (<120) reduces MACE by 25%.', type:'inflection' },
  { year:2016, title:'Cochrane HBOT Review', desc:'HBOT benefits confirmed for radiation proctitis and soft tissue radionecrosis.', type:'landmark' },
  { year:2016, title:'LEADER Trial', desc:'Liraglutide demonstrates CV mortality reduction in T2D.', type:'inflection' },
  { year:2019, title:'DAPA-HF Trial', desc:'SGLT2i benefit in HFrEF regardless of diabetes — paradigm shift.', type:'landmark' },
  { year:2021, title:'DAHANCA-21 Negative', desc:'HBOT shows no benefit for mandibular ORN — contradicts prior data.', type:'contradiction' },
  { year:2023, title:'SELECT Trial', desc:'Semaglutide reduces MACE by 20% in non-diabetic obesity with CVD.', type:'landmark' },
  { year:2024, title:'ABYSS Trial', desc:'Beta-blocker discontinuation non-inferior in preserved EF post-MI.', type:'inflection' },
];
const colors: Record<string,string> = { landmark:'#00D4AA', inflection:'#3B9EFF', contradiction:'#FF4D6A' };

export default function TimelinePage() {
  return (
    <div>
      <div className="page-header"><div><div className="page-title">Evidence Timeline</div><div className="page-subtitle">Major evidence milestones across tracked topics</div></div></div>
      <div style={{display:'flex',gap:10,marginBottom:20}}>{Object.entries(colors).map(([k,v])=><div key={k} style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:2,background:v}}/><span style={{fontSize:'.72rem',color:'var(--text-2)',textTransform:'capitalize'}}>{k}</span></div>)}</div>
      <div style={{position:'relative',paddingLeft:36}}>
        <div style={{position:'absolute',left:13,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,var(--accent),var(--accent-2),var(--border-1))'}}/>
        {events.map((ev,i) => (
          <div key={i} className="fade-in" style={{position:'relative',marginBottom:16,animationDelay:`${i*0.03}s`}}>
            <div style={{position:'absolute',left:-29,top:12,width:12,height:12,borderRadius:'50%',background:colors[ev.type]||'var(--accent)',border:'3px solid var(--bg-0)',boxShadow:`0 0 10px ${colors[ev.type]}40`}}/>
            <div className="card card-sm" style={{borderLeft:`3px solid ${colors[ev.type]||'var(--accent)'}`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <span style={{fontFamily:'var(--mono)',fontSize:'.85rem',fontWeight:700,color:'var(--text-0)'}}>{ev.year}</span>
                <span className="badge" style={{background:`${colors[ev.type]}20`,color:colors[ev.type]}}>{ev.type}</span>
              </div>
              <div style={{fontSize:'.9rem',fontWeight:600,color:'var(--text-0)',marginBottom:3}}>{ev.title}</div>
              <div style={{fontSize:'.8rem',color:'var(--text-2)',lineHeight:1.4}}>{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
