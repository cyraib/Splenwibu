const GEM_META = {
  white: { label: 'White', color: '#e9edf2', asset: 'Assets_Material/Nether_Quartz_JE2_BE2.webp' },
  blue: { label: 'Blue', color: '#4aa3ff', asset: 'Assets_Material/Diamond_JE2_BE2.webp' },
  green: { label: 'Green', color: '#49c88c', asset: 'Assets_Material/Emerald_JE3_BE3.webp' },
  red: { label: 'Red', color: '#f36b72', asset: 'Assets_Material/Gold_Ingot_JE4_BE2.webp' },
  black: { label: 'Black', color: '#77748d', asset: 'Assets_Material/Netherite_Ingot_JE1_BE2.webp' },
  gold: { label: 'Gold', color: '#f7cb58', asset: 'Assets_Material/Prismatic_Shard.png' }
};

const ZOOM_LEVELS = [.85,.90,.95,1,1.05,1.10,1.15,1.20];

function savedZoom(){
  const value=Number(localStorage.getItem('splendor-ui-zoom'));
  return ZOOM_LEVELS.includes(value)?value:1;
}

const cards = [
  {id:83,tier:3,name:'Elysia',img:'Asset_to_use/Tier3/T3_20_Elysia.png',bonus:'red',vp:5,cost:{blue:3,green:7}},
  {id:31,tier:3,name:'Nino Nakano',img:'Asset_to_use/Tier3/T3_18_031_Nino_Nakano.png',bonus:'red',vp:4,cost:{green:7}},
  {id:30,tier:3,name:'Yumeko Jabami',img:'Asset_to_use/Tier3/T3_17_030_Yumeko_Jabami.png',bonus:'red',vp:3,cost:{white:3,blue:3,green:3,black:5}},
  {id:29,tier:3,name:'Reze',img:'Asset_to_use/Tier3/T3_16_029_Reze.png',bonus:'green',vp:5,cost:{green:7,red:3}},
  {id:61,tier:2,name:'Asuka Langley',img:'Asset_to_use/Tier2/T2_21_061_Asuka_Langley_Soryu.png',bonus:'green',vp:2,cost:{blue:2,black:4}},
  {id:59,tier:2,name:'Kanna Kamui',img:'Asset_to_use/Tier2/T2_20_059_Kanna_Kamui.png',bonus:'green',vp:1,cost:{white:2,blue:3,black:2}},
  {id:53,tier:2,name:'Gawr Gura',img:'Asset_to_use/Tier2/T2_18_053_Gawr_Gura.png',bonus:'white',vp:3,cost:{black:6}},
  {id:51,tier:2,name:'Komi Shouko',img:'Asset_to_use/Tier2/T2_16_051_Komi_Shouko.png',bonus:'white',vp:2,cost:{blue:3,red:5}},
  {id:96,tier:1,name:'Chizuru Ichinose',img:'Asset_to_use/Tier1/T1_24_096_Chizuru_Ichinose.png',bonus:'white',vp:1,cost:{green:4}},
  {id:94,tier:1,name:'Fern',img:'Asset_to_use/Tier1/T1_23_094_Fern.png',bonus:'white',vp:0,cost:{green:3}},
  {id:91,tier:1,name:'Ichigo',img:'Asset_to_use/Tier1/T1_22_091_Ichigo.png',bonus:'white',vp:0,cost:{white:2,blue:2}},
  {id:90,tier:1,name:'Hitori Gotou',img:'Asset_to_use/Tier1/T1_21_090_Hitori_Gotou.png',bonus:'white',vp:0,cost:{blue:1,red:2}}
];

const nobles = [
  {name:'Zero Two',img:'Asset_to_use/Nobles/N_01_001_Zero_Two.png',req:{green:4,red:4}},
  {name:'Rem',img:'Asset_to_use/Nobles/N_02_002_Rem.png',req:{blue:4,green:4}},
  {name:'Hatsune Miku',img:'Asset_to_use/Nobles/N_03_003_Hatsune_Miku.png',req:{white:4,blue:4}},
  {name:'Megumin',img:'Asset_to_use/Nobles/N_04_004_Megumin.png',req:{white:4,black:4}},
  {name:'Asuna',img:'Asset_to_use/Nobles/N_05_006_Asuna.png',req:{red:4,black:4}}
];

