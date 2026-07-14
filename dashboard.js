/* ==========================================================
 UVA MBB Performance Dashboard — Interactive JS recreation
 Faithful port of the production Streamlit/Snowflake app,
 running fully client-side on FABRICATED dummy data.
 No proprietary data is present anywhere in this file.
 ========================================================== */

/* ---------------- Token weights ---------------- */
const ORIGINAL_WEIGHTS = {
 "2FG MAKE":4,"2FG MISS":-2,"3FG MAKE":6,"3FG MISS":-2,"SFD":3,"NSFD":2,"FT MAKE":2,"FT MISS":-2,
 "AO":4,"HAO":3,"PT":2,"DTO":-5,"LTO":-7,
 "GST":2,"NST":-3,"FW":2,"NFW":-3,"P5":2,"SCOE":-3,"JPS":2,"JPD":-3,"GSP":3,"EE":-3,"SAS":2,"SPE":-3,
 "PC":-3,"BB":-3,"TPA":-4,"F":-3,"HCPE":-2,"TDE":-4,"BSCE":-3,"SE":-3,"GS":-2,"RE":-2,
 "GG":2,"GW":4,"GR":3,"BLK":4,"STL":6,"DF":3,
 "OR":4,"DR":3,"OT":1,"BO":2,"MBO":-3,"FLY":2,"LO":-3,"GC":2,"BC":-3,"GN":2,"BN":-3,
 "Charge":4,"CG":4,"N1TF":-5,"SV":2
};
const EPA_WEIGHTS = {
 "2FG MAKE":4.0,"2FG MISS":-2.0,"3FG MAKE":6.0,"3FG MISS":-2.0,"SFD":1.7,"NSFD":1.2,"FT MAKE":2.0,"FT MISS":-1.0,
 "AO":1.6,"HAO":1.0,"PT":1.4,"DTO":-3.6,"LTO":-6.4,
 "GST":1.6,"NST":-1.6,"FW":1.8,"NFW":-1.8,"P5":1.4,"SCOE":-1.4,"JPS":1.2,"JPD":-1.2,"GSP":2.0,"EE":-2.0,"SAS":2.0,"SPE":-2.0,
 "PC":-1.8,"BB":-4.6,"TPA":-2.3,"F":-3.2,"HCPE":-1.2,"TDE":-2.4,"BSCE":-1.8,"SE":-1.8,"GS":-1.2,"RE":-1.8,
 "GG":1.2,"GW":2.2,"GR":1.8,"BLK":3.0,"STL":4.4,"DF":1.4,
 "OR":1.8,"DR":1.6,"OT":1.0,"BO":1.0,"MBO":-2.4,"FLY":1.0,"LO":-1.2,"GC":1.0,"BC":-1.4,"GN":1.0,"BN":-1.0,
 "Charge":4.6,"CG":1.4,"N1TF":-1.4,"SV":1.8
};

const TOKEN_TO_COLUMN = {
 "2FG MAKE":"2FG Make","2FG MISS":"2FG Miss","3FG MAKE":"3FG Make","3FG MISS":"3FG Miss",
 "SFD":"Shooting Foul Drawn","NSFD":"Non-Shooting Foul Drawn","FT MAKE":"FT Make","FT MISS":"FT Miss",
 "AO":"Assist Opportunity","HAO":"Hockey Assist Opportunity","PT":"Paint Touch","DTO":"Dead-Ball Turnover","LTO":"Live-Ball Turnover",
 "GST":"Good Stop","NST":"No Stop","FW":"Found Window","NFW":"No Found Window","P5":"P5","SCOE":"No Decision Made",
 "JPS":"Just Passed","JPD":"Just Pass","GSP":"Good Sprint","EE":"Execution Error","SAS":"Screen Assist","SPE":"Spacing Error",
 "PC":"Post Catch Allowed","BB":"Blow By","TPA":"Three Point Allowed","F":"Foul","HCPE":"Half-Court Positioning Error",
 "TDE":"Transition Defensive Error","BSCE":"Ball Screen Coverage Error","SE":"Switch Error","GS":"Got Screened","RE":"Rotation Error",
 "GG":"Good Gap","GW":"Good Wall","GR":"Good Rotation","BLK":"Block","STL":"Steal","DF":"Deflection",
 "OR":"Offensive Rebound","DR":"Defensive Rebound","OT":"Offensive Tip","BO":"Box Out","MBO":"Missed Box Out",
 "FLY":"Fly In","LO":"Leak Out","GC":"Good Crash","BC":"Bad Crash","GN":"Good Nail","BN":"Bad Nail",
 "Charge":"Charge Drawn","CG":"1st to Floor","N1TF":"No 1st to Floor","SV":"Save"
};

