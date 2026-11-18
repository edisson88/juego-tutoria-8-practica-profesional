// Motor compartido (idéntico en lider/ y tribunal/). El contenido vive en story.js (window.GAME).
// Se guarda solo el historial de decisiones; puntos, variables, escena y progreso se derivan de la historia.
const G=window.GAME,N=G.chapters.length,PER=100,MAX=N*PER,LOW=70,VMAX=6,MIN_CH=40,MIN_WORDS=8;
const saveKey='tutoria8-'+G.id+'-v2',oldKey='tutoria8-'+G.id+'-visual-v1';
const main=document.getElementById('main');
document.title=G.title;document.getElementById('brand-title').textContent=G.title;document.getElementById('brand-icon').textContent=G.icon;
let storageWorks=true,run=null,d=null,incompatible=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=v=>Math.max(0,Math.min(VMAX,v));

/* ---------- estado derivado ---------- */
function pickScene(ch,st,prevOpt){const c=G.chapters[ch];return c.pick?c.pick(st):(prevOpt?.to||Object.keys(c.scenes)[0]);}
// Devuelve null si el historial no es coherente con la historia actual.
function derive(history){
  let st={...G.vars},score=0,prev=null;const items=[];
  for(let i=0;i<history.length;i++){
    const h=history[i],c=G.chapters[i];if(!c||!h||typeof h.scene!=='string')return null;
    if(pickScene(i,st,prev)!==h.scene)return null;
    const o=c.scenes[h.scene]?.options[h.selected];if(!o||!(h.variant===0||h.variant===1))return null;
    if(i<history.length-1&&!h.collected)return null; // solo el último puede estar sin reclamar
    if(h.collected&&o.score<PER&&!validReflection(h.reflection))return null;
    for(const k in o.fx)st[k]=clamp(st[k]+o.fx[k]);
    score+=o.score;prev=o;
    items.push({i,h,o,c,title:c.title,scene:c.scenes[h.scene],event:o.ev[h.variant],score:o.score,st:{...st}});
  }
  const last=items.at(-1),pending=!!last&&!last.h.collected,ch=history.filter(h=>h.collected).length;
  const node=ch<N?pickScene(ch,st,pending?null:prev):null;
  return{st,score,items,pending,ch,node,done:ch>=N};
}
function save(){try{localStorage.setItem(saveKey,JSON.stringify({v:2,history:run.history}));}catch{storageWorks=false;}}
function load(){
  let raw=null;try{raw=localStorage.getItem(saveKey);}catch{}
  if(raw){try{const x=JSON.parse(raw);if(x?.v===2&&Array.isArray(x.history)&&x.history.length<=N){const dd=derive(x.history);if(dd){run={history:x.history};d=dd;return;}}}catch{}incompatible=true;return;}
  try{if(localStorage.getItem(oldKey))incompatible=true;}catch{}
}
function fresh(){run={history:[]};d=derive([]);incompatible=false;save();}
const count=()=>d?d.items.filter(x=>x.h.collected).length:0;

