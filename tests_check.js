// Verificación estructural y de flujo (Node, sin dependencias): node tests_check.js
const vm=require('vm'),fs=require('fs'),assert=require('assert');
function mkEnv(dir,store){
  const els={};const el=id=>els[id]||(els[id]={id,innerHTML:'',textContent:'',dataset:{},open:false,classList:{add(){}},style:{},showModal(){this.open=true},close(){this.open=false},remove(){},querySelector(){return el('q')},querySelectorAll(){return[]},addEventListener(){},appendChild(){},focus(){},scrollIntoView(){},setAttribute(){},value:''});
  const doc={getElementById:el,querySelectorAll(){return[]},body:{dataset:{game:dir==='lider'?'lead':'ethics'},appendChild(){}},createElement:()=>el('c'+Math.random()),title:''};
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
  const win={scrollTo(){}};const calls=[];const ctx={URLSearchParams,window:win,document:doc,localStorage:ls,Math,JSON,console,print(){},fetch:(u,o)=>{calls.push({u,b:String(o.body)});return Promise.resolve();},calls};win.window=win;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(dir+'/story.js','utf8'),ctx);
  // game.js usa const/let de nivel superior: se añade al final un acceso para pruebas
  vm.runInContext(fs.readFileSync(dir+'/game.js','utf8')+';this.__t={get run(){return run},get d(){return d},get incompat(){return incompatible},derive,answer,claimSeal,participant,begin,register,revealReward,fresh,load,validReflection,needsReflection,N,G,finish,outcome};',ctx);
  ctx.__t.calls=calls;return ctx.__t;
}
for(const dir of ['lider','tribunal']){
  const store={};const T=mkEnv(dir,store),G=T.G,N=T.N;
  assert.strictEqual(N,10);
  // ---- participante: sin datos begin() pide el popup y no inicia partida; con datos guardados se reutilizan ----
  assert.strictEqual(T.participant(),null);T.begin();assert.strictEqual(T.run,null,'begin sin participante no debe iniciar partida');
  store['tutoria8-participante-v1']=JSON.stringify({name:'Ana Pérez',doc:'1234567'});
  assert.deepStrictEqual({...T.participant()},{name:'Ana Pérez',doc:'1234567'});
  store['tutoria8-participante-v1']='{roto';assert.strictEqual(T.participant(),null);delete store['tutoria8-participante-v1'];
  // ---- pre-registro: se envía una sola vez por juego, con los campos exactos del Google Form ----
  store['tutoria8-participante-v1']=JSON.stringify({name:'Ana Pérez',doc:'1234567',sent:{}});
  T.register();T.register();
  assert.strictEqual(T.calls.length,1,'doble llamada inmediata debe enviar una sola vez');
  const call=T.calls[0];assert(call.u.endsWith('/formResponse'));
  const q=new URLSearchParams(call.b);assert.strictEqual(q.get('entry.1876723815'),G.formGame);assert.strictEqual(q.get('entry.1609183475'),'Ana Pérez');assert.strictEqual(q.get('entry.2035151280'),'1234567');
  assert(['Líder transformacional','Tribunal de decisiones éticas'].includes(G.formGame));
  delete store['tutoria8-participante-v1'];
  // ---- grafo: recorrer todas las rutas (3^10) ----
  const reached=new Set();let paths=0,maxScore=0,minScore=1e9;const endings={};
  (function walk(ch,st,prev,score,low){
    if(ch===N){paths++;maxScore=Math.max(maxScore,score);minScore=Math.min(minScore,score);return;}
    const c=G.chapters[ch],key=c.pick?c.pick(st):(prev?.to||Object.keys(c.scenes)[0]);
    const sc=c.scenes[key];assert(sc,`${dir} cap ${ch+1}: escena '${key}' inexistente`);
    reached.add(ch+':'+key);assert.strictEqual(sc.options.length,3);
    assert(sc.options.some(o=>o.score===100),`${dir} cap ${ch+1}/${key} sin 100`);
    for(const o of sc.options){
      assert(o.score>=0&&o.score<=100);const p=o.p||[70,30];assert.strictEqual(p[0]+p[1],100);
      assert.strictEqual(o.ev.length,2);o.ev.forEach(e=>assert(e.length===2&&e.every(x=>typeof x==='string'&&x)));
      if(!c.pick&&ch<N-1&&G.chapters[ch+1].pick===undefined)assert(o.to&&G.chapters[ch+1].scenes[o.to],`${dir} cap ${ch+1}: 'to' inválido`);
      const s2={...st};for(const k in o.fx){assert(k in s2,'var desconocida '+k);s2[k]=Math.max(0,Math.min(6,s2[k]+o.fx[k]));}
      walk(ch+1,s2,o,score+o.score,low);
    }
  })(0,{...G.vars},null,0,0);
  let defined=0;G.chapters.forEach((c,i)=>Object.keys(c.scenes).forEach(k=>{defined++;assert(reached.has(i+':'+k),`${dir}: escena inalcanzable ${i+1}:${k}`);}));
  assert.strictEqual(G.seals.length,N);assert.strictEqual(G.symbols.length,N);
  assert.strictEqual(paths,Math.pow(3,N));
  const covered=new Set(G.axes.flatMap(a=>a.chapters));assert.strictEqual(covered.size,N);
  console.log(dir,'OK grafo:',paths,'rutas de 10 decisiones;',defined,'escenas, todas alcanzables; puntos',minScore,'-',maxScore);

  // ---- flujo: mejor ruta, sellos, reflexión, recarga ----
  const play=(T,pickIdx,reflect)=>{
    while(!T.d.done){
      const c=T.G.chapters[T.d.ch],sc=c.scenes[T.d.node];const idx=pickIdx(sc.options,T.d.ch);
      T.answer(idx);const before=T.d.score;T.answer(0); // segunda respuesta ignorada
      assert.strictEqual(T.d.score,before,'doble puntuación');
      const it=T.d.items.at(-1);
      if(it.score<100){
        T.claimSeal(it.i);assert(!T.d.items.at(-1).h.collected,'sello sin reflexión');
        it.h.reflection='corto';T.revealReward(it.i);T.claimSeal(it.i);assert(!T.d.items.at(-1).h.collected,'reflexión corta');
        assert(!T.validReflection('una dos tres cuatro cinco seis siete'));assert(!T.validReflection('a '.repeat(8)));
        it.h.reflection=reflect;
      }
      T.claimSeal(it.i);assert(T.d.items.at(-1).h.collected);
    }
  };
  T.fresh();
  play(T,(o)=>o.findIndex(x=>x.score===100),'x');
  assert.strictEqual(T.d.score,1000);assert.strictEqual(T.d.items.length,10);
  T.finish();console.log(dir,'OK ruta perfecta: 1000 XP,',T.outcome().title);
  // recarga tras reclamar
  const T2=mkEnv(dir,store);assert(T2.d&&T2.d.done&&T2.d.score===1000,'recarga completa');
  // ruta con errores y recuperación + reflexión, recarga a mitad y con sello pendiente
  const s2={};const T3=mkEnv(dir,s2);T3.fresh();
  const R='Cambiaría mi decisión para escuchar primero y consultar con apoyo del equipo.';
  let i=0;
  while(!T3.d.done){
    const sc=T3.G.chapters[T3.d.ch].scenes[T3.d.node];const bad=T3.d.ch<4;
    const idx=sc.options.findIndex(x=>bad?x.score===Math.min(...sc.options.map(y=>y.score)):x.score===100);
    T3.answer(idx);
    const T4=mkEnv(dir,s2);assert.strictEqual(T4.d.pending,true);assert.strictEqual(T4.d.score,T3.d.score,'recarga con sello pendiente');
    const it=T3.d.items.at(-1);if(it.score<100){T3.claimSeal(it.i);assert(!T3.d.items.at(-1).h.collected);it.h.reflection=R;}
    T3.claimSeal(it.i);
    const T5=mkEnv(dir,s2);assert.strictEqual(T5.d.ch,T3.d.ch,'recarga tras sello');
  }
  const out=T3.outcome();console.log(dir,'OK ruta con recuperación:',T3.d.score,'XP →',out.title);
  // credencial exige N sellos
  const s3={};const T6=mkEnv(dir,s3);T6.fresh();T6.answer(0);T6.finish();assert(!T6.d.done);
  // manipulación: sello marcado sin reflexión → partida rechazada
  const bad=JSON.parse(s2['tutoria8-'+G.id+'-v2']);const k=bad.history.findIndex(h=>{const o=G.chapters[bad.history.indexOf(h)].scenes[h.scene].options[h.selected];return o.score<100});
  delete bad.history[k].reflection;const s4={['tutoria8-'+G.id+'-v2']:JSON.stringify(bad)};assert(mkEnv(dir,s4).incompat,'manipulación aceptada');
  // partida antigua v1
  const s5={['tutoria8-'+G.id+'-visual-v1']:'{"node":"fin","history":[1,2,3],"score":300}'};const T7=mkEnv(dir,s5);assert(T7.incompat&&T7.run===null);assert(s5['tutoria8-'+G.id+'-visual-v1'],'v1 borrada');
  console.log(dir,'OK doble puntuación, reflexión, recarga, credencial, v1 incompatible sin borrar');
}
// datos independientes
console.log('claves distintas:',['lead','ethics'].map(k=>'tutoria8-'+k+'-v2').join(' / '));