const CATEGORY_ORDER = ["Shooting","Ball Handling","Offensive Execution","Defensive Errors","Defensive Execution","Rebound/Transition","Hustle"];
const CATEGORY_MAP = {};
[["Shooting",["2FG MAKE","2FG MISS","3FG MAKE","3FG MISS","SFD","NSFD","FT MAKE","FT MISS"]],
 ["Ball Handling",["AO","HAO","PT","DTO","LTO"]],
 ["Offensive Execution",["GST","NST","FW","NFW","P5","JPD","JPS","GSP","EE","SAS","SPE","SCOE"]],
 ["Defensive Errors",["PC","BB","TPA","F","HCPE","TDE","BSCE","SE","GS","RE"]],
 ["Defensive Execution",["GG","GW","GR","BLK","STL","DF"]],
 ["Rebound/Transition",["OR","DR","OT","BO","MBO","FLY","LO","GC","BC","GN","BN"]],
 ["Hustle",["Charge","CG","N1TF","SV"]]
].forEach(([c,arr])=>arr.forEach(t=>CATEGORY_MAP[t]=c));

const OFFENSIVE_TOKENS = ["2FG MAKE","2FG MISS","3FG MAKE","3FG MISS","SFD","NSFD","FT MAKE","FT MISS","AO","HAO","PT","DTO","LTO","GST","NST","FW","NFW","P5","JPD","JPS","GSP","EE","SAS","SPE","OR","GC","GN"];
const DEFENSIVE_TOKENS = ["PC","BB","TPA","F","HCPE","TDE","BSCE","SE","GS","RE","SCOE","GG","GW","GR","BLK","STL","DF","DR","BO","FLY","LO","BC","BN","MBO","Charge","CG","N1TF","SV"];

/* ---------------- Dummy roster & timelines (fabricated) ---------------- */
const ROSTER = ["A. Mercer","D. Whitfield","T. Okafor","J. Bramwell","C. Nkemelu","R. Halloran","M. Trevino","S. Boateng","L. Petrov","K. Ashford"];
const TIMELINES = [
 "Game #4 12.13.25 UVA vs. Memphis",
 "Practice #6 12.10.25",
 "Practice #5 12.08.25",
 "Game #3 12.06.25 UVA vs. Dayton",
 "Practice #4 12.02.25",
 "Practice #3 11.26.25",
 "Game #2 11.22.25 UVA vs. Baylor",
 "Practice #2 11.18.25",
 "Practice #1 11.14.25"
];

/* seeded RNG so dummy data is stable across reloads */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* latent per-player skill profiles (deterministic) */
const PROFILES = ROSTER.map((name,i)=>{
 const r = mulberry32(1000+i*97);
 return {name, off:0.25+r()*0.7, def:0.25+r()*0.7, shoot:0.25+r()*0.7, vol:0.6+r()*0.7};
});