const opponents = {
  1:{name:'Linh',avatar:'Asset_Raw/Tier 1/085_Ai_Hoshino.png',vp:11,tokens:6,reserved:2,bonuses:{white:3,blue:2,green:4,red:1,black:0},active:false},
  2:{name:'Minh',avatar:'Asset_Raw/Tier 2/039_Yor_Forger.png',vp:8,tokens:8,reserved:1,bonuses:{white:2,blue:3,green:1,red:2,black:2},active:false},
  3:{name:'Lan',avatar:'Asset_Raw/Tier 3/023_Violet_Evergarden.png',vp:13,tokens:5,reserved:0,bonuses:{white:4,blue:2,green:3,red:3,black:1},active:false}
};

const state = {
  playerCount:3,
  zoom:savedZoom(),
  bank:{white:4,blue:4,green:4,red:4,black:4,gold:5},
  selected:{},
  player:{name:'You',vp:9,tokens:{white:3,blue:2,green:4,red:1,black:2,gold:1},bonuses:{white:2,blue:1,green:2,red:1,black:1},reserved:[]},
  owned:7,
  claimedNobles:[],
  focus:null,
  payment:{},
  action:'buy',
  history:[
    {icon:'◇',text:'Lan received the noble Artoria Pendragon.',time:'A moment ago'},
    {icon:'◆',text:'Minh reserved Makima and took 1 Gold.',time:'Turn 17'},
    {icon:'✦',text:'Linh bought Yor Forger for 2 Blue, 1 Red.',time:'Turn 16'},
    {icon:'⬡',text:'You took White, Green and Black.',time:'Turn 15'}
  ]
};

const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const gemStyle = key => `--gem-color:${GEM_META[key].color}`;
const gemImage = (key,className='token-img') => `<img class="${className}" src="${GEM_META[key].asset}" alt="${GEM_META[key].label}">`;
const roman = n => ['','I','II','III'][n];

function paymentCost(card){
  const result={};
  Object.entries(card.cost).forEach(([g,n])=>result[g]=Math.max(0,n-(state.player.bonuses[g]||0)));
  return result;
}

function affordable(card){
  const cost=paymentCost(card); let gold=state.player.tokens.gold;
  return Object.entries(cost).every(([g,n])=>{ const short=Math.max(0,n-state.player.tokens[g]); gold-=short; return gold>=0; });
}