/* ---------- vistas ---------- */
function header(){document.getElementById('xp').textContent='★ '+(d?.score||0)+' XP';document.getElementById('seals').textContent=count()+'/'+N+' sellos';}
function view(html){main.innerHTML=html+'<p class="footer">Tutoría 8 · Psicología · Experiencia formativa. Los personajes y situaciones adicionales son ficticios.</p>';header();window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
function stamps(){return `<div class="stamp-grid">${G.seals.map((s,i)=>{const e=d?.items[i]?.h.collected;return `<div class="stamp ${e?'earned':''}"><b aria-hidden="true">${e?G.symbols[i]:'◇'}</b>${s}<span>${e?'Sello reunido':'Por descubrir'}</span></div>`;}).join('')}</div>`;}
function credential(full=false){return `<div class="${full?'credential':'credential-preview'}"><p class="kicker">${full?'Credencial simbólica de aprendizaje':'Tu recompensa final'}</p><h${full?'2':'3'}>${G.credential}</h${full?'2':'3'}><p>${count()}/${N} sellos reunidos</p>${full?stamps():'<p class="muted">Cada capítulo añade una pieza a tu credencial.</p>'}${full?'<small>Recorrido completado · Tutoría 8 · Prácticas Profesionales de Psicología</small><small>Reconocimiento del proceso de aprendizaje. No certifica competencias ni habilita el ejercicio profesional.</small>':''}</div>`;}
function meters(){const st=d?.st||G.vars;return `<div class="meters"><p class="kicker">Recursos de la simulación</p>${Object.entries(G.varLabels).map(([k,l])=>`<div class="meter"><span>${l}</span><b aria-label="${st[k]} de ${VMAX}">${'●'.repeat(st[k])}${'○'.repeat(VMAX-st[k])}</b></div>`).join('')}<small>Recursos ficticios del juego; no miden a personas ni son una medición psicológica.</small></div>`;}

function landing(){
  const active=run?.history.length>0;
  view(`${incompatible?`<section class="panel notice" role="alert"><h2>Partida anterior no compatible</h2><p>Este navegador guarda una partida de una versión anterior (tres capítulos) o con datos que no coinciden con la versión actual de ${N} capítulos. No se ha borrado nada, pero no se puede continuar.</p><div class="buttons"><button onclick="confirmRestart()">Empezar una nueva partida</button></div></section>`:''}<section class="panel hero"><img src="scene.png" alt="${esc(G.alt)}"><div class="hero-copy"><p class="kicker">Una historia. Tu propio recorrido.</p><h1>${G.subtitle}</h1><p>${G.intro}</p><div class="buttons"><button onclick="begin()">${active?'Continuar mi partida':'Aceptar la misión'} →</button><button class="secondary" onclick="dashboard()">Explorar mi ruta</button></div><p><small>${N} capítulos · decisiones ramificadas · ${N} sellos · duración estimada ${G.minutes} (por confirmar con pilotaje)</small></p></div></section><section class="panel intro-strip"><div><p class="kicker">Un propósito compartido</p><h2>${G.title}</h2><p>${G.guide}</p></div><div class="strip-cred">${credential()}</div></section>`);
}
function begin(){if(incompatible){confirmRestart();return;}if(!run)fresh();if(run.history.length){dashboard();return;}showIntroduction();}
function dashboard(){
  const items=d?.items||[],done=count(),ch=d?.ch||0;
  view(`<section class="panel"><p class="kicker">${G.journey}</p><h1 style="font-size:34px">Tu ruta de decisiones</h1><p>Cada capítulo se abre con las consecuencias de lo que elegiste. Reúne los ${N} sellos y construye tu credencial.</p><div class="grid">${G.chapters.map((c,i)=>{const it=items[i],collected=it?.h.collected,unclaimed=it&&!collected,current=d?(!d.done&&i===ch&&!unclaimed):i===0,locked=!it&&!current;
    const txt=collected?'Capítulo completado. Tu decisión dejó una huella.':unclaimed?'Tu sello está esperando ser revelado.':current?'Listo para continuar tu historia.':locked?'Se abre después del capítulo anterior.':'';
    const act=collected?`reviewChapter(${i})`:unclaimed?`revealReward(${i})`:d?'question()':'begin()';
    return `<article class="tile ${current||unclaimed?'active':''} ${locked?'locked':''}"><span class="num">${collected?'✓':locked?'⌑':i+1}</span><h3>${c.title}</h3><p>${txt}</p><button ${locked?'disabled':''} ${locked?'':`onclick="${act}"`}>${collected?'Revisar mi huella':unclaimed?'Revelar sello':locked?'Bloqueado':'Explorar'} ${locked?'':'→'}</button></article>`;}).join('')}</div></section><div class="row"><section class="panel"><p class="kicker">Tu colección</p><h2>Sellos de aprendizaje</h2>${stamps()}<small>Un sello reconoce el recorrido, incluso cuando hay aspectos por fortalecer.</small></section><section class="panel"><p class="kicker">Una meta que toma forma</p>${credential()}${meters()}<div class="buttons"><button ${done<N?'disabled':''} onclick="finish()">${done<N?`Reúne los ${N} sellos`:'Abrir mi credencial'} →</button></div></section></div>${!storageWorks?'<p class="footer">Este navegador no permite guardar el avance al cerrar la página.</p>':''}`);
}
function question(){
  if(!run)fresh();
  if(d.done){finish();return;}
  renderChapter();if(d.pending)renderFeedback();
}
function shuffled(options){const a=options.map((option,index)=>({option,index}));for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function renderChapter(){
  const idx=d.pending?d.items.length-1:d.ch,c=G.chapters[idx],scene=c.scenes[d.pending?d.items[idx].h.scene:d.node],last=d.items[idx-1];
  const st=d.pending?(d.items[idx-1]?.st||G.vars):d.st;
  const ctx=(scene.ctx||[]).filter(([f])=>f(st)).slice(0,2).map(([,t])=>`<p>${t}</p>`).join('');
  view(`<div class="scene-layout"><section class="panel"><p class="kicker">Capítulo ${idx+1} de ${N} · ${c.name}</p><div class="progress" role="img" aria-label="${idx} de ${N} capítulos completados"><i style="width:${idx/N*100}%"></i></div><img class="chapter-art" src="scene.png" alt="">${last?`<div class="context"><strong>Lo que trajiste hasta aquí</strong><p>${last.event[0]}</p><p>${last.event[1]}</p>${ctx}</div>`:''}<p class="tag">${c.focus}</p><h1 style="font-size:32px">${scene.title||c.title}</h1><p>${scene.text}</p>${scene.added?`<div class="added"><strong>Información añadida por la simulación (ficticia)</strong><p>${scene.added}</p></div>`:''}<div id="choices">${shuffled(scene.options).map(({option:o,index},i)=>`<button class="choice" data-option="${index}" onclick="answer(${index})"><span class="letter">${'ABC'[i]}</span><span>${o.text}</span></button>`).join('')}</div><div id="feedback"></div></section><aside class="panel aside"><p class="kicker">Tu credencial en construcción</p><h3>Una huella por capítulo</h3>${stamps()}${meters()}${G.facts?`<details class="facts"><summary>Hechos originales del caso</summary><ul>${G.facts.map(f=>`<li>${f}</li>`).join('')}</ul><small>Todo lo demás en la historia es información ficticia añadida por la simulación.</small></details>`:''}<button class="secondary" onclick="dashboard()">← Mi ruta</button></aside></div>`);
}
function answer(choice){
  if(!run||d.pending||d.done)return; // evita puntuar dos veces
  const c=G.chapters[d.ch],o=c.scenes[d.node].options[choice];if(!o)return;
  const p=o.p||[70,30];
  run.history.push({scene:d.node,selected:choice,variant:Math.random()*100<p[0]?0:1,collected:false});
  d=derive(run.history);save();renderFeedback();header();
}
function renderFeedback(){
  const it=d.items.at(-1),o=it.o,p=o.p||[70,30],good=it.score>=LOW;
  document.querySelectorAll('.choice').forEach(b=>{b.disabled=true;if(Number(b.dataset.option)===it.h.selected)b.classList.add('chosen',...(good?[]:['review']));});
  const need=needsReflection(it.h);
  document.getElementById('feedback').innerHTML=`<div class="feedback ${good?'':'warn'}"><p class="kicker">${good?'Decisión fundamentada':'Una oportunidad para replantear'} · +${it.score} de ${PER} XP</p><h3>Tu historia acaba de cambiar</h3><p>${it.event[0]}</p><p><strong>Nuevo contexto:</strong> ${it.event[1]}</p><p><strong>Aprendizaje:</strong> ${o.why}</p><details><summary>Sobre el azar de esta escena</summary><small>Dos variantes de contexto con probabilidades de diseño: ${p[0]} % y ${p[1]} % (suman 100 %). No son predicciones sobre personas. Los puntos dependen solo de tu decisión.</small></details><div class="buttons"><button onclick="revealReward(${it.i})">${need?'✎ Reflexionar para liberar sello':'✦ Revelar mi sello'}</button></div></div>`;
  document.getElementById('feedback').scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ---------- sellos y reflexión ---------- */
function validReflection(t){const c=(t||'').trim();return c.length>=MIN_CH&&c.split(/\s+/).length>=MIN_WORDS;}
function needsReflection(h){const it=d.items.find(x=>x.h===h);return it.score<PER&&!validReflection(h.reflection);}
function revealReward(i){
  const it=d.items[i];if(!it)return;
  if(needsReflection(it.h)){showReflection(i);return;}
  const dialog=document.getElementById('reward');
  dialog.innerHTML=`<div class="sparkles" aria-hidden="true">✧ ✦ ✧</div><div class="award" aria-hidden="true">${G.symbols[i]}</div><p class="kicker">Una pieza más de tu recorrido</p><h2 id="reward-title">Sello de ${G.seals[i]}</h2><p>Completaste el capítulo ${i+1} y revisaste sus consecuencias.</p><div class="journal"><strong>${it.score>=LOW?'Criterio puesto en práctica':'Criterio para seguir fortaleciendo'}</strong><p>${it.o.why}</p></div><p>Este sello se incorpora a tu credencial de aprendizaje.</p><button onclick="claimSeal(${i})">${it.h.collected?'Volver a mi ruta':'Añadir a mi credencial'} →</button>`;
  dialog.showModal();
}
// Única función que marca un sello como reunido.
function claimSeal(i){
  const dialog=document.getElementById('reward'),it=d.items[i];
  if(!it||i!==d.items.length-1&&!it.h.collected)return;
  if(!it.h.collected){
    if(needsReflection(it.h)){showReflection(i);return;}
    it.h.collected=true;save();d=derive(run.history);
    document.getElementById('live').textContent='Sello de '+G.seals[i]+' añadido a tu colección.';
  }
  dialog.close();
  if(d.done){finish();return;}
  dashboard();
}
function showReflection(i){
  const it=d.items[i],h=it.h,dialog=document.getElementById('reward');
  dialog.innerHTML=`<div class="award" aria-hidden="true">✎</div><p class="kicker">Una pausa para aprender</p><h2 id="reward-title">Reflexiona para liberar tu sello</h2><p>Tu decisión obtuvo ${it.score} de ${PER} XP. Puedes transformar lo ocurrido en aprendizaje antes de recoger el sello. La reflexión no cambia tu puntuación.</p><div class="journal"><strong>Elegiste</strong><p>${it.o.text}</p><strong>Un criterio para tu reflexión</strong><p>${it.o.why}</p></div><form id="reflection-form"><label for="reflection-text" class="rlabel">${it.c.reflect}</label><textarea id="reflection-text" rows="5" maxlength="1500" aria-describedby="reflection-help reflection-count" required></textarea><p id="reflection-help">Escribe una reflexión breve: al menos ${MIN_CH} caracteres y ${MIN_WORDS} palabras. No incluyas nombres ni datos de personas reales. Se guarda solo en este navegador; no se envía a la docente ni se evalúa automáticamente su contenido.</p><p id="reflection-count" aria-live="polite"></p><button id="reflection-submit" type="submit" disabled>Guardar reflexión y liberar sello →</button></form>`;
  const field=dialog.querySelector('#reflection-text'),button=dialog.querySelector('#reflection-submit'),cnt=dialog.querySelector('#reflection-count');
  field.value=h.reflection||'';
  const update=()=>{h.reflection=field.value;save();const t=field.value.trim(),w=t?t.split(/\s+/).length:0;button.disabled=!validReflection(field.value);cnt.textContent=button.disabled?`${t.length}/${MIN_CH} caracteres mínimos · ${w}/${MIN_WORDS} palabras mínimas`:'Tu reflexión está lista para guardarse.';};
  field.addEventListener('input',update);
  dialog.querySelector('#reflection-form').addEventListener('submit',e=>{e.preventDefault();if(!validReflection(field.value)){field.focus();return;}h.reflection=field.value.trim();save();revealReward(i);});
  update();if(!dialog.open)dialog.showModal();field.focus();
}
function reviewChapter(i){
  const it=d.items[i],dialog=document.getElementById('reward');
  dialog.innerHTML=`<p class="kicker">Capítulo ${i+1} · Tu huella</p><h2 id="reward-title">${it.title}</h2><div class="journal"><strong>Elegiste</strong><p>${it.o.text}</p><strong>Lo que ocurrió</strong><p>${it.event[0]}</p><p>${it.event[1]}</p><strong>Aprendizaje</strong><p>${it.o.why}</p><div id="refl"></div></div><button onclick="document.getElementById('reward').close()">Volver a mi ruta</button>`;
  if(it.h.reflection){const p=document.createElement('p');p.className='student';p.textContent='Tu reflexión: '+it.h.reflection; // textContent: texto del estudiante nunca como HTML
    dialog.querySelector('#refl').appendChild(p);}
  dialog.showModal();
}

/* ---------- desenlace ---------- */
function outcome(){
  const items=d.items,low=items.filter(x=>x.score<LOW).length,crit=items.filter(x=>x.score===0).length;
  const last3=items.slice(-3).reduce((a,x)=>a+x.score,0)/3,early=items.slice(0,N-3).filter(x=>x.score<LOW).length;
  const axes=G.axes.map(a=>{const v=a.chapters.map(i=>items[i].score),avg=v.reduce((x,y)=>x+y,0)/v.length;return{...a,avg};});
  return G.ending({items,score:d.score,st:d.st,low,crit,last3,early,recovered:early>=2&&last3>=85,lastScore:items.at(-1).score,axes});
}
function finish(){
  if(!d||d.items.filter(x=>x.h.collected).length!==N){dashboard();return;} // exige los N sellos
  const e=outcome();
  view(`<section class="panel"><p class="kicker">Desenlace de tu historia</p><h1>${e.title}</h1><p>${e.text}</p><p><small>${G.endingNote}</small></p></section><div class="final-grid"><section class="panel"><p class="kicker">La huella de tus decisiones</p><h2>${d.score} / ${MAX} XP · ${N} capítulos vividos</h2><h3>${G.axesTitle}</h3>${e.axes.map(a=>`<div class="journal"><strong>${a.label}: ${a.avg>=85?'visible en tu recorrido':'por fortalecer'}</strong><p>${a.action}</p></div>`).join('')}<h3>Bitácora</h3>${d.items.map((x,i)=>`<details class="journal"><summary><strong>${i+1}. ${x.title}</strong> · ${x.score} XP</summary><p>Elegiste: ${x.o.text}</p><p>${x.o.effect}</p><small>${x.o.why}</small>${x.h.reflection?'<p class="student" data-r="'+i+'"></p>':''}</details>`).join('')}<p>${G.closing}</p><div class="buttons"><button class="secondary" onclick="dashboard()">Mi colección</button><button onclick="confirmRestart()">Explorar otra ruta</button></div></section><section class="panel"><div id="credential-area">${credential(true)}</div><div class="buttons"><button onclick="printCredential()">Imprimir mi credencial</button></div><small>Puedes guardarla como PDF desde el diálogo de impresión del navegador.</small></section></div>`);
  main.querySelectorAll('.student[data-r]').forEach(p=>{p.textContent='Tu reflexión: '+d.items[p.dataset.r].h.reflection;});
}
function printCredential(){document.getElementById('print-wrapper')?.remove();const w=document.createElement('div');w.id='print-wrapper';w.style.display='none';w.innerHTML=credential(true);main.appendChild(w);window.print();}

/* ---------- reinicio e introducción ---------- */
function confirmRestart(){if(!run&&!incompatible){fresh();showIntroduction();return;}document.getElementById('restart').showModal();}
function restartGame(){document.getElementById('restart').close();try{localStorage.removeItem(oldKey);}catch{}fresh();showIntroduction();}
function showIntroduction(){
  document.getElementById('role-introduction')?.remove();
  const x=G.introduction,dialog=document.createElement('dialog');dialog.id='role-introduction';dialog.setAttribute('aria-labelledby','intro-title');
  dialog.innerHTML=`<div style="font-size:35px" aria-hidden="true">${x.icon}</div><p class="kicker">ANTES DE COMENZAR</p><h2 id="intro-title">${x.title}</h2><p>${x.role}</p><p class="focus">${x.focus}</p><h3>Cómo jugar</h3><ol>${x.steps.map(s=>`<li>${s}</li>`).join('')}</ol><button id="intro-start">Comprendido, comenzar la historia</button>`;
  document.body.appendChild(dialog);
  dialog.querySelector('#intro-start').addEventListener('click',()=>{dialog.close();dialog.remove();question();});
  dialog.addEventListener('cancel',()=>dialog.remove());dialog.showModal();
}

load();landing();