/* base per-event rates for non-shooting tokens */
const BASE_RATE = {
 "SFD":0.5,"NSFD":0.6,"AO":1.4,"HAO":0.6,"PT":2.2,"DTO":0.5,"LTO":0.4,
 "GST":1.6,"NST":0.9,"FW":1.2,"NFW":0.7,"P5":1.0,"SCOE":0.6,"JPS":1.3,"JPD":0.7,"GSP":1.1,"EE":0.8,"SAS":0.7,"SPE":0.6,
 "PC":0.5,"BB":0.6,"TPA":0.5,"F":0.7,"HCPE":0.7,"TDE":0.4,"BSCE":0.6,"SE":0.5,"GS":0.7,"RE":0.7,
 "GG":1.8,"GW":0.9,"GR":1.1,"BLK":0.4,"STL":0.4,"DF":0.7,
 "OR":1.0,"DR":2.0,"OT":0.5,"BO":1.4,"MBO":0.5,"FLY":0.7,"LO":0.4,"GC":0.8,"BC":0.4,"GN":0.7,"BN":0.4,
 "Charge":0.2,"CG":0.7,"N1TF":0.4,"SV":0.5
};

/* Build dummy dataset: data[timeline][player] = {counts:{tok:n}, opps:n, shots:{...}} */
const DATA = {};
TIMELINES.forEach((tl,ti)=>{
 const isGame = tl.startsWith("Game");
 const evScale = (isGame?1.25:0.9);
 DATA[tl] = {};
 PROFILES.forEach((p,pi)=>{
 const r = mulberry32((ti+1)*7919 + (pi+1)*104729);
 const counts = {};
 // non-shooting tokens
 Object.keys(BASE_RATE).forEach(tok=>{
 const w = ORIGINAL_WEIGHTS[tok]||0;
 const pos = w>=0;
 const side = OFFENSIVE_TOKENS.includes(tok)?'off':'def';
 const skill = side==='off'?p.off:p.def;
 const factor = pos ? (0.45+skill) : (0.45+(1-skill));
 const lambda = BASE_RATE[tok]*factor*evScale*p.vol;
 const c = Math.max(0, Math.round(lambda*(0.4+1.2*r())));
 if(c>0) counts[tok]=c;
 });
 // shooting
 const att2 = Math.max(0, Math.round((2+p.shoot*5)*evScale*(0.5+r())));
 const mk2 = Math.min(att2, Math.max(0, Math.round(att2*(0.40+0.22*p.shoot+(r()-0.5)*0.12))));
 const att3 = Math.max(0, Math.round((1+p.shoot*4)*evScale*(0.5+r())));
 const mk3 = Math.min(att3, Math.max(0, Math.round(att3*(0.28+0.18*p.shoot+(r()-0.5)*0.10))));
 const attf = Math.max(0, Math.round((p.shoot*3+r()*2)*evScale));
 const mkf = Math.min(attf, Math.max(0, Math.round(attf*(0.62+0.26*p.shoot+(r()-0.5)*0.08))));
 if(att2>0){ counts["2FG MAKE"]=mk2; counts["2FG MISS"]=att2-mk2; }
 if(att3>0){ counts["3FG MAKE"]=mk3; counts["3FG MISS"]=att3-mk3; }
 if(attf>0){ counts["FT MAKE"]=mkf; counts["FT MISS"]=attf-mkf; }
 const opps = Math.round(18 + p.off*18 + p.def*10 + r()*12);
 DATA[tl][p.name] = {counts, opps};
 });
});

/* ---------------- Math helpers ---------------- */
function erf(x){const s=x<0?-1:1;x=Math.abs(x);const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;const t=1/(1+p*x);const y=1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);return s*y;}
function normCdf(z){return 0.5*(1+erf(z/Math.SQRT2));}
function zToIndex(z){const pct=normCdf(z)*100;return 100+(pct-50)*(40/50);}
function mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0;}
function std(a){if(a.length<2)return 0;const m=mean(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)*(v-m),0)/(a.length-1));}
function classifyTier(z){if(z>=2)return"Elite (Top 2%)";if(z>=1.5)return"Excellent (Top 7%)";if(z>=1)return"Above Avg (Top 16%)";if(z>=0.5)return"Good (Top 31%)";if(z>=-0.5)return"Average";if(z>=-1)return"Below Avg";if(z>=-1.5)return"Poor";return"Very Poor";}
function indexColor(s){s=Math.round(s);if(s>=111)return"#66FE01";if(s>=101)return"#55D401";if(s>=100)return"#44AA01";if(s>=90)return"#328100";if(s>=80)return"#215700";return"#102D00";}
function indexTextColor(s){return Math.round(s)>=101?"#000":"#fff";}

