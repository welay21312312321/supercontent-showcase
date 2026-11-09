// One real DOM instance per work, chart, and interactive panel.
const deckPages=[];let deckActive=0;
const deckHeading=(kicker,title,body='')=>{const el=document.createElement('div');el.className='section-heading deck-heading';el.innerHTML=`<p class="eyebrow">${esc(kicker)}</p><h2>${lines(title)}</h2>${body?`<p class="section-lead">${esc(body)}</p>`:''}`;return el;};
const wallSelection=[['work-domestic','3C数码','产品卖点'],['work-overseas','家电','当地生活场景'],['work-pet','宠物零售','门店与产品展示'],['work-food','食品饮料','AI数字人口播'],['work-beauty','美妆个护','AIGC产品场景'],['work-mobility','出行创意','AIGC创意Demo']];
function makeWorkWall(){const el=document.createElement('div');el.className='work-wall';el.innerHTML=`<div class="work-wall-grid">${wallSelection.map(([id,industry,format],i)=>{const w=media.works.find(x=>x.id===id);return `<button class="wall-tile ${w.width>w.height?'wall-landscape':''}" data-wall="${id}" aria-label="放大播放${esc(w.title)}"><div class="wall-media"><video src="${esc(w.src)}" poster="${esc(w.poster)}" playsinline muted loop preload="none" data-ambient="true" aria-hidden="true"></video><span class="wall-play">↗</span><span class="wall-index">${pad(i+1)}</span></div><span class="wall-industry">${industry}</span><span class="wall-format">${format}</span><small>${id==='work-mobility'?'创意Demo':'作品节选'} / ${w.duration.toFixed(1)}秒</small></button>`;}).join('')}</div><p class="wall-note">已归档作品与创意Demo分别标明。客户直接名称已处理，展示产品外观与内容形式；不把作品窗口当作投放效果统计。</p>`;return el;}
function syncWallPreviews(){const on=deckPages[deckActive]?.id==='matrix-work-wall'&&motion&&!reading&&!reduce.matches&&!document.hidden&&!$('dialog[open]');$$('.wall-tile video').forEach(v=>{if(on)v.play().catch(()=>{});else v.pause();});}
async function openWallWork(id){const w=media.works.find(x=>x.id===id);if(!w)return;$$('video').forEach(v=>v.pause());const d=$('#wall-dialog'),v=$('video',d);$('#wall-title').textContent=w.title;$('#wall-caption').innerHTML=`<b>${esc(w.caption)} / ${w.duration.toFixed(1)}秒</b><p>${esc(w.deliveryStatus)}。${esc(w.batchNote)}</p>${source(w.sourceId)}`;v.src=w.src;v.poster=w.poster;v.setAttribute('aria-label',w.title);openDialog(d);try{await v.play();}catch{}}
function makeDeckPage(root,id,kind,label,nodes){
  const frame=document.createElement('div');frame.id=id;frame.className='deck-frame';frame.dataset.deckPage=String(deckPages.length);
  frame.setAttribute('role','group');frame.setAttribute('aria-roledescription','幻灯片');frame.setAttribute('aria-label',label);
  frame.innerHTML=`<div class="deck-sheet"><article class="deck-canvas deck-kind-${kind}"><div class="deck-brand"><span>SUPERCONTENT <i>×</i> CLIPO</span><span>${esc(label)}</span></div><div class="deck-content"></div><footer class="deck-footer"><span>特赞的 AI Native 内容团队</span><span class="deck-number"></span></footer></article></div>`;
  const body=$('.deck-content',frame);nodes.filter(Boolean).forEach(node=>body.append(node));root.append(frame);deckPages.push({id,label,el:frame});
}
function domesticBattleReport(){const el=document.createElement('div');el.className='domestic-battle-report';el.innerHTML=`<div class="battle-platforms"><article><div><span>某出行品牌 / 抖音</span><b>2025.11.24—12.31</b></div><strong>294.7<small>万次播放</small></strong><p><b>99</b>个账号 <i>·</i> <b>1,821</b>条发布</p><div class="battle-bar"><i style="width:43.7%"></i></div></article><article><div><span>某出行品牌 / 快手</span><b>2025.11.24—12.31</b></div><strong>673.6<small>万次播放</small></strong><p><b>492</b>个账号 <i>·</i> <b>12,700</b>条发布</p><div class="battle-bar"><i style="width:100%"></i></div></article></div><div class="battle-supply"><div><span>某智能终端品牌 / 持续供给</span><strong>6,800<small>条累计交付记录</small></strong></div><p>按型号与使用情境整理内容资产，支持持续供给。<br><small>截至2026.09.30；非发布数、曝光或终验数。</small></p></div><footer>以上为已核实的代表项目快照，不是国内业务全量统计；不跨项目、跨窗口加总。${source('D18')}${source('D01')}</footer>`;return el;}
function paginateDeck(){
  const opening=$('#opening'),coverNodes=[$('.hero-copy',opening),$('.hero-visual',opening)];opening.replaceChildren();opening.className='chapter deck-chapter';makeDeckPage(opening,'opening-page','cover','品牌获得什么',coverNodes);
  const modelRoot=$('#model'),modelNodes=[$('.section-heading',modelRoot),$('.engine-grid',modelRoot),$('.definition',modelRoot),$('.logic-line',modelRoot)];modelRoot.replaceChildren();modelRoot.classList.add('deck-chapter');makeDeckPage(modelRoot,'model-page','model','UGC与KOC怎样配合',modelNodes);
  makeDeckPage(modelRoot,'matrix-work-wall','wall','不同行业 / 视频作品墙',[deckHeading('WORKS / INDUSTRIES & FORMATS','不同行业，不同表达。','产品展示、门店场景、AI口播、AIGC创意，点击放大看。'),makeWorkWall()]);
  for(const id of ['domestic','overseas','conversion']){
    const root=$('#'+id),h=$('.section-heading',root),meta=$('.scenario-meta',root),cases=$('.portfolio-grid',root),road=$('.delivery',root),commercial=$('.commercial',root),label=data.scenarios.find(s=>s.id===id).label;
    let pages=[];
    if(id==='domestic')pages=[
      ['domestic-report','battle',label+' / 代表项目阶段战报',[deckHeading('DOMESTIC / VERIFIED PROJECT SNAPSHOTS','持续供给，也有阶段传播实绩。','代表项目分开看，统计窗口与口径分别列示。'),domesticBattleReport()]],
      ['domestic-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['domestic-insight','domestic-insight',label+' / 规模与表现',[$('.analysis-board',root),$('.formula-board',root)]],
      ['domestic-methods','domestic-method',label+' / 表达方法',[$('.scene-grid',root)]],
      ['domestic-delivery','roadmap',label+' / 交付与合作',[road,commercial]]
    ];
    if(id==='overseas')pages=[
      ['overseas-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['overseas-contribution','contribution',label+' / 脚本贡献',[$('.insight-heading',root),$('.contribution-board',root),$('.case-panel>.chart-footnote',root),$('.learning-strip',root)]],
      ['overseas-trend','trend',label+' / 两阶段复盘',[$('.trend-board',root)]],
      ['overseas-methods','country',label+' / 逐国方法',[$('.country-stage',root)]],
      ['overseas-delivery','roadmap',label+' / 交付与合作',[road,commercial]]
    ];
    if(id==='conversion')pages=[
      ['conversion-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['conversion-combinations','combinations',label+' / 购买理由',[$('.commerce-formula',root),$('.conversion-insight',root)]],
      ['conversion-decisions','decisions',label+' / 测试决策',[$('.decision-map',root)]],
      ['conversion-scripts','scripts',label+' / 脚本实验室',[$('.script-lab',root)]],
      ['conversion-testing','testing',label+' / 变量测试',[$('.test-intro',root),$('.test-matrix',root)]],
      ['conversion-delivery','roadmap',label+' / 交付与合作',[road,commercial]]
    ];
    // Detach, never clone, so IDs, native media and handlers remain unique.
    const holding=document.createDocumentFragment();pages.forEach(p=>p[3].filter(Boolean).forEach(el=>holding.append(el)));root.replaceChildren();root.classList.add('deck-chapter');pages.forEach(p=>makeDeckPage(root,...p));
  }
  const offers=$('#offering'),offerHeading=$('.section-heading',offers),offerGrid=$('.offer-grid',offers),pricing=$('.pricing-panel',offers);offers.replaceChildren();offers.classList.add('deck-chapter');
  makeDeckPage(offers,'offering-services','services','服务怎么采购',[offerHeading,offerGrid]);
  makeDeckPage(offers,'offering-pricing','pricing','场景报价口径',[deckHeading('SERVICE / PRICING','按这一轮的任务，\n把服务范围与报价讲清楚。'),pricing]);
  const teamRoot=$('#team'),teamHeading=$('.section-heading',teamRoot),core=$('.team-core',teamRoot),roles=$('.role-grid',teamRoot),split=$('.ai-split',teamRoot);teamRoot.replaceChildren();teamRoot.classList.add('deck-chapter');
  makeDeckPage(teamRoot,'team-platform','team-core','产品依据与项目负责',[teamHeading,core]);
  makeDeckPage(teamRoot,'team-roles','roles','AI Native团队分工',[deckHeading('AI NATIVE / PROFESSIONAL DELIVERY','一位负责人，\n接住整条交付链路。'),roles,split]);
  const closingRoot=$('#closing'),endNodes=[...$('.wrap',closingRoot).children];closingRoot.replaceChildren();closingRoot.classList.add('deck-chapter');makeDeckPage(closingRoot,'closing-page','closing','从首批内容开始',endNodes);
  document.body.classList.add('slide-deck');
  $('#contents-title').textContent=deckPages.length+'页 · 从品牌任务到内容结果';
  deckPages.forEach((p,i)=>$('.deck-number',p.el).textContent=pad(i+1)+' / '+pad(deckPages.length));
  const nav=document.createElement('nav');nav.className='deck-navigation';nav.setAttribute('aria-label','幻灯片翻页');nav.innerHTML=`<button id="deck-prev" aria-label="上一页">←</button><span id="deck-position" aria-live="polite">01 / ${pad(deckPages.length)}</span><button id="deck-next" aria-label="下一页">→</button>`;document.body.append(nav);
  document.body.insertAdjacentHTML('beforeend','<dialog id="wall-dialog" aria-labelledby="wall-title"><header><h2 id="wall-title">作品节选</h2><button data-dialog-close aria-label="关闭作品">×</button></header><video controls playsinline muted preload="metadata"></video><div id="wall-caption"></div></dialog>');
  $('#wall-dialog').addEventListener('close',()=>{const v=$('#wall-dialog video');v.removeAttribute('src');v.load();syncWallPreviews();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-wall]');if(b)openWallWork(b.dataset.wall);});document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncWallPreviews();});
  const scale=new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--deck-scale',String(e.contentRect.width/1600));});$$('.deck-sheet').forEach(el=>scale.observe(el));
}
function goDeck(i){const n=Math.max(0,Math.min(deckPages.length-1,i));setDeckPosition(n);history.replaceState(null,'','#'+deckPages[n].id);window.scrollTo({top:0,behavior:'instant'});}
function setDeckPosition(i){deckActive=i;deckPages.forEach((p,j)=>{p.el.classList.toggle('is-current',j===i);if(j!==i)$$('video',p.el).forEach(v=>v.pause());});const sheet=$('.deck-sheet',deckPages[i].el),width=sheet.getBoundingClientRect().width;sheet.style.setProperty('--deck-scale',String(width/1600));document.documentElement.style.setProperty('--deck-sheet-height',width*9/16+'px');document.documentElement.style.setProperty('--deck-sheet-width',width+'px');$('#deck-position').textContent=pad(i+1)+' / '+pad(deckPages.length);$('#deck-prev').disabled=i===0;$('#deck-next').disabled=i===deckPages.length-1;$$('.desktop-nav a').forEach(a=>a.classList.toggle('current',a.hash==='#'+deckPages[i].el.parentElement.id));syncWallPreviews();}
paginateDeck();setDeckPosition(0);
$('#deck-prev').onclick=()=>goDeck(deckActive-1);$('#deck-next').onclick=()=>goDeck(deckActive+1);
function syncHashToDeck(){const target=document.getElementById(location.hash.slice(1));if(!target)return;const frame=target.closest('.deck-frame')||$('.deck-frame',target);const i=deckPages.findIndex(p=>p.el===frame);if(i>=0){setDeckPosition(i);window.scrollTo({top:0,behavior:'instant'});}}
addEventListener('hashchange',syncHashToDeck);addEventListener('resize',()=>requestAnimationFrame(()=>setDeckPosition(deckActive)));
$('.deck-navigation').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();goDeck(deckActive+(e.key==='ArrowRight'?1:-1));}});
