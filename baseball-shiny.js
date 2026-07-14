/* ============================================================
   UVA Baseball Dashboard — interactive demo
   Faithful rebuild of the production R Shiny app on a fabricated
   pitch-level dataset. No proprietary data anywhere.
   ============================================================ */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd=mulberry32(20240824);
const R=(lo,hi)=>lo+(hi-lo)*rnd();
const pick=a=>a[Math.floor(rnd()*a.length)];

/* pitch types with real app colors + movement templates */
const PT={
 Fastball:{c:"#E74C3C",velo:[91,96],spin:[2150,2400],ivb:[13,19],hb:[-6,6]},
 Sinker:{c:"#E67E22",velo:[89,94],spin:[2000,2250],ivb:[4,10],hb:[8,17]},
 Slider:{c:"#F1C40F",velo:[81,87],spin:[2300,2600],ivb:[-2,4],hb:[-11,-3]},
 Curveball:{c:"#3498DB",velo:[76,82],spin:[2500,2900],ivb:[-14,-6],hb:[-9,1]},
 ChangeUp:{c:"#2ECC71",velo:[82,87],spin:[1700,2000],ivb:[5,11],hb:[9,16]},
 Cutter:{c:"#95A5A6",velo:[86,90],spin:[2300,2500],ivb:[6,12],hb:[-5,1]},
 Sweeper:{c:"#9B59B6",velo:[79,84],spin:[2600,2950],ivb:[-3,3],hb:[-16,-8]}
};
const HIT_COLORS={Out:"#c0392b",Single:"#AED6F1",Double:"#2E86C1",Triple:"#1A5276",HomeRun:"#0B2545"};

const HITTERS=["A. Delgado","B. Fisher","C. Yamada","D. Ellison","E. Okonkwo","F. Marsh","G. Ricci","H. Vaughn","I. Castellanos"]
  .map((n,i)=>({name:n,side:i%3===0?"Left":"Right",skill:R(.35,.8),chase:R(.2,.42)}));
const PITCHERS=["J. Halstead","K. Boone","L. Ferrara","M. Underwood","N. Sato","O. Delacroix"].map((n,i)=>{
  const throws=i%2===0?"Right":"Left";
  const names=Object.keys(PT);
  const arr=["Fastball",...names.slice(1).filter(()=>rnd()<0.55)];
  const uniq=[...new Set(arr)].slice(0,4); if(uniq.length<3)uniq.push("Slider");
  // per-pitch fixed template so movement is stable
  const arsenal=[...new Set(uniq)].map(pt=>({pt,velo:R(...PT[pt].velo),spin:Math.round(R(...PT[pt].spin)),
    ivb:R(...PT[pt].ivb),hb:R(...PT[pt].hb)*(throws==="Left"?-1:1)}));
  return {name:n,throws,arsenal,command:R(.4,.85)};
});
const CATCHERS=["P. Nakamura","Q. Bellinger","R. Ostrowski"].map(n=>({name:n,skill:R(.35,.8)}));
const DATES=["2.14.25","2.21.25","3.1.25","3.8.25","3.15.25","3.22.25","4.5.25","4.12.25"];