/* ---------------- State ---------------- */
const state = { epa:false, selected:[...TIMELINES], player:ROSTER[0], category:"Shooting", p1:ROSTER[0], p2:ROSTER[1] };
function W(){return state.epa?EPA_WEIGHTS:ORIGINAL_WEIGHTS;}

/* aggregate counts over selected timelines */
function aggregate(){
 const counts={}, opps={};
 ROSTER.forEach(pl=>{counts[pl]={};opps[pl]=0;});
 state.selected.forEach(tl=>{
 const d=DATA[tl]; if(!d)return;
 ROSTER.forEach(pl=>{
 const rec=d[pl]; if(!rec)return;
 opps[pl]+=rec.opps;
 for(const t in rec.counts){counts[pl][t]=(counts[pl][t]||0)+rec.counts[t];}
 });
 });
 return {counts,opps};
}

/* ---------------- Score computations ---------------- */
function computeScores(){
 const {counts,opps}=aggregate();
 const w=W();
 const players=ROSTER.map(pl=>{
 const row=counts[pl]||{};
 let off=0,def=0;
 OFFENSIVE_TOKENS.forEach(t=>off+=(row[t]||0)*(w[t]||0));
 DEFENSIVE_TOKENS.forEach(t=>def+=(row[t]||0)*(w[t]||0));
 return {player:pl,off,def,total:off+def,opps:opps[pl]||0};
 });
 const offs=players.map(p=>p.off), defs=players.map(p=>p.def);
 const aO=mean(offs),aD=mean(defs),sO=std(offs)||1,sD=std(defs)||1;
 players.forEach(p=>{
 p.offZ=(p.off-aO)/sO; p.defZ=(p.def-aD)/sD; p.totZ=p.offZ+p.defZ;
 p.offIdx=zToIndex(p.offZ); p.defIdx=zToIndex(p.defZ); p.totIdx=zToIndex(p.totZ);
 p.tier=classifyTier(p.totZ);
 });
 players.sort((a,b)=>b.totIdx-a.totIdx);
 return {players,counts};
}

/* category score per player */
function categoryScores(counts){
 const w=W(); const out={};
 ROSTER.forEach(pl=>{
 const row=counts[pl]||{}; out[pl]={};
 CATEGORY_ORDER.forEach(cat=>{
 let tot=0; const bd=[];
 for(const tok in w){
 if(CATEGORY_MAP[tok]===cat && row[tok]){
 const contrib=Math.round(row[tok]*w[tok]);
 tot+=contrib; bd.push({tok,count:row[tok],contrib});
 }
 }
 out[pl][cat]={score:tot,breakdown:bd};
 });
 });
 return out;
}

/* shooting stats per player */
function shootingStats(counts){
 const out={};
 ROSTER.forEach(pl=>{
 const c=counts[pl]||{};
 const g=(k)=>c[k]||0;
 const fg2m=g("2FG MAKE"),fg2x=g("2FG MISS"),fg3m=g("3FG MAKE"),fg3x=g("3FG MISS"),ftm=g("FT MAKE"),ftx=g("FT MISS");
 const fg2a=fg2m+fg2x, fg3a=fg3m+fg3x, fta=ftm+ftx;
 const makes=fg2m+fg3m, atts=fg2a+fg3a;
 const pts=2*fg2m+3*fg3m+ftm;
 const tsDen=2*(atts+0.44*fta);
 out[pl]={
 fg2m,fg2x,fg3m,fg3x,ftm,ftx,
 fg2p:fg2a?fg2m/fg2a:0, fg3p:fg3a?fg3m/fg3a:0, ftp:fta?ftm/fta:0,
 fgp:atts?makes/atts:0, ts:tsDen?pts/tsDen:0,
 efg:atts?(makes+0.5*fg3m)/atts:0, pps:atts?pts/atts:0,
 pts, atts
 };
 });
 return out;
}