function createCard(card, interactive=true){
  const node=$('#cardTemplate').content.firstElementChild.cloneNode(true);
  node.dataset.id=card.id; node.classList.add('asset-card'); node.classList.toggle('affordable',affordable(card));
  $('.character-art',node).src=card.img; $('.character-art',node).alt=card.name;
  const actual=paymentCost(card);
  $('.card-tooltip',node).innerHTML=`<h4>${card.name}</h4><span>TIER ${roman(card.tier)} · ${card.vp} PRESTIGE · ${GEM_META[card.bonus].label.toUpperCase()} BONUS</span><div class="tooltip-costs"><div><small>ORIGINAL COST</small>${costLines(card.cost)}</div><div><small>YOU PAY</small>${costLines(actual,true)}</div></div>`;
  if(interactive){
    node.addEventListener('click',()=>openCard(card));
    node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(card)}});
    node.addEventListener('pointermove',e=>{const r=node.getBoundingClientRect();node.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*5}deg`);node.style.setProperty('--rx',`${((e.clientY-r.top)/r.height-.5)*-5}deg`)});
    node.addEventListener('pointerleave',()=>{node.style.removeProperty('--ry');node.style.removeProperty('--rx')});
  }
  return node;
}

function costLines(cost, includeZero=false){
  return Object.keys(GEM_META).filter(g=>g!=='gold' && (includeZero ? cost[g]!==undefined : cost[g])).map(g=>`<b>${gemImage(g,'tooltip-gem')}${GEM_META[g].label} ${cost[g]||0}</b>`).join('');
}

function renderMarket(){
  const market=$('#market'); market.innerHTML='';
  [3,2,1].forEach(tier=>{
    const row=document.createElement('div'); row.className=`board-row market-row tier-${tier}`;
    row.innerHTML=`<div class="row-label"><b>${roman(tier)}</b><span></span></div><div class="card-list"></div>`;
    cards.filter(c=>c.tier===tier).forEach(c=>$('.card-list',row).append(createCard(c)));
    market.append(row);
  });
}

function renderNobles(){
  const count=state.playerCount+1; const list=$('#nobleList');list.innerHTML='';
  nobles.slice(0,count).forEach(n=>{
    const el=document.createElement('article');el.className='noble-card finished-noble';el.title=n.name;
    el.innerHTML=`<img src="${n.img}" alt="${n.name}">`;
    list.append(el);
  });
}

function playerSeat(p){
  return `<div class="seat-main"><img class="avatar" src="${p.avatar}" alt=""><div class="seat-info"><strong>${p.name}</strong><span><i class="connection"></i>CONNECTED</span></div><div class="seat-score"><strong>${p.vp}</strong><small>VP</small></div></div><div class="seat-bonuses">${Object.entries(p.bonuses).map(([g,n])=>`<span class="seat-bonus" style="${gemStyle(g)}">${gemImage(g,'seat-gem')}<b>${n}</b></span>`).join('')}</div><div class="seat-foot"><span>Tokens <b>${p.tokens}</b></span><span>Reserved <b>${p.reserved}</b></span></div>`;
}

function renderSeats(){
  $$('.player-seat').forEach(el=>{const p=opponents[el.dataset.player];el.innerHTML=playerSeat(p);el.classList.toggle('active',p.active)});
}

function renderBank(){
  const list=$('#gemList');list.innerHTML='';
  Object.entries(GEM_META).forEach(([g,m])=>{
    const b=document.createElement('button');b.className='gem-token';b.style.cssText=gemStyle(g);b.dataset.gem=g;b.classList.toggle('selected',!!state.selected[g]);
    b.innerHTML=`${gemImage(g,'gem-img')}<b>${state.bank[g]}</b><small>${m.label.toUpperCase()}</small>`;
    b.addEventListener('click',()=>toggleGem(g)); list.append(b);
  });
  renderSelection();
}

function toggleGem(g){
  if(g==='gold') return toast('Gold can only be gained by reserving a card.');
  const distinct=Object.keys(state.selected).length;
  if(state.selected[g]) delete state.selected[g];
  else if(distinct<3) state.selected[g]=1;
  else return toast('Choose up to three different colors.');
  renderBank();
}

function renderSelection(){
  const entries=Object.entries(state.selected); const valid=entries.length===3;
  $('#selectedText').textContent=entries.length?entries.map(([g,n])=>`${GEM_META[g].label} ×${n}`).join('  ·  '):'Choose 3 different colors';
  $('#confirmGems').disabled=!valid;
}

function confirmGems(){
  Object.keys(state.selected).forEach(g=>{state.bank[g]--;state.player.tokens[g]++});
  const names=Object.keys(state.selected).map(g=>GEM_META[g].label);state.history.unshift({icon:'⬡',text:`You took ${names.join(', ')}.`,time:'Just now'});state.selected={};
  renderAll();toast('Gems added to your collection.');
}

function renderLocal(){
  const p=state.player; const root=$('#localPlayer');
  root.innerHTML=`<div class="you-summary"><img class="avatar" src="Asset_Raw/Tier 2/050_Ganyu.png" alt="Your avatar"><div class="you-name"><strong>${p.name}</strong><span><i class="connection"></i> YOUR TURN</span></div><div class="you-score"><strong id="localVp">${p.vp}</strong><small>PRESTIGE</small></div></div><div class="you-resources">${Object.entries(GEM_META).map(([g,m])=>`<div class="resource-chip" style="${gemStyle(g)}" title="${m.label}: ${p.tokens[g]} tokens, ${p.bonuses[g]||0} bonuses">${gemImage(g,'resource-gem')}<strong>${p.tokens[g]}</strong><small>${p.bonuses[g]||0} bonus</small></div>`).join('')}</div><div class="reserved-block"><div class="reserved-title"><span>RESERVED</span><small>${p.reserved.length} / 3</small></div>${[0,1,2].map(i=>{const c=p.reserved[i];return `<div class="reserve-slot ${c?'filled':''}">${c?`<img src="${c.img}" alt="${c.name}"><img class="reserve-preview" src="${c.img}" alt="${c.name} preview">`:''}</div>`}).join('')}</div>`;
}

function openCard(card){state.focus=card;state.payment={};state.action='buy';$('#focusLayer').classList.add('open');$('#focusLayer').setAttribute('aria-hidden','false');renderAction();}
function closeCard(){state.focus=null;$('#focusLayer').classList.remove('open');$('#focusLayer').setAttribute('aria-hidden','true');}

function renderAction(){
  const card=state.focus;if(!card)return;
  const fc=$('#focusCard');fc.innerHTML='';fc.append(createCard(card,false));
  const panel=$('#actionPanel');
  panel.innerHTML=`<span class="eyebrow">SELECTED CARD · TIER ${roman(card.tier)}</span><h2>${card.name}</h2><span class="character-label">${card.vp} Prestige · ${GEM_META[card.bonus].label} permanent bonus</span><div class="action-tabs"><button data-action="buy" class="${state.action==='buy'?'active':''}">BUY CARD</button><button data-action="reserve" class="${state.action==='reserve'?'active':''}">RESERVE</button></div>${state.action==='buy'?buyMarkup(card):reserveMarkup(card)}`;
  $$('[data-action]',panel).forEach(b=>b.onclick=()=>{state.action=b.dataset.action;state.payment={};renderAction()});
  $('[data-auto]',panel)?.addEventListener('click',()=>autoPay(card));
  $$('[data-pay]',panel).forEach(b=>b.onclick=()=>togglePayment(b.dataset.pay));
  $('[data-buy]',panel)?.addEventListener('click',()=>buyCard(card));
  $('[data-reserve]',panel)?.addEventListener('click',()=>reserveCard(card));
  $('[data-cancel]',panel)?.addEventListener('click',closeCard);
}

function buyMarkup(card){
  const cost=paymentCost(card);const valid=paymentValid(card);
  return `<div class="action-section"><small>COST AFTER BONUSES</small><div class="pay-row">${Object.entries(cost).filter(([,n])=>n>0).map(([g,n])=>`<span class="pay-token" style="${gemStyle(g)}">${gemImage(g)}${n}</span>`).join('')||'<span class="payment-status valid">Covered by your permanent bonuses</span>'}</div></div><div class="action-section"><small>CHOOSE PAYMENT · GOLD SUBSTITUTES ANY COLOR</small><div class="pay-row">${Object.entries(GEM_META).map(([g,m])=>`<button class="pay-token ${state.payment[g]?'selected':''}" style="${gemStyle(g)}" data-pay="${g}" ${state.player.tokens[g]<=0?'disabled':''}>${gemImage(g)}${state.payment[g]||0}/${state.player.tokens[g]}</button>`).join('')}</div><div class="payment-status ${valid?'valid':''}">${valid?'Payment ready. Confirm your purchase.':'Select tokens or use Auto Pay.'}</div></div><div class="action-buttons"><button class="secondary" data-auto>AUTO PAY</button><button class="secondary" data-cancel>CANCEL</button><button class="wide" data-buy ${valid?'':'disabled'}>BUY CARD</button></div>`;
}

function reserveMarkup(card){return `<div class="action-section"><small>RESERVE CARD</small><p style="font-size:10px;line-height:1.65;color:#aab9cc">Move this card to your private reserve. You also receive one Gold token while the bank has one available.</p><div class="payment-status ${state.player.reserved.length<3?'valid':''}">${state.player.reserved.length<3?`Reserve slot available · ${Math.max(0,state.bank.gold)} Gold in bank`:'All three reserve slots are full.'}</div></div><div class="action-buttons"><button class="secondary" data-cancel>CANCEL</button><button data-reserve ${state.player.reserved.length>=3?'disabled':''}>RESERVE</button></div>`}

function togglePayment(g){
  const current=state.payment[g]||0;if(current<state.player.tokens[g])state.payment[g]=current+1;else delete state.payment[g];renderAction();
}

function paymentValid(card){
  const cost=paymentCost(card),pay=state.payment;let gold=pay.gold||0;
  if(Object.keys(pay).some(g=>(pay[g]||0)>state.player.tokens[g]))return false;
  for(const [g,n] of Object.entries(cost)){const color=Math.min(pay[g]||0,n);if((pay[g]||0)>n)return false;gold-=n-color;}return gold===0;
}

function autoPay(card){
  const cost=paymentCost(card);state.payment={};let gold=0;
  Object.entries(cost).forEach(([g,n])=>{const amount=Math.min(n,state.player.tokens[g]);if(amount)state.payment[g]=amount;gold+=n-amount});
  if(gold)state.payment.gold=gold;renderAction();
}

function buyCard(card){
  if(!paymentValid(card))return;
  Object.entries(state.payment).forEach(([g,n])=>{state.player.tokens[g]-=n;state.bank[g]+=n});
  state.player.bonuses[card.bonus]++;state.player.vp+=card.vp;state.owned++;state.history.unshift({icon:'✦',text:`You bought ${card.name} and gained a ${GEM_META[card.bonus].label} bonus.`,time:'Just now'});
  const idx=cards.findIndex(c=>c.id===card.id);cards[idx]={...card,id:card.id+500,name:'New Arrival',img:cards[(idx+5)%cards.length].img,vp:Math.max(0,card.vp-1)};
  closeCard();renderAll();toast(`${card.name} joined your tableau · +${card.vp} VP`);setTimeout(()=>{$('#localVp')?.classList.add('pulse')},40);setTimeout(checkNobleVisit,650);
}

function checkNobleVisit(){
  const eligible=nobles.find(n=>!state.claimedNobles.includes(n.name)&&Object.entries(n.req).every(([g,v])=>state.player.bonuses[g]>=v));
  if(!eligible){if(state.player.vp>=15)showVictory();return}
  state.claimedNobles.push(eligible.name);state.player.vp+=3;state.history.unshift({icon:'◇',text:`You received the noble ${eligible.name}.`,time:'Just now'});renderAll();
  $('#ceremonyCard').innerHTML=`<img src="${eligible.img}" alt="${eligible.name}">`;$('#ceremonyLayer').classList.add('open');$('#ceremonyLayer').setAttribute('aria-hidden','false');
  setTimeout(()=>{$('#ceremonyLayer').classList.remove('open');$('#ceremonyLayer').setAttribute('aria-hidden','true');if(state.player.vp>=15)setTimeout(showVictory,350)},1300);
}

function showVictory(){
  $('#victoryVp').textContent=state.player.vp;$('#victoryCards').textContent=state.owned;$('#victoryNobles').textContent=state.claimedNobles.length;
  $('#victoryReason').textContent='Highest prestige wins. A tie is broken by owning fewer development cards.';
  $('#victoryLayer').classList.add('open');$('#victoryLayer').setAttribute('aria-hidden','false');
}

function reserveCard(card){
  if(state.player.reserved.length>=3)return;
  state.player.reserved.push(card);if(state.bank.gold>0){state.bank.gold--;state.player.tokens.gold++}
  state.history.unshift({icon:'◆',text:`You reserved ${card.name} and received 1 Gold.`,time:'Just now'});
  const idx=cards.findIndex(c=>c.id===card.id);cards[idx]={...card,id:card.id+700,name:'Hidden Draw',img:cards[(idx+3)%cards.length].img};
  closeCard();renderAll();toast(`${card.name} moved to your reserve.`);
}

function renderHistory(){const root=$('#historyList');root.innerHTML=state.history.map(h=>`<div class="history-item"><i>${h.icon}</i><div><p>${h.text}</p><time>${h.time}</time></div></div>`).join('')}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)}

function gameplayFits(){
  const rects=[...$$('#market .dev-card'),...$$('.noble-card'),$('.gem-bank'),$('.local-player')].map(el=>el.getBoundingClientRect());
  const withinViewport=rects.every(r=>r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1);
  const market=$('#market').getBoundingClientRect();
  const noble=$('#nobleList').getBoundingClientRect();
  const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  const seats=$$('.player-seat').filter(el=>getComputedStyle(el).display!=='none').map(el=>el.getBoundingClientRect());
  const clearSeats=seats.every(seat=>!intersects(seat,market)&&!intersects(seat,noble));
  return withinViewport&&clearSeats&&document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight;
}

function updateZoomControl(effective){
  const value=$('[data-zoom-reset]');
  value.textContent=`${Math.round(state.zoom*100)}%`;
  value.title=effective<state.zoom-.001?`Reset zoom · layout limited to ${Math.round(effective*100)}% here`:'Reset zoom';
  $('[data-zoom-out]').disabled=state.zoom===ZOOM_LEVELS[0];
  $('[data-zoom-in]').disabled=state.zoom===ZOOM_LEVELS.at(-1);
}

function applyGameZoom(selected=state.zoom,persist=true){
  state.zoom=ZOOM_LEVELS.reduce((best,value)=>Math.abs(value-selected)<Math.abs(best-selected)?value:best,ZOOM_LEVELS[0]);
  if(persist)localStorage.setItem('splendor-ui-zoom',state.zoom.toFixed(2));
  document.body.classList.add('zoom-measuring');
  let effective=state.zoom;
  document.documentElement.style.setProperty('--game-zoom',effective);
  while(effective>.70&&!gameplayFits()){
    effective=Math.round((effective-.01)*100)/100;
    document.documentElement.style.setProperty('--game-zoom',effective);
  }
  document.documentElement.dataset.effectiveZoom=effective.toFixed(2);
  updateZoomControl(effective);
  requestAnimationFrame(()=>document.body.classList.remove('zoom-measuring'));
}

function stepZoom(direction){
  const current=ZOOM_LEVELS.indexOf(state.zoom);
  const next=Math.max(0,Math.min(ZOOM_LEVELS.length-1,current+direction));
  applyGameZoom(ZOOM_LEVELS[next]);
}

function setPlayers(n){state.playerCount=n;$('#gameShell').className=`game-shell players-${n}`;$$('[data-players]').forEach(b=>b.classList.toggle('active',+b.dataset.players===n));renderNobles();requestAnimationFrame(()=>applyGameZoom(state.zoom,false));toast(`${n}-player table layout`)}

function renderAll(){renderNobles();renderMarket();renderSeats();renderBank();renderLocal();renderHistory()}

document.addEventListener('DOMContentLoaded',()=>{
  renderAll();
  applyGameZoom(state.zoom,false);
  $('#confirmGems').onclick=confirmGems;
  $$('[data-players]').forEach(b=>b.onclick=()=>setPlayers(+b.dataset.players));
  $('[data-history]').onclick=()=>{$('#historyPanel').classList.add('open');$('#historyPanel').setAttribute('aria-hidden','false')};
  $('[data-close-history]').onclick=()=>{$('#historyPanel').classList.remove('open');$('#historyPanel').setAttribute('aria-hidden','true')};
  $$('[data-close-focus]').forEach(b=>b.onclick=closeCard);
  $('#focusLayer').addEventListener('click',e=>{if(e.target===$('#focusLayer'))closeCard()});
  $('[data-copy]').onclick=()=>{navigator.clipboard?.writeText('AKI-782');toast('Room code copied')};
  $('[data-sound]').onclick=e=>{e.currentTarget.textContent=e.currentTarget.textContent==='♪'?'×':'♪';toast('Sound toggled')};
  $('[data-rules]').onclick=()=>toast('Rules panel is ready for game content.');
  $('[data-settings]').onclick=()=>toast('Display settings: premium table · reduced motion off');
  $('[data-zoom-out]').onclick=()=>stepZoom(-1);
  $('[data-zoom-in]').onclick=()=>stepZoom(1);
  $('[data-zoom-reset]').onclick=()=>applyGameZoom(1);
  $('[data-play-again]').onclick=()=>location.reload();
  $('[data-back-room]').onclick=()=>{$('#victoryLayer').classList.remove('open');$('#victoryLayer').setAttribute('aria-hidden','true');toast('Returned to room view')};
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeCard();$('#historyPanel').classList.remove('open')}
    if(e.ctrlKey||e.metaKey){
      if(e.key==='-'||e.key==='_'){e.preventDefault();stepZoom(-1)}
      if(e.key==='+'||e.key==='='){e.preventDefault();stepZoom(1)}
      if(e.key==='0'){e.preventDefault();applyGameZoom(1)}
    }
  });
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>applyGameZoom(state.zoom,false),80)});
});