/* ---------- generate pitch-level rows by simulating plate appearances ---------- */
const ROWS=[];
let gid=0, paid=0;
PITCHERS.forEach(P=>{
  DATES.forEach((d,di)=>{
    const gID="G"+(gid++);
    let seq=0;
    const nPA=Math.round(R(13,22));
    for(let ab=0;ab<nPA;ab++){
      const bat=pick(HITTERS), cat=pick(CATCHERS), PA="PA"+(paid++);
      let balls=0,strikes=0,pofPA=0,done=false;
      while(!done && pofPA<12){
        const a=pick(P.arsenal);
        // command: chance the pitch is in the zone
        const inZoneP = 0.42 + P.command*0.14 + (strikes<2?0.03:-0.05);
        const inZone = rnd()<inZoneP;
        let px,py;
        if(inZone){ px=R(-0.8,0.8); py=R(1.55,3.45); }
        else { // off the edges
          if(rnd()<0.5){ px=(rnd()<0.5?-1:1)*R(0.85,1.5); py=R(1.2,3.8); }
          else { px=R(-1.1,1.1); py=(rnd()<0.5?R(0.6,1.45):R(3.55,4.4)); }
        }
        const wantSwing = inZone ? rnd()<(0.63+bat.skill*0.12 - (strikes===2?0.05:0)) : rnd()<(bat.chase + (strikes===2?0.1:0));
        let call,result="Undefined",ev=0,la=0,dist=0,dir=0;
        const bBefore=balls,sBefore=strikes;
        if(!wantSwing){ call = inZone?"StrikeCalled":"BallCalled"; if(inZone)strikes++; else balls++; }
        else {
          const miss = rnd() < (0.20 + (a.pt!=="Fastball"?0.06:0) + (strikes===2?0.05:0) - bat.skill*0.09);
          if(miss){ call="StrikeSwinging"; strikes++; }
          else if(rnd()<0.40){ call="FoulBall"; if(strikes<2)strikes++; }
          else { call="InPlay"; done=true;
            ev=Math.min(117, R(80,110)*(0.84+bat.skill*0.20));
            la=R(-22,46);
            const q=(ev-72)/44;
            if(la<8) result = rnd()<0.72?"Out":"Single";
            else if(la<26 && q>0.62) result = pick(["Single","Double","Double","Triple","HomeRun"]);
            else if(la<26) result = rnd()<0.6?"Out":"Single";
            else result = (q>0.82)? pick(["Double","HomeRun","Out","Out"]) : "Out";
            dist = result==="HomeRun"?R(360,430):result==="Triple"?R(300,360):result==="Double"?R(240,320):result==="Single"?R(110,250):R(150,340);
            dir = R(-46,46);
          }
        }
        // terminal by count
        let korbb="Undefined";
        if(!done && strikes>=3){ korbb="Strikeout"; done=true; }
        if(!done && balls>=4){ korbb="Walk"; done=true; }
        const velo=a.velo+R(-1.2,1.2), spin=a.spin+R(-120,120), hb=a.hb+R(-3,3), ivb=a.ivb+R(-3,3);
        ROWS.push({GameID:gID,Date:d,di,Pitcher:P.name,PitcherThrows:P.throws,Catcher:cat.name,
          Batter:bat.name,BatterSide:bat.side,Pitch:a.pt,Balls:bBefore,Strikes:sBefore,
          PlateLocSide:px,PlateLocHeight:py,inZone,PitchCall:call,PlayResult:result,KorBB:korbb,
          ExitSpeed:+ev.toFixed(1),Angle:+la.toFixed(1),Distance:+dist.toFixed(0),Direction:+dir.toFixed(1),
          RelSpeed:+velo.toFixed(1),SpinRate:Math.round(spin),HorzBreak:+hb.toFixed(1),InducedVertBreak:+ivb.toFixed(1),
          PAID:PA,pofPA:pofPA,seq:seq++});
        pofPA++;
      }
    }
  });
});

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function fill(sel,arr){sel.innerHTML=arr.map(a=>`<option>${a}</option>`).join("");}
function mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0;}
function bwr(t){ // blue-white-red, t 0..1
  t=Math.max(0,Math.min(1,t));
  let c;
  if(t<0.5){const f=t/0.5;c=[Math.round(65+(255-65)*f),Math.round(105+(255-105)*f),Math.round(224+(255-224)*f)];}
  else{const f=(t-0.5)/0.5;c=[Math.round(255+(220-255)*f),Math.round(255+(20-255)*f),Math.round(255+(52-255)*f)];}
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
let charts={};
function newChart(id,cfg){if(charts[id])charts[id].destroy();charts[id]=new Chart(document.getElementById(id),cfg);}
const SW=0.83, ZB=[1.5,3.5];

/* ==================== HITTING: DATA TABLES ==================== */
function hitAgg(hand,minPa){
  const out={};
  ROWS.forEach(r=>{
    if(hand!=="All"&&r.PitcherThrows!==hand)return;
    const b=r.Batter; if(!out[b])out[b]={paKeys:new Set(),rows:[]};
    out[b].paKeys.add(r.PAID); out[b].rows.push(r);
  });
  const res=[];
  for(const b in out){
    const rs=out[b].rows;
    const pa=out[b].paKeys.size;
    const H=rs.filter(r=>["Single","Double","Triple","HomeRun"].includes(r.PlayResult));
    const s1=H.filter(r=>r.PlayResult==="Single").length,d2=H.filter(r=>r.PlayResult==="Double").length,
          t3=H.filter(r=>r.PlayResult==="Triple").length,hr=H.filter(r=>r.PlayResult==="HomeRun").length;
    const bb=rs.filter(r=>r.KorBB==="Walk").length, so=rs.filter(r=>r.KorBB==="Strikeout").length;
    const ab=Math.max(pa-bb,1);
    const obp=(H.length+bb)/Math.max(pa,1), slg=(s1+2*d2+3*t3+4*hr)/ab, ops=obp+slg;
    const babip=(H.length-hr)/Math.max(ab-so-hr,1);
    const woba=+(0.69*bb/Math.max(pa,1)+0.9*s1/ab+1.25*d2/ab+1.6*t3/ab+2.0*hr/ab+ .0).toFixed(3);
    const bip=rs.filter(r=>r.PitchCall==="InPlay");
    const hardhit=bip.length?bip.filter(r=>r.ExitSpeed>=95).length/bip.length*100:0;
    const inZ=rs.filter(r=>r.inZone), outZ=rs.filter(r=>!r.inZone);
    const swings=r=>["StrikeSwinging","FoulBall","InPlay"].includes(r.PitchCall);
    const izs=inZ.length?inZ.filter(swings).length/inZ.length*100:0;
    const chase=outZ.length?outZ.filter(swings).length/outZ.length*100:0;
    const sw=rs.filter(swings), whiff=sw.length?rs.filter(r=>r.PitchCall==="StrikeSwinging").length/sw.length*100:0;
    const pullair=bip.length?bip.filter(r=>{const pulled=(r.BatterSide==="Left"&&r.Direction<0)||(r.BatterSide==="Right"&&r.Direction>0);return pulled&&r.Angle>8;}).length/bip.length*100:0;
    if(pa>=minPa) res.push({Batter:b,PA:pa,wOBA:woba,OBP:+obp.toFixed(3),SLG:+slg.toFixed(3),OPS:+ops.toFixed(3),
      BABIP:+babip.toFixed(3),K:+(so/Math.max(pa,1)*100).toFixed(1),BB:+(bb/Math.max(pa,1)*100).toFixed(1),
      HardHit:+hardhit.toFixed(1),IZSwing:+izs.toFixed(1),Chase:+chase.toFixed(1),Whiff:+whiff.toFixed(1),
      PullAir:+pullair.toFixed(1),EV:+mean(bip.map(r=>r.ExitSpeed)).toFixed(1),LA:+mean(bip.map(r=>r.Angle)).toFixed(1)});
  }
  return res;
}
function renderHitTable(){
  const rows=hitAgg($("#htHand").value,+$("#htMinPa").value);
  const cols=[["Batter","Batter","l"],["PA","PA"],["wOBA","wOBA"],["OBP","OBP"],["SLG","SLG"],["OPS","OPS"],["BABIP","BABIP"],
    ["K","K%"],["BB","BB%"],["HardHit","Hard-Hit%"],["IZSwing","IZ-Swing%"],["Chase","Chase%"],["Whiff","Whiff%"],
    ["PullAir","Pull-Air%"],["EV","Avg EV"],["LA","Avg LA"]];
  rows.sort((a,b)=>b.wOBA-a.wOBA);
  function draw(){
    let h="<thead><tr>"+cols.map(c=>`<th class="${c[2]||''}" data-k="${c[0]}" style="cursor:pointer">${c[1]}</th>`).join("")+"</tr></thead><tbody>";
    rows.forEach(r=>{h+="<tr>"+cols.map(c=>`<td class="${c[2]||''}">${r[c[0]]}</td>`).join("")+"</tr>";});
    $("#hitTable").innerHTML=h+"</tbody>";
    $("#hitTable").querySelectorAll("th").forEach(th=>th.addEventListener("click",()=>{
      const k=th.dataset.k; rows.sort((a,b)=>k==="Batter"?a.Batter.localeCompare(b.Batter):b[k]-a[k]); draw();}));
  }
  draw();
}

/* ==================== HITTING: MATCHUP ==================== */
function batterRows(name,throws){return ROWS.filter(r=>r.Batter===name&&(throws==="All"||r.PitcherThrows===throws));}
function renderMatchup(){
  const name=$("#mHitter").value, throws=$("#mThrows").value, onlyHits=$("#mHitType").value==="Only Hits";
  let bip=batterRows(name,throws).filter(r=>r.PitchCall==="InPlay");
  // spray chart
  const W=380,H=360,hp={x:190,y:315}, scale=0.62;
  let s=`<rect width="${W}" height="${H}" fill="#2d6a4f"/>`;
  // infield dirt + foul lines
  s+=`<line x1="${hp.x}" y1="${hp.y}" x2="${hp.x-215*scale*Math.SQRT1_2*1.4}" y2="${hp.y-215*scale*Math.SQRT1_2*1.4}" stroke="#e8e2d0" stroke-width="2"/>`;
  s+=`<line x1="${hp.x}" y1="${hp.y}" x2="${hp.x+215*scale*Math.SQRT1_2*1.4}" y2="${hp.y-215*scale*Math.SQRT1_2*1.4}" stroke="#e8e2d0" stroke-width="2"/>`;
  // outfield arc
  s+=`<path d="M ${hp.x-215*scale*Math.SQRT1_2*1.4} ${hp.y-215*scale*Math.SQRT1_2*1.4} A ${300*scale} ${300*scale} 0 0 1 ${hp.x+215*scale*Math.SQRT1_2*1.4} ${hp.y-215*scale*Math.SQRT1_2*1.4}" fill="none" stroke="#cdbb8f" stroke-width="2"/>`;
  s+=`<path d="M ${hp.x} ${hp.y} L ${hp.x-70} ${hp.y-70} A 99 99 0 0 1 ${hp.x+70} ${hp.y-70} Z" fill="#b98b52" opacity=".5"/>`;
  let shown=bip.filter(r=>onlyHits? r.PlayResult!=="Out":true);
  shown.forEach(r=>{
    const res=["Error","Sacrifice","Out","Undefined"].includes(r.PlayResult)?"Out":r.PlayResult;
    const rad=r.Distance*scale;
    const x=hp.x+rad*Math.sin(r.Direction*Math.PI/180), y=hp.y-rad*Math.cos(r.Direction*Math.PI/180);
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${HIT_COLORS[res]||'#c0392b'}" stroke="#fff" stroke-width=".7" opacity=".9"/>`;
  });
  $("#spraySvg").innerHTML=s;
  $("#sprayLegend").innerHTML=Object.entries(HIT_COLORS).map(([k,c])=>`<label><span class="swatch" style="background:${c}"></span>${k}</label>`).join("");
  // contact map by pitch type
  const cx=150,cy=150,zx=70,zy=90;
  let cm=`<rect width="300" height="320" fill="#fff"/><rect x="${cx-zx}" y="${cy-zy}" width="${zx*2}" height="${zy*2}" fill="none" stroke="#111" stroke-width="2"/>`;
  for(let i=1;i<3;i++){cm+=`<line x1="${cx-zx+zx*2/3*i}" y1="${cy-zy}" x2="${cx-zx+zx*2/3*i}" y2="${cy+zy}" stroke="#ccc"/><line x1="${cx-zx}" y1="${cy-zy+zy*2/3*i}" x2="${cx+zx}" y2="${cy-zy+zy*2/3*i}" stroke="#ccc"/>`;}
  bip.forEach(r=>{const x=cx+r.PlateLocSide*zx/0.83, y=cy-(r.PlateLocHeight-2.5)*zy/1.0;
    cm+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${PT[r.Pitch].c}" stroke="#fff" stroke-width=".8" opacity=".8"/>`;});
  $("#contactSvg").innerHTML=cm;
  const usedPT=[...new Set(bip.map(r=>r.Pitch))];
  $("#contactLegend").innerHTML=usedPT.map(p=>`<label><span class="swatch" style="background:${PT[p].c}"></span>${p}</label>`).join("");
  // play table
  let ph=`<thead><tr><th class="l">Pitch</th><th>Result</th><th>Exit MPH</th><th>LA</th><th>Distance</th></tr></thead><tbody>`;
  bip.slice().sort((a,b)=>b.ExitSpeed-a.ExitSpeed).forEach(r=>{const res=["Error","Sacrifice","Undefined"].includes(r.PlayResult)?"Out":r.PlayResult;
    ph+=`<tr><td class="l"><span style="color:${PT[r.Pitch].c}">&#9679;</span> ${r.Pitch}</td><td>${res}</td><td>${r.ExitSpeed}</td><td>${r.Angle}</td><td>${r.Distance}</td></tr>`;});
  $("#playTable").innerHTML=ph+"</tbody>";
}

/* ==================== HITTING: ZONE ==================== */
function zoneCells(){ // returns {inner:[{x,y,w,h,idx}], shadows:[{key,x,y,w,h}]}
  // svg coords in 260x300 view, catcher view
  const cx=130,cy=150,zx=52,zy=66; // strike zone half-widths (px)
  const inner=[];
  for(let ry=0;ry<3;ry++)for(let rx=0;rx<3;rx++){
    inner.push({rx,ry, x:cx-zx+ (zx*2/3)*rx, y:cy-zy+(zy*2/3)*ry, w:zx*2/3, h:zy*2/3});
  }
  const m=34;
  const shadows=[
    {key:"top",x:cx-zx-m,y:cy-zy-m,w:(zx+m)*2,h:m},
    {key:"bottom",x:cx-zx-m,y:cy+zy,w:(zx+m)*2,h:m},
    {key:"left",x:cx-zx-m,y:cy-zy,w:m,h:zy*2},
    {key:"right",x:cx+zx,y:cy-zy,w:m,h:zy*2}
  ];
  return {inner,shadows,cx,cy,zx,zy};
}
function classifyZone(r){ // returns inner index 0..8 or shadow key
  const x=r.PlateLocSide,y=r.PlateLocHeight;
  if(Math.abs(x)<=0.83&&y>=1.5&&y<=3.5){
    const rx=x< -0.277?0:x<0.277?1:2;
    const ry=y>2.833?0:y>2.167?1:2; // top row first
    return "in_"+(ry*3+rx);
  }
  if(y>3.5) return "top"; if(y<1.5) return "bottom";
  if(x< -0.83) return "left"; return "right";
}
function renderZoneMap(svgId,metric,which){
  const name=$(which==="cz"?"#zHitter":"#zHitter").value, throws=$("#zThrows").value;
  const rows=ROWS.filter(r=>r.Batter===name&&(throws==="All"||r.PitcherThrows===throws));
  const swings=r=>["StrikeSwinging","FoulBall","InPlay"].includes(r.PitchCall);
  const buckets={}; ["in_0","in_1","in_2","in_3","in_4","in_5","in_6","in_7","in_8","top","bottom","left","right"].forEach(k=>buckets[k]=[]);
  rows.forEach(r=>{const z=classifyZone(r); if(buckets[z])buckets[z].push(r);});
  function val(rs){
    if(rs.length===0)return null;
    if(which==="cz"){
      const sw=rs.filter(swings).length, contacts=rs.filter(r=>["FoulBall","InPlay"].includes(r.PitchCall)).length, whiffs=rs.filter(r=>r.PitchCall==="StrikeSwinging").length;
      if(metric==="Swing")return sw/rs.length;
      if(metric==="Contact")return sw>0?contacts/sw:null;
      return sw>0?whiffs/sw:null;
    } else {
      const bip=rs.filter(r=>r.PitchCall==="InPlay"); if(bip.length===0)return null;
      if(metric==="Exit Velo")return mean(bip.map(r=>r.ExitSpeed));
      if(metric==="Hard Hit %")return bip.filter(r=>r.ExitSpeed>=95).length/bip.length;
      return bip.filter(r=>r.Angle>=8&&r.Angle<=32).length/bip.length;
    }
  }
  const vals={}; for(const k in buckets)vals[k]=val(buckets[k]);
  const nums=Object.values(vals).filter(v=>v!=null);
  const mn=Math.min(...nums,0), mx=Math.max(...nums,1);
  const mid=(which==="cv"&&metric==="Exit Velo")?87.5:(which==="cv"?0.5:0.5);
  const half=(which==="cv"&&metric==="Exit Velo")?15:0.5;
  const norm=v=>v==null?null:Math.max(0,Math.min(1,(v-mid)/half*0.5+0.5));
  const Z=zoneCells();
  let s=`<rect width="260" height="300" fill="#fff"/>`;
  function cell(x,y,w,h,v){const t=norm(v);const col=v==null?"#e5e5e5":bwr(t);
    let lbl=""; if(v!=null){lbl=(which==="cv"&&metric==="Exit Velo")?v.toFixed(0):Math.round(v*100)+"%";}
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="#111" stroke-width=".8"/>`+
      (v!=null?`<text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#333">${lbl}</text>`:"");}
  Z.shadows.forEach(sh=>{s+=cell(sh.x,sh.y,sh.w,sh.h,vals[sh.key]);});
  Z.inner.forEach((c,i)=>{s+=cell(c.x,c.y,c.w,c.h,vals["in_"+i]);});
  s+=`<rect x="${Z.cx-Z.zx}" y="${Z.cy-Z.zy}" width="${Z.zx*2}" height="${Z.zy*2}" fill="none" stroke="#111" stroke-width="2.2"/>`;
  document.getElementById(svgId).innerHTML=s;
}
function renderZone(){renderZoneMap("czSvg",$("#czMetric").value,"cz");renderZoneMap("cvSvg",$("#cvMetric").value,"cv");}

/* ==================== PITCHING: DATA TABLES ==================== */
function pitAgg(hand,count,minP){
  const inb=(r)=>{
    if(hand!=="All"&&r.BatterSide!==hand)return false;
    const c=r.Balls+"-"+r.Strikes;
    if(count==="Ahead")return ["0-2","1-2","2-2"].includes(c);
    if(count==="Behind")return ["2-0","3-0","3-1"].includes(c);
    if(count==="Even")return ["0-0","1-1","2-2"].includes(c);
    return true;
  };
  const out={};
  ROWS.forEach(r=>{if(!inb(r))return; if(!out[r.Pitcher])out[r.Pitcher]=[];out[r.Pitcher].push(r);});
  const res=[];
  for(const p in out){const rs=out[p];
    const pitches=rs.length, bf=new Set(rs.map(r=>r.PAID)).size;
    const K=rs.filter(r=>r.KorBB==="Strikeout").length, BB=rs.filter(r=>r.KorBB==="Walk").length;
    const H=rs.filter(r=>["Single","Double","Triple","HomeRun"].includes(r.PlayResult)).length;
    const AB=Math.max(bf-BB,1);
    const strike=rs.filter(r=>["StrikeCalled","StrikeSwinging","FoulBall","InPlay"].includes(r.PitchCall)).length;
    const fp=rs.filter(r=>r.pofPA===0), fps=fp.length?fp.filter(r=>["StrikeCalled","StrikeSwinging","FoulBall","InPlay"].includes(r.PitchCall)).length/fp.length*100:0;
    const contact=rs.filter(r=>["FoulBall","InPlay"].includes(r.PitchCall)).length, ss=rs.filter(r=>r.PitchCall==="StrikeSwinging").length;
    const whiff=(ss+contact)?ss/(ss+contact)*100:0;
    const outZ=rs.filter(r=>!r.inZone), chase=outZ.length?outZ.filter(r=>r.PitchCall==="StrikeSwinging").length/outZ.length*100:0;
    const csw=(rs.filter(r=>r.PitchCall==="StrikeCalled").length+ss)/pitches*100;
    if(pitches>=minP)res.push({Pitcher:p,Pitches:pitches,BF:bf,K:+(K/Math.max(bf,1)*100).toFixed(1),BB:+(BB/Math.max(bf,1)*100).toFixed(1),
      BAA:+(H/AB).toFixed(3),Strike:+(strike/pitches*100).toFixed(1),FPS:+fps.toFixed(1),Whiff:+whiff.toFixed(1),Chase:+chase.toFixed(1),
      CSW:+csw.toFixed(1),Velo:+mean(rs.map(r=>r.RelSpeed)).toFixed(1)});
  }
  return res;
}
function renderPitTable(){
  const rows=pitAgg($("#ptHand").value,$("#ptCount").value,+$("#ptMin").value);
  const cols=[["Pitcher","Pitcher","l"],["Pitches","Pitches"],["BF","BF"],["K","K%"],["BB","BB%"],["BAA","BAA"],
    ["Strike","Strike%"],["FPS","FPS%"],["Whiff","Whiff%"],["Chase","Chase%"],["CSW","CSW%"],["Velo","Avg Velo"]];
  rows.sort((a,b)=>a.BAA-b.BAA);
  function draw(){let h="<thead><tr>"+cols.map(c=>`<th class="${c[2]||''}" data-k="${c[0]}" style="cursor:pointer">${c[1]}</th>`).join("")+"</tr></thead><tbody>";
    rows.forEach(r=>{h+="<tr>"+cols.map(c=>`<td class="${c[2]||''}">${r[c[0]]}</td>`).join("")+"</tr>";});
    $("#pitTable").innerHTML=h+"</tbody>";
    $("#pitTable").querySelectorAll("th").forEach(th=>th.addEventListener("click",()=>{const k=th.dataset.k;rows.sort((a,b)=>k==="Pitcher"?a.Pitcher.localeCompare(b.Pitcher):(k==="BAA"?a[k]-b[k]:b[k]-a[k]));draw();}));}
  draw();
}

/* ==================== PITCHING: ARSENAL ==================== */
function pitcherRows(name){return ROWS.filter(r=>r.Pitcher===name);}
function renderArsenal(){
  const name=$("#aPitcher").value, rs=pitcherRows(name);
  const types=[...new Set(rs.map(r=>r.Pitch))];
  const sets=[];
  types.forEach(pt=>{const sub=rs.filter(r=>r.Pitch===pt);
    const hbM=mean(sub.map(r=>r.HorzBreak)), ivbM=mean(sub.map(r=>r.InducedVertBreak));
    const hbS=Math.sqrt(mean(sub.map(r=>(r.HorzBreak-hbM)**2)))||2, ivbS=Math.sqrt(mean(sub.map(r=>(r.InducedVertBreak-ivbM)**2)))||2;
    const ell=[];for(let a=0;a<=360;a+=12)ell.push({x:hbM+2*hbS*Math.cos(a*Math.PI/180),y:ivbM+2*ivbS*Math.sin(a*Math.PI/180)});
    sets.push({label:pt,data:ell,type:"line",borderColor:PT[pt].c+"66",backgroundColor:PT[pt].c+"18",fill:true,pointRadius:0,borderDash:[4,3],order:2});
    sets.push({label:pt+" ",data:[{x:hbM,y:ivbM}],backgroundColor:PT[pt].c,pointRadius:9,pointHoverRadius:11,order:1});
  });
  newChart("movementChart",{type:"scatter",data:{datasets:sets},
    options:{plugins:{legend:{display:true,labels:{filter:i=>!i.text.endsWith(" "),usePointStyle:true}}},
      scales:{x:{title:{display:true,text:"Horizontal break (in)"},min:-22,max:22},y:{title:{display:true,text:"Induced vertical break (in)"},min:-20,max:24}}}});
  // usage vs LHH / RHH
  const usage=types.map(pt=>{
    const L=rs.filter(r=>r.Pitch===pt&&r.BatterSide==="Left").length, Ltot=rs.filter(r=>r.BatterSide==="Left").length||1;
    const Rr=rs.filter(r=>r.Pitch===pt&&r.BatterSide==="Right").length, Rtot=rs.filter(r=>r.BatterSide==="Right").length||1;
    return {pt,L:L/Ltot*100,R:Rr/Rtot*100};
  }).sort((a,b)=>(b.L+b.R)-(a.L+a.R));
  newChart("usageChart",{type:"bar",data:{labels:usage.map(u=>u.pt),datasets:[
    {label:"vs LHH",data:usage.map(u=>-u.L),backgroundColor:usage.map(u=>PT[u.pt].c),stack:"s"},
    {label:"vs RHH",data:usage.map(u=>u.R),backgroundColor:usage.map(u=>PT[u.pt].c),stack:"s"}]},
    options:{indexAxis:"y",plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${Math.abs(c.raw).toFixed(0)}%`}}},
      scales:{x:{title:{display:true,text:"vs LHH        usage %        vs RHH"},ticks:{callback:v=>Math.abs(v)+"%"}},y:{stacked:true}}}});
}

/* ==================== PITCHING: SITUATIONAL ==================== */
function renderSitu(){
  const name=$("#sPitcher").value, rs=pitcherRows(name).slice().sort((a,b)=>a.GameID.localeCompare(b.GameID)||a.seq-b.seq);
  const types=[...new Set(rs.map(r=>r.Pitch))];
  // transition matrix (only within the same plate appearance)
  const T={}; types.forEach(a=>{T[a]={};types.forEach(b=>T[a][b]=0);});
  for(let i=1;i<rs.length;i++){if(rs[i].PAID===rs[i-1].PAID){T[rs[i-1].Pitch][rs[i].Pitch]++;}}
  const n=types.length, cell=Math.min(70,240/n), ox=60,oy=30;
  let s=`<rect width="300" height="300" fill="#fff"/>`;
  types.forEach((a,i)=>{const tot=types.reduce((x,b)=>x+T[a][b],0)||1;
    types.forEach((b,j)=>{const pct=T[a][b]/tot*100;const x=ox+j*cell,y=oy+i*cell;
      const t=pct/100; const col=pct===0?"#f4f4f4":`rgb(${Math.round(52+(231-52)*t)},${Math.round(152+(76-152)*t)},${Math.round(219+(60-219)*t)})`;
      s+=`<rect x="${x}" y="${y}" width="${cell-2}" height="${cell-2}" fill="${col}" rx="3"/>`;
      if(pct>0)s+=`<text x="${x+cell/2-1}" y="${y+cell/2+3}" text-anchor="middle" font-size="9" font-weight="700" fill="${t>0.5?'#fff':'#333'}">${pct.toFixed(0)}%</text>`;});
    s+=`<text x="${ox-6}" y="${oy+i*cell+cell/2+3}" text-anchor="end" font-size="9" font-weight="700" fill="${PT[a].c}">${a.slice(0,4)}</text>`;
    s+=`<text x="${ox+i*cell+cell/2-1}" y="${oy-6}" text-anchor="middle" font-size="9" font-weight="700" fill="${PT[types[i]].c}">${types[i].slice(0,4)}</text>`;});
  s+=`<text x="150" y="292" text-anchor="middle" font-size="9" fill="#888">current pitch  →   (rows = previous)</text>`;
  $("#transSvg").innerHTML=s;
  // net run value by count diamond
  const RV={StrikeCalled:0.068,StrikeSwinging:0.085,FoulBall:0.040,BallCalled:-0.054,InPlay:0};
  const PRV={Out:0.089,Single:-0.474,Double:-0.774,Triple:-1.070,HomeRun:-1.380};
  const counts=["0-0","0-1","0-2","1-0","1-1","1-2","2-0","2-1","2-2","3-0","3-1","3-2"];
  const rawPos={"0-0":[0,4],"0-1":[-1,3],"0-2":[-2,2],"1-0":[1,4],"1-1":[0,3],"1-2":[-1,2],"2-0":[2,4],"2-1":[1,3],"2-2":[0,2],"3-0":[3,4],"3-1":[2,3],"3-2":[1,2]};
  const ang=Math.PI/4, cnt={};
  counts.forEach(c=>{const rs2=rs.filter(r=>r.Balls+"-"+r.Strikes===c);
    let rv=0;rs2.forEach(r=>{if(r.PitchCall==="InPlay"&&PRV[r.PlayResult]!=null)rv+=PRV[r.PlayResult];else if(RV[r.PitchCall]!=null)rv+=RV[r.PitchCall];});
    cnt[c]={n:rs2.length,rv};});
  const edges=[["0-0","1-0"],["0-0","0-1"],["1-0","2-0"],["1-0","1-1"],["2-0","3-0"],["2-0","2-1"],["3-0","3-1"],["0-1","1-1"],["0-1","0-2"],["1-1","2-1"],["1-1","1-2"],["2-1","3-1"],["2-1","2-2"],["3-1","3-2"],["0-2","1-2"],["1-2","2-2"],["2-2","3-2"]];
  const rp={}; counts.forEach(c=>{const[cx,cy]=rawPos[c];rp[c]=[cx*Math.cos(ang)-cy*Math.sin(ang),cx*Math.sin(ang)+cy*Math.cos(ang)];});
  const xs=counts.map(c=>rp[c][0]),ys=counts.map(c=>rp[c][1]);
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const sc=(p)=>[30+(p[0]-xmin)/(xmax-xmin)*260, 40+(ymax-p[1])/(ymax-ymin)*230];
  const maxN=Math.max(...counts.map(c=>cnt[c].n),1);
  let d=`<rect width="320" height="320" fill="#0e1f17"/>`;
  edges.forEach(([a,b])=>{const p1=sc(rp[a]),p2=sc(rp[b]);const w=1+cnt[a].n/maxN*5;
    d+=`<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#3a5a48" stroke-width="${w.toFixed(1)}"/>`;});
  counts.forEach(c=>{if(cnt[c].n===0)return;const p=sc(rp[c]);const rv=cnt[c].rv;const col=rv>=0?"#2f9e44":"#d64545";
    d+=`<circle cx="${p[0]}" cy="${p[1]}" r="16" fill="${col}" stroke="#0e1f17" stroke-width="2"/>`;
    d+=`<text x="${p[0]}" y="${p[1]-1}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${c}</text>`;
    d+=`<text x="${p[0]}" y="${p[1]+9}" text-anchor="middle" font-size="8" fill="#fff">${rv>=0?'+':''}${rv.toFixed(1)}</text>`;});
  $("#countSvg").innerHTML=d;
}

/* ==================== PITCHING: LOCATIONS ==================== */
function renderLoc(){
  const name=$("#lPitcher").value, rs=pitcherRows(name);
  const types=[...new Set(rs.map(r=>r.Pitch))];
  // small multiples: 5x5 density per pitch
  let html="";
  types.forEach(pt=>{const sub=rs.filter(r=>r.Pitch===pt);
    const bins=Array.from({length:5},()=>Array(5).fill(0));
    sub.forEach(r=>{const bx=Math.max(0,Math.min(4,Math.floor((r.PlateLocSide+1.5)/3*5)));const by=Math.max(0,Math.min(4,Math.floor((4.0-r.PlateLocHeight)/3.2*5)));bins[by][bx]++;});
    const mx=Math.max(1,...bins.flat());
    const W=140,H=150,cx=70,cy=72,zx=34,zy=44;
    let s=`<svg viewBox="0 0 ${W} ${H}" width="100%"><rect width="${W}" height="${H}" fill="#fff"/>`;
    for(let by=0;by<5;by++)for(let bx=0;bx<5;bx++){const t=bins[by][bx]/mx;
      const col=t===0?"#f7f7f7":`rgb(${Math.round(50+(230-50)*t)},${Math.round(80+(40-80)*Math.min(1,t*1.5))},${Math.round(220-200*t)})`;
      s+=`<rect x="${10+bx*24}" y="${16+by*24}" width="24" height="24" fill="${col}"/>`;}
    s+=`<rect x="${cx-zx}" y="${cy-zy}" width="${zx*2}" height="${zy*2}" fill="none" stroke="#111" stroke-width="1.6"/>`;
    s+=`<text x="${W/2}" y="12" text-anchor="middle" font-size="10" font-weight="700" fill="${PT[pt].c}">${pt} (${sub.length})</text></svg>`;
    html+=`<div class="zonebox" style="padding:4px">${s}</div>`;});
  $("#locMulti").innerHTML=html;
  // zone distribution Heart/Shadow/Chase/Waste
  const bw=0.24;
  function zoneOf(r){const x=Math.abs(r.PlateLocSide),y=r.PlateLocHeight;
    if(x<=0.83-bw&&y>=1.5+bw&&y<=3.5-bw)return"Heart";
    if(x<=0.83+bw&&y>=1.5-bw&&y<=3.5+bw)return"Shadow";
    if(x<=1.5&&y>=0.5&&y<=4.5)return"Chase";return"Waste";}
  const PRV={Out:0.089,Single:-0.474,Double:-0.774,Triple:-1.070,HomeRun:-1.380};
  const Z={Heart:{n:0,rv:0},Shadow:{n:0,rv:0},Chase:{n:0,rv:0},Waste:{n:0,rv:0}};
  rs.forEach(r=>{const z=zoneOf(r);Z[z].n++;if(r.PitchCall==="InPlay"&&PRV[r.PlayResult]!=null)Z[z].rv+=(-PRV[r.PlayResult]); if(["StrikeCalled","StrikeSwinging"].includes(r.PitchCall))Z[z].rv+=0.05;});
  const tot=rs.length||1;
  const ZC={Heart:"#E8A2D1",Shadow:"#F4A582",Chase:"#F4E96D",Waste:"#BDBDBD"};
  const cx=150,cy=155;
  let zs=`<rect width="300" height="320" fill="#fff"/>`;
  const rects=[["Waste",130,150],["Chase",95,112],["Shadow",64,80],["Heart",38,50]];
  rects.forEach(([k,rx,ry])=>{zs+=`<rect x="${cx-rx}" y="${cy-ry}" width="${rx*2}" height="${ry*2}" fill="${ZC[k]}" stroke="#fff" stroke-width="2"/>`;});
  zs+=`<rect x="${cx-52}" y="${cy-66}" width="104" height="132" fill="none" stroke="#2f9e44" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  const labY={Heart:cy,Shadow:cy-92,Chase:cy+120,Waste:cy-134};
  Object.keys(Z).forEach(k=>{zs+=`<text x="${cx}" y="${labY[k]}" text-anchor="middle" font-size="11" font-weight="800" fill="#222">${k}: ${Z[k].rv.toFixed(1)} R</text>`;});
  $("#zoneDistSvg").innerHTML=zs;
  $("#zoneDistLegend").innerHTML=Object.entries(ZC).map(([k,c])=>`<label><span class="swatch" style="background:${c}"></span>${k} ${(Z[k].n/tot*100).toFixed(0)}%</label>`).join("");
}

/* ==================== PITCHING: TRENDS ==================== */
const METRIC_KEY={velo:"RelSpeed",spin:"SpinRate",hb:"HorzBreak",ivb:"InducedVertBreak"};
const METRIC_LBL={velo:"Release Velocity (mph)",spin:"Spin Rate (rpm)",hb:"Horizontal Break (in)",ivb:"Induced Vertical Break (in)"};
function renderSeason(){
  const name=$("#tPitcher").value, mk=METRIC_KEY[$("#tMetric").value], rs=pitcherRows(name);
  const types=[...new Set(rs.map(r=>r.Pitch))];
  const dates=[...new Set(rs.map(r=>r.Date))].sort((a,b)=>new Date("20"+a.split(".").reverse().join("-"))-new Date("20"+b.split(".").reverse().join("-")));
  const sets=[];
  types.forEach(pt=>{const avg=dates.map(d=>{const sub=rs.filter(r=>r.Pitch===pt&&r.Date===d);return sub.length?+mean(sub.map(r=>r[mk])).toFixed(1):null;});
    sets.push({label:pt,data:avg,borderColor:PT[pt].c,backgroundColor:PT[pt].c,tension:.3,spanGaps:true,pointRadius:5,borderWidth:3});});
  newChart("seasonChart",{type:"line",data:{labels:dates,datasets:sets},
    options:{plugins:{legend:{position:"top"},title:{display:true,text:name+" · "+METRIC_LBL[$("#tMetric").value]}},
      scales:{y:{title:{display:true,text:METRIC_LBL[$("#tMetric").value]}}}}});
}
function refreshGameControls(){
  const name=$("#tPitcher").value, rs=pitcherRows(name);
  const dates=[...new Set(rs.map(r=>r.Date))];
  fill($("#gDate"),dates);
  const types=[...new Set(rs.map(r=>r.Pitch))];
  fill($("#gPitch"),types);
}
function renderDecay(){
  const name=$("#tPitcher").value, mk=METRIC_KEY[$("#gMetric").value], date=$("#gDate").value, pt=$("#gPitch").value;
  let rs=pitcherRows(name).filter(r=>r.Date===date&&r.Pitch===pt).sort((a,b)=>a.seq-b.seq);
  const pts=rs.map((r,i)=>({x:i+1,y:r[mk]}));
  const sets=[{label:pt,data:pts,backgroundColor:(PT[pt]||{c:"#2ECC71"}).c,pointRadius:5,showLine:false}];
  if(pts.length>=3){const n=pts.length,sx=pts.reduce((s,p)=>s+p.x,0),sy=pts.reduce((s,p)=>s+p.y,0),sxx=pts.reduce((s,p)=>s+p.x*p.x,0),sxy=pts.reduce((s,p)=>s+p.x*p.y,0);
    const m=(n*sxy-sx*sy)/(n*sxx-sx*sx||1),b=(sy-m*sx)/n;
    sets.push({type:"line",label:"Trend",data:[{x:1,y:b+m},{x:n,y:b+m*n}],borderColor:"#1b4332",borderWidth:2,pointRadius:0});}
  newChart("decayChart",{type:"scatter",data:{datasets:sets},
    options:{plugins:{legend:{display:false},title:{display:true,text:pt+" · "+date}},
      scales:{x:{title:{display:true,text:"Pitch sequence in game"}},y:{title:{display:true,text:METRIC_LBL[$("#gMetric").value]}}}}});
}

/* ==================== CATCHING: FRAMING ==================== */
const COUNT_WOBA={"0-0":.385,"0-1":.353,"0-2":.166,"1-0":.385,"1-1":.357,"1-2":.182,"2-0":.406,"2-1":.386,"2-2":.192,"3-0":.669,"3-1":.556,"3-2":.374};
function renderFraming(){
  const name=$("#fCatcher").value, ph=$("#fPHand").value, bh=$("#fBHand").value;
  let rs=ROWS.filter(r=>r.Catcher===name&&["StrikeCalled","BallCalled"].includes(r.PitchCall));
  if(ph!=="All")rs=rs.filter(r=>r.PitcherThrows===ph);
  if(bh!=="All")rs=rs.filter(r=>r.BatterSide===bh);
  const cx=150,cy=175,zx=70,zy=90;
  let s=`<rect width="300" height="340" fill="#fff"/>`;
  s+=`<rect x="${cx-zx}" y="${cy-zy}" width="${zx*2}" height="${zy*2}" fill="none" stroke="#111" stroke-width="2.5"/>`;
  s+=`<polygon points="${cx-24},${cy+zy+30} ${cx+24},${cy+zy+30} ${cx+24},${cy+zy+42} ${cx},${cy+zy+52} ${cx-24},${cy+zy+42}" fill="#fff" stroke="#111"/>`;
  let stolen=0,lost=0,wSaved=0,wCost=0;
  rs.forEach(r=>{const actual=(r.inZone)?"Strike":"Ball";const called=r.PitchCall==="StrikeCalled"?"Strike":"Ball";
    const x=cx+r.PlateLocSide*zx/0.83, y=cy-(r.PlateLocHeight-2.5)*zy/1.0;
    const c=r.Balls+"-"+r.Strikes; const wIfB=COUNT_WOBA[Math.min(r.Balls+1,3)+"-"+r.Strikes]||COUNT_WOBA[c]||.35; const wIfS=COUNT_WOBA[r.Balls+"-"+Math.min(r.Strikes+1,2)]||0;
    const impact=(wIfB-wIfS);
    if(actual==="Ball"&&called==="Strike"){stolen++;wSaved+=impact;s+=`<path d="M ${x} ${y-6} L ${x+2} ${y-1} L ${x+7} ${y-1} L ${x+3} ${y+2} L ${x+4} ${y+7} L ${x} ${y+4} L ${x-4} ${y+7} L ${x-3} ${y+2} L ${x-7} ${y-1} L ${x-2} ${y-1} Z" fill="#2ECC71" stroke="#0b6b2f" stroke-width=".6"/>`;}
    else if(actual==="Strike"&&called==="Ball"){lost++;wCost+=impact;s+=`<line x1="${x-5}" y1="${y-5}" x2="${x+5}" y2="${y+5}" stroke="#d64545" stroke-width="2.4"/><line x1="${x-5}" y1="${y+5}" x2="${x+5}" y2="${y-5}" stroke="#d64545" stroke-width="2.4"/>`;}
    else {const col=actual==="Strike"?"#2ECC71":"#3498DB"; s+=`<circle cx="${x}" cy="${y}" r="3" fill="${col}" opacity=".35"/>`;}
  });
  $("#frameSvg").innerHTML=s;
  $("#frameLegend").innerHTML=`<label><span class="swatch" style="background:#2ECC71"></span>Stolen strike</label><label><span class="swatch" style="background:#d64545"></span>Lost strike</label><label><span class="swatch" style="background:#3498DB;opacity:.5"></span>Correct ball</label>`;
  const net=stolen-lost, wPer=(wSaved-wCost)/Math.max(rs.length,1);
  const col=wPer>0?"#2f9e44":"#d64545";
  $("#frameMetrics").innerHTML=`
    <div class="mcard" style="border-top:4px solid ${col};margin-bottom:12px;"><div class="v" style="color:${col}">${wPer.toFixed(4)}</div><div class="l">Avg wOBA saved per pitch</div></div>
    <div class="metrics4" style="grid-template-columns:1fr 1fr;gap:12px;">
      <div class="mcard"><div class="v" style="color:#2f9e44">${stolen}</div><div class="l">Stolen strikes</div></div>
      <div class="mcard"><div class="v" style="color:#d64545">${lost}</div><div class="l">Lost strikes</div></div>
      <div class="mcard"><div class="v" style="color:${net>=0?'#2f9e44':'#d64545'}">${net>=0?'+':''}${net}</div><div class="l">Net frames</div></div>
      <div class="mcard"><div class="v">${rs.length}</div><div class="l">Called pitches</div></div>
    </div>
    <table class="dtable-lite" style="margin-top:12px;"><tbody>
      <tr><td class="l">Total wOBA saved</td><td class="good">${wSaved.toFixed(3)}</td></tr>
      <tr><td class="l">Total wOBA cost</td><td class="bad">${wCost.toFixed(3)}</td></tr>
      <tr><td class="l"><b>Net impact</b></td><td style="font-weight:700;color:${col}">${(wSaved-wCost).toFixed(3)}</td></tr>
    </tbody></table>`;
}

/* ==================== tabs + init ==================== */
function wireTabs(){
  $$("#mainTabs .tab2").forEach(t=>t.addEventListener("click",()=>{
    $$("#mainTabs .tab2").forEach(x=>x.classList.remove("active"));$$(".pane2").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");document.getElementById(t.dataset.pane).classList.add("active");
    Object.values(charts).forEach(c=>c.resize&&c.resize());}));
  $$(".subtabs").forEach(g=>g.querySelectorAll(".subtab").forEach(st=>st.addEventListener("click",()=>{
    g.querySelectorAll(".subtab").forEach(x=>x.classList.remove("active"));
    const par=g.closest(".pane2");par.querySelectorAll(".subpane").forEach(x=>x.classList.remove("active"));
    st.classList.add("active");document.getElementById(st.dataset.sub).classList.add("active");
    Object.values(charts).forEach(c=>c.resize&&c.resize());})));
}
document.addEventListener("DOMContentLoaded",()=>{
  wireTabs();
  const hn=HITTERS.map(h=>h.name), pn=PITCHERS.map(p=>p.name), cn=CATCHERS.map(c=>c.name);
  // hitting
  $("#htHand").onchange=renderHitTable; $("#htMinPa").onchange=renderHitTable; renderHitTable();
  fill($("#mHitter"),hn);["#mHitter","#mThrows","#mHitType"].forEach(id=>$(id).onchange=renderMatchup);renderMatchup();
  fill($("#zHitter"),hn);["#zHitter","#zThrows","#czMetric","#cvMetric"].forEach(id=>$(id).onchange=renderZone);renderZone();
  // pitching
  ["#ptHand","#ptCount","#ptMin"].forEach(id=>$(id).onchange=renderPitTable);renderPitTable();
  fill($("#aPitcher"),pn);$("#aPitcher").onchange=renderArsenal;renderArsenal();
  fill($("#sPitcher"),pn);$("#sPitcher").onchange=renderSitu;renderSitu();
  fill($("#lPitcher"),pn);$("#lPitcher").onchange=renderLoc;renderLoc();
  fill($("#tPitcher"),pn);$("#tPitcher").onchange=()=>{refreshGameControls();renderSeason();renderDecay();};
  $("#tMetric").onchange=renderSeason;
  refreshGameControls();["#gDate","#gPitch","#gMetric"].forEach(id=>$(id).onchange=renderDecay);
  renderSeason();renderDecay();
  // catching
  fill($("#fCatcher"),cn);["#fCatcher","#fPHand","#fBHand"].forEach(id=>$(id).onchange=renderFraming);renderFraming();
});