/* ---------------- Renderers ---------------- */
const $=(id)=>document.getElementById(id);

function renderAll(){
 const {players,counts}=computeScores();
 const cats=categoryScores(counts);
 const shots=shootingStats(counts);
 renderTitle();
 renderLeaderboard(players);
 renderPlayerAnalysis(cats);
 renderShooting(shots);
 renderCompare(cats);
 renderWeightUI();
}

function parseDate(tl){
 const m=tl.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
 if(!m)return null; let y=parseInt(m[3]); if(y<100)y+=2000;
 return new Date(y,parseInt(m[1])-1,parseInt(m[2]));
}
function renderTitle(){
 const ds=state.selected.map(parseDate).filter(Boolean).sort((a,b)=>a-b);
 let t="Player Performance Index";
 if(ds.length){const f=d=>`${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
 t = (ds[0].getTime()===ds[ds.length-1].getTime())?`Performance Index for ${f(ds[0])}`:`Performance Index (${f(ds[0])} to ${f(ds[ds.length-1])})`;}
 $("idxTitle").textContent=t;
 $("evtCount").textContent=state.selected.length;
}

function renderLeaderboard(players){
 let h=`<table class="dtable"><thead><tr>
 <th>Rank</th><th class="player">Player</th><th>Opp.</th><th>Offensive</th><th>Defensive</th><th>Overall Index</th></tr></thead><tbody>`;
 players.forEach((p,i)=>{
 const bg=indexColor(p.totIdx), tc=indexTextColor(p.totIdx);
 const me=p.player===state.player?' class="me"':'';
 h+=`<tr${me}><td>${i+1}</td><td class="player">${p.player}</td><td>${p.opps}</td>
 <td>${Math.round(p.offIdx)}</td><td>${Math.round(p.defIdx)}</td>
 <td class="idx-cell" style="background:${bg};color:${tc}">${Math.round(p.totIdx)}</td></tr>`;
 });
 h+="</tbody></table>";
 $("leaderboard").innerHTML=h;
}

function greenPct(pct){
 const stops=[[90,"#66FF01","#000"],[80,"#55D900","#000"],[70,"#4BC600","#000"],[60,"#42B300","#fff"],
 [50,"#38A000","#fff"],[40,"#2F8D00","#fff"],[30,"#257A00","#fff"],[20,"#1C6700","#fff"],[10,"#125400","#fff"],[0,"#094100","#fff"]];
 for(const [th,bg,tc] of stops){if(pct>=th)return[bg,tc];}
 return["#094100","#fff"];
}

function renderPlayerAnalysis(cats){
 // build per-category team arrays
 const teamByCat={};
 CATEGORY_ORDER.forEach(cat=>teamByCat[cat]=ROSTER.map(pl=>cats[pl][cat].score));
 const pl=state.player;
 let rows="";
 let totalScore=0, catCount=0;
 CATEGORY_ORDER.forEach(cat=>{
 const arr=teamByCat[cat]; const mn=Math.min(...arr),mx=Math.max(...arr),av=mean(arr);
 const sc=cats[pl][cat].score; totalScore+=sc; catCount++;
 const norm=(mx!==mn)?((sc-mn)/(mx-mn))*100:50;
 const scaledMax=mx-mn; const pct=scaledMax>0?((sc-mn)/scaledMax)*100:50;
 const [bg,tc]=greenPct(pct);
 const sign=sc>=0?'+':'';
 rows+=`<div class="cat-bar-row">
 <div class="cat-name">${cat}</div>
 <div class="cat-score">${sign}${sc}</div>
 <div>
 <div class="track"><div class="marker" style="left:${Math.max(2,Math.min(98,norm))}%"></div></div>
 <div style="display:flex;justify-content:space-between;font-size:.72rem;color:#7a83a0;margin-top:3px;">
 <span>${mn>=0?'+':''}${mn}</span><span>Avg ${av>=0?'+':''}${av.toFixed(0)}</span><span>${mx>=0?'+':''}${mx}</span></div>
 </div>
 <div class="pct-chip" style="background:${bg};color:${tc}">${pct.toFixed(0)}%</div>
 </div>`;
 });
 $("catBars").innerHTML=rows;
 $("paTotal").textContent=(totalScore>=0?'+':'')+totalScore;
 $("paAvg").textContent=(totalScore/catCount>=0?'+':'')+(totalScore/catCount).toFixed(1);
 $("paPlayerName").textContent=pl;

 // detailed breakdown for selected category
 const cb=cats[pl][state.category];
 let bd=`<div style="display:flex;gap:14px;align-items:center;margin-bottom:12px;">
 <div class="metric" style="min-width:140px;"><div class="m-l">${state.category} Score</div>
 <div class="m-v">${cb.score>=0?'+':''}${cb.score}</div></div></div>`;
 if(cb.breakdown.length){
 bd+=`<table class="dtable"><thead><tr><th class="player">Action</th><th>Count</th><th>Pts Each</th><th>Total</th></tr></thead><tbody>`;
 cb.breakdown.forEach(b=>{
 const per=W()[b.tok]||0;
 const col=b.contrib>0?'rgba(18,183,106,.18)':(b.contrib<0?'rgba(224,49,49,.18)':'transparent');
 bd+=`<tr><td class="player">${TOKEN_TO_COLUMN[b.tok]||b.tok}</td><td>${b.count}</td><td>${per}</td>
 <td style="background:${col};font-weight:700">${b.contrib>=0?'+':''}${b.contrib}</td></tr>`;
 });
 bd+="</tbody></table>";
 } else { bd+=`<p class="hint">No actions recorded for this category.</p>`; }
 $("catBreakdown").innerHTML=bd;
}

function renderShooting(shots){
 const pl=state.player, s=shots[pl];
 const withAtt=ROSTER.filter(p=>shots[p].atts>0);
 const tavg=(f)=>mean(withAtt.map(p=>shots[p][f]));
 // team shot-type pcts
 const tSum=(a,b)=>ROSTER.reduce((x,p)=>x+shots[p][a],0)/(ROSTER.reduce((x,p)=>x+shots[p][a]+shots[p][b],0)||1);
 const t2=tSum("fg2m","fg2x"), t3=tSum("fg3m","fg3x"), tft=tSum("ftm","ftx");

 // stacked bar
 const maxAtt=Math.max(1, s.fg2m+s.fg2x, s.fg3m+s.fg3x, s.ftm+s.ftx);
 function col(label,mk,ms){
 const a=mk+ms; if(a===0)return `<div class="bar-col"><div class="bar-label">${label}<br>0</div></div>`;
 const h=(a/maxAtt)*160;
 const mh=(mk/a)*h, xh=(ms/a)*h;
 return `<div class="bar-col">
 <div class="stacked" style="height:${h}px">
 <div class="make" style="height:${mh}px"></div><div class="miss" style="height:${xh}px"></div></div>
 <div class="bar-label">${label}<br><b style="color:#e7ebf5">${mk}/${a}</b></div></div>`;
 }
 $("shotChart").innerHTML = col("2PT",s.fg2m,s.fg2x)+col("3PT",s.fg3m,s.fg3x)+col("FT",s.ftm,s.ftx);

 function pctBox(label,val,team,mk,att){
 const d=val-team; const sign=d>=0?'+':'';
 return `<div class="metric"><div class="m-l">${label}</div>
 <div class="m-v">${(val*100).toFixed(1)}%</div>
 <div class="m-d ${d>=0?'up':'down'}">${sign}${(d*100).toFixed(1)}% vs team</div>
 <div class="hint" style="margin-top:4px">${mk}/${att} makes</div></div>`;
 }
 $("shotPcts").innerHTML =
 pctBox("2PT%",s.fg2p,t2,s.fg2m,s.fg2m+s.fg2x)+
 pctBox("3PT%",s.fg3p,t3,s.fg3m,s.fg3m+s.fg3x)+
 pctBox("FT%",s.ftp,tft,s.ftm,s.ftm+s.ftx);

 // efficiency metrics
 function eff(label,val,team,fmt){const d=val-team;const sign=d>=0?'+':'';
 return `<div class="metric"><div class="m-l">${label}</div><div class="m-v">${fmt(val)}</div>
 <div class="m-d ${d>=0?'up':'down'}">${sign}${fmt(d)} vs team</div></div>`;}
 const pf=v=>(v*100).toFixed(1)+"%", nf=v=>v.toFixed(2);
 const teamPts=ROSTER.reduce((x,p)=>x+shots[p].pts,0);
 const contrib=teamPts?(s.pts/teamPts*100):0;
 $("effMetrics").innerHTML =
 eff("True Shooting %",s.ts,tavg("ts"),pf)+
 eff("Effective FG%",s.efg,tavg("efg"),pf)+
 eff("Overall FG%",s.fgp,tavg("fgp"),pf)+
 eff("Points / Shot",s.pps,tavg("pps"),nf)+
 `<div class="metric" style="grid-column:1/-1"><div class="m-l">Team Points Contribution</div>
 <div class="m-v">${contrib.toFixed(1)}%</div><div class="hint">${s.pts} of ${teamPts} pts</div></div>`;

 // team comparison table (sorted by TS%)
 const comp=withAtt.map(p=>({p,...shots[p]})).sort((a,b)=>b.ts-a.ts);
 let h=`<table class="dtable"><thead><tr><th class="player">Player</th><th>TS%</th><th>eFG%</th><th>FG%</th><th>Pts</th><th>Att</th><th>Pts/Shot</th></tr></thead><tbody>`;
 comp.forEach(r=>{const me=r.p===pl?' class="me"':'';
 h+=`<tr${me}><td class="player">${r.p}</td><td>${(r.ts*100).toFixed(1)}%</td><td>${(r.efg*100).toFixed(1)}%</td>
 <td>${(r.fgp*100).toFixed(1)}%</td><td>${r.pts}</td><td>${r.atts}</td><td>${r.pps.toFixed(2)}</td></tr>`;});
 h+="</tbody></table>";
 $("teamShooting").innerHTML=h;
}

function renderCompare(cats){
 const p1=state.p1,p2=state.p2;
 if(p1===p2){$("compareChart").innerHTML=`<p class="hint">Select two different players to compare.</p>`;$("cmpCaption").textContent="";return;}
 const rows=CATEGORY_ORDER.map(cat=>{
 const s1=cats[p1][cat].score, s2=cats[p2][cat].score;
 const better=s1>s2?p1:p2, bs=Math.max(s1,s2), ws=Math.min(s1,s2);
 let pct;
 if(ws===0)pct=(bs===0)?0:100;
 else if(ws<0&&bs>0)pct=(Math.abs(bs-ws)/Math.abs(ws))*100;
 else pct=((bs-ws)/Math.abs(ws))*100;
 return {cat,s1,s2,better,pct:Math.min(pct,300)};
 });
 const maxPct=Math.max(1,...rows.map(r=>r.pct));
 let h="";
 rows.forEach(r=>{
 const leftBetter=r.better===p1;
 const width=(r.pct/maxPct)*46; // half-track max ~46%
 const style=leftBetter
 ? `right:50%;width:${width}%;justify-content:flex-end;border-radius:5px 0 0 5px;`
 : `left:50%;width:${width}%;border-radius:0 5px 5px 0;`;
 h+=`<div class="cmp-row"><div class="cat-name">${r.cat}</div>
 <div class="cmp-track"><div class="cmp-mid"></div>
 <div class="cmp-fill" style="${style}">${r.pct.toFixed(0)}%</div></div></div>`;
 });
 $("compareChart").innerHTML=h;
 $("cmpCaption").innerHTML=`Bars to the <b style="color:#fff">left</b> favor <b style="color:var(--orange)">${p1}</b> · bars to the <b style="color:#fff">right</b> favor <b style="color:var(--orange)">${p2}</b>`;
}

function renderWeightUI(){
 const b=$("weightBtn"), n=$("weightNote");
 if(state.epa){b.textContent="EPA Weights";b.className="toggle-btn epa";n.textContent="EPA Weights Active";n.className="active-note epa";}
 else{b.textContent="Original";b.className="toggle-btn original";n.textContent="Original Weights Active";n.className="active-note original";}
}

/* ---------------- Wire up controls ---------------- */
function initControls(){
 // weight toggle
 $("weightBtn").addEventListener("click",()=>{state.epa=!state.epa;renderAll();});

 // timeline multiselect (rendered as checkboxes)
 const box=$("tlBox");
 box.innerHTML=TIMELINES.map((tl,i)=>
 `<label class="tl-item"><input type="checkbox" data-tl="${i}" checked> ${tl}</label>`).join("");
 box.querySelectorAll("input").forEach(cb=>cb.addEventListener("change",()=>{
 state.selected=TIMELINES.filter((_,i)=>box.querySelector(`input[data-tl="${i}"]`).checked);
 if(state.selected.length===0){state.selected=[...TIMELINES];box.querySelectorAll("input").forEach(x=>x.checked=true);}
 renderAll();
 }));
 $("selAll").addEventListener("click",()=>{box.querySelectorAll("input").forEach(x=>x.checked=true);state.selected=[...TIMELINES];renderAll();});
 $("clrAll").addEventListener("click",()=>{box.querySelectorAll("input").forEach((x,i)=>x.checked=(i===0));state.selected=[TIMELINES[0]];renderAll();});

 // player select
 fillSelect($("playerSel"),ROSTER,state.player);
 $("playerSel").addEventListener("change",e=>{state.player=e.target.value;renderAll();});
 // category select
 fillSelect($("catSel"),CATEGORY_ORDER,state.category);
 $("catSel").addEventListener("change",e=>{state.category=e.target.value;const {counts}=computeScores();renderPlayerAnalysis(categoryScores(counts));});
 // compare selects
 fillSelect($("p1Sel"),ROSTER,state.p1);
 fillSelect($("p2Sel"),ROSTER,state.p2);
 $("p1Sel").addEventListener("change",e=>{state.p1=e.target.value;const {counts}=computeScores();renderCompare(categoryScores(counts));});
 $("p2Sel").addEventListener("change",e=>{state.p2=e.target.value;const {counts}=computeScores();renderCompare(categoryScores(counts));});

 // dashboard tabs
 document.querySelectorAll(".dash-tab").forEach(t=>t.addEventListener("click",()=>{
 document.querySelectorAll(".dash-tab").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".dash-panel").forEach(x=>x.classList.remove("active"));
 t.classList.add("active"); $(t.dataset.panel).classList.add("active");
 }));
}
function fillSelect(sel,opts,val){sel.innerHTML=opts.map(o=>`<option${o===val?' selected':''}>${o}</option>`).join("");}

document.addEventListener("DOMContentLoaded",()=>{initControls();renderAll();});
