// One real DOM instance per work, chart, and interactive panel.
const deckPages=[];let deckActive=0;
const deckHeading=(kicker,title,body='')=>{const el=document.createElement('div');el.className='section-heading deck-heading';el.innerHTML=`<p class="eyebrow">${esc(kicker)}</p><h2>${lines(title)}</h2>${body?`<p class="section-lead">${esc(body)}</p>`:''}`;return el;};
const wallSelection=[['work-domestic','3C数码','产品卖点'],['work-overseas','家电','当地生活场景'],['work-pet','宠物零售','门店与产品展示'],['work-food','食品饮料','AI数字人口播'],['work-beauty','美妆个护','AIGC产品场景'],['work-mobility','出行创意','AIGC创意Demo']];
function makeWorkWall(){const el=document.createElement('div');el.className='work-wall';el.innerHTML=`<div class="work-wall-grid">${wallSelection.map(([id,industry,format],i)=>{const w=media.works.find(x=>x.id===id);return `<button class="wall-tile ${w.width>w.height?'wall-landscape':''}" data-wall="${id}" aria-label="放大播放${esc(w.title)}"><div class="wall-media"><video src="${esc(w.src)}" poster="${esc(w.poster)}" playsinline muted loop preload="none" data-ambient="true" aria-hidden="true"></video><span class="wall-play">↗</span><span class="wall-index">${pad(i+1)}</span></div><span class="wall-industry">${industry}</span><span class="wall-format">${format}</span><small><span>${id==='work-mobility'?'完整创意Demo':'完整作品'}</span> / ${w.duration.toFixed(1)}<span>秒</span></small></button>`;}).join('')}</div><p class="wall-note">点击观看完整作品，保留原画面与原声。项目文字已脱敏；创意Demo单独标明，作品不与投放数字逐支对应。</p>`;return el;}
function syncWallPreviews(){const on=deckPages[deckActive]?.id==='matrix-work-wall'&&motion&&!reading&&!reduce.matches&&!document.hidden&&!$('dialog[open]')&&($('#contents').hidden||innerWidth>=1000);$$('.wall-tile video').forEach(v=>{if(on)v.play().catch(()=>{});else v.pause();});}
async function openWallWork(id){const w=media.works.find(x=>x.id===id);if(!w)return;$$('video').forEach(v=>v.pause());const d=$('#wall-dialog'),v=$('video',d);$('#wall-title').textContent=w.title;$('#wall-caption').innerHTML=`<b><span>${esc(w.caption)}</span> / ${w.duration.toFixed(1)} <span>秒</span></b><p><span>${esc(w.deliveryStatus)}</span> / <span>${esc(w.batchNote)}</span></p>${source(w.sourceId)}`;v.src=w.src;v.poster=w.poster;v.setAttribute('aria-label',w.title);openDialog(d);try{await v.play();}catch{}}
function makeDeckPage(root,id,kind,label,nodes){
  const frame=document.createElement('div');frame.id=id;frame.className='deck-frame';frame.dataset.deckPage=String(deckPages.length);
  frame.setAttribute('role','group');frame.setAttribute('aria-roledescription','幻灯片');frame.setAttribute('aria-label',label);
  frame.innerHTML=`<div class="deck-sheet"><article class="deck-canvas deck-kind-${kind}"><div class="deck-brand"><span>SUPERCONTENT <i>×</i> CLIPO</span><span>${esc(label)}</span></div><div class="deck-content"></div><footer class="deck-footer"><span>特赞的 AI Native 内容团队</span><span class="deck-number"></span></footer></article></div>`;
  const body=$('.deck-content',frame);nodes.filter(Boolean).forEach(node=>body.append(node));root.append(frame);deckPages.push({id,label,el:frame});
}
function domesticBattleReport(){const el=document.createElement('div');el.className='domestic-battle-report';el.innerHTML=`<div class="battle-platforms"><article><div><span>某出行品牌 / 抖音</span><b>2025.09.01—09.14</b></div><strong>205.3<small>万次播放</small></strong><p><b>593</b>个账号 <i>·</i> <b>5,985</b>次发布</p><div class="battle-bar"><i style="width:15.2%"></i></div></article><article><div><span>某出行品牌 / 快手</span><b>2025.09.01—09.14</b></div><strong>1,349.3<small>万次播放</small></strong><p><b>562</b>个账号 <i>·</i> <b>6,393</b>次发布</p><div class="battle-bar"><i style="width:100%"></i></div></article></div><div class="battle-supply"><div><span>同一品牌 / 14天发布期复盘</span><strong>12,378<small>次矩阵发布</small></strong></div><p>两平台协同铺开，复盘记录1,554.6万次播放。<br><small>发布计次不等于去重创意数；平台账号分别列示。</small></p></div><footer>2025.09.01—09.14发布期；原表剔除异常播放。未提供逐条播放采集截止日，不表示全部播放都发生在14天内。${source('D19')}</footer>`;return el;}
function domesticPlatformValue(){const el=document.createElement('div');el.className='platform-value-grid';el.innerHTML=`<article class="platform-cost-card"><p class="eyebrow">抖音 / 快手 · 声量效率</p><h3>把品牌声量，<br>做成算得清的曝光。</h3><strong>¥10<small> / CPM</small></strong><p>国内报价测算示例</p><div class="cpm-example"><b>100万次曝光</b><span>→</span><b>1万元</b></div><small>按CPM10元测算；内容、账号发布与执行范围在方案中确认。</small></article><article class="platform-xhs-card"><p class="eyebrow">小红书 · 某智能终端品牌</p><h3>有内容可看，<br>也有用户参与。</h3><strong>566<small>条发布</small></strong><div class="xhs-secondary"><b>1,491<small>次互动</small></b><span>图文288条 / 视频278条</span></div><p class="xhs-insight">图文与视频一起铺开，把产品信息放进不同内容形式。</p><footer>2026.11.04创建的项目复盘；正文未明确统计起止。${source('D20')}</footer></article><article class="platform-xhs-card"><p class="eyebrow">小红书 · 某家电品牌</p><h3>发布之后，<br>还要看阅读和互动。</h3><strong>153,722<small>次阅读</small></strong><div class="xhs-secondary"><b>1,498<small>次互动</small></b><span>270条发布 / 237条有效链接</span></div><p class="xhs-insight">有效链接、阅读、互动分开核对，让下一轮内容有依据。</p><footer>7月阶段复盘；两批发布数据分别截至7.28与8.1。${source('D21')}</footer></article></div><p class="platform-value-conclusion"><b>同一套矩阵，不同的平台任务。</b><span>声量看曝光成本；小红书分开看内容有效量、阅读与互动，再规划搜索承接。</span></p>`;return el;}
function globalCpmGuide(){const el=document.createElement('div');el.className='cpm-guide';el.innerHTML=`<div class="cpm-guide-main"><div class="cpm-world"><div class="cpm-world-caption"><b>26国分档CPM参考</b><span>USD / 千次曝光</span></div>${data.cpm.mapSvg}<p>颜色越深，基础档CPM越高。点击国家查看阶梯价。</p></div><aside class="cpm-country-detail" id="cpm-country-detail" aria-live="polite"></aside></div><div class="cpm-country-buttons" role="group" aria-label="选择CPM国家">${data.cpm.countries.map(c=>`<button data-cpm-country="${c.iso2}" title="${c.name}" aria-label="${c.name}" aria-pressed="${c.iso2==='VN'}">${c.iso2}</button>`).join('')}</div><p class="cpm-guide-note">2026.11.09核对官网客户报价配置；各国独立达档，分档累进计价。正式报价按国家与执行范围确认。${source('O-CPM')}</p>`;return el;}
function setCpmCountry(iso){const c=data.cpm.countries.find(x=>x.iso2===iso);if(!c)return;$('#cpm-country-detail').innerHTML=`<p class="eyebrow">${c.region}</p><h3>${c.name}</h3><strong>US$${c.base.toFixed(2)}<small>基础档CPM</small></strong><div class="cpm-tier-rows">${[['0–1,000万',c.base],['1,000–2,000万',c.t1],['2,000–3,000万',c.t2],['3,000万以上',c.t3]].map(([tier,rate])=>`<div><span>${tier}</span><b>US$${rate.toFixed(2)}</b></div>`).join('')}</div><p>每档仅对落入本档的曝光计价。</p>`;$$('[data-cpm-country]').forEach(el=>{const on=el.dataset.cpmCountry===iso;el.classList.toggle('selected',on);if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(on));});}
const sceneChapters={
 domestic:{no:'01',en:'DOMESTIC UGC MATRIX',title:'国内UGC矩阵',promise:'把曝光成本说清，再把品牌声量做大。',cpm:'¥10',cpmLabel:'国内曝光报价测算示例',cpmNote:'每千次曝光；按内容与发布范围确认方案。',path:['CPM曝光目标','内容与KOC矩阵','内容沉淀与复盘'],note:'新品上市 / 活动造势 / 日常声量',works:['work-domestic','work-pet','work-beauty']},
 overseas:{no:'02',en:'OVERSEAS UGC MATRIX',title:'海外UGC矩阵',promise:'每个国家的曝光，单独算清成本。',cpm:'US$1.51',cpmLabel:'六国历史活动综合CPM',cpmNote:'2026.07.01—08.13；内容与分发总费用口径。',sourceId:'O-V13',path:['逐国内容适配','赛马找到方向','按国家放量'],note:'TikTok / 20多个国家矩阵经验',works:['work-overseas','work-food','work-mobility']},
 conversion:{no:'03',en:'ECOMMERCE CONTENT GROWTH',title:'电商转化',promise:'用有限素材，找出更多能复制的购买理由。',path:['测试脚本方向','放大有效结构','持续创意测试'],note:'抖音千川 / 内容运营与素材供给',works:['work-commerce','work-domestic','work-beauty']}
};
function sceneChapter(id){const c=sceneChapters[id],el=document.createElement('div');el.className='scene-chapter-intro';el.innerHTML=`<div class="chapter-intro-copy"><p class="eyebrow">CORE SCENARIO / ${c.no}</p><h2>${c.title}</h2><p class="chapter-promise">${c.promise}</p><p class="chapter-platforms">${c.note}</p>${c.cpm?`<div class="chapter-cpm"><div><small>${c.cpmLabel}</small><strong>${c.cpm}<span> / CPM</span></strong></div><p>${c.cpmNote}${c.sourceId?source(c.sourceId):''}</p></div>`:''}<div class="chapter-path">${c.path.map((t,i)=>`<span><small>${pad(i+1)}</small>${t}</span>`).join('')}</div><p class="chapter-preview">这一章：真实案例 → 内容方法 → 交付与合作</p></div><div class="chapter-intro-art" aria-hidden="true"><span class="chapter-giant">${c.no}</span><div class="chapter-films">${c.works.map((id,i)=>{const w=media.works.find(x=>x.id===id);return `<figure style="--i:${i}"><img src="${w.poster}" alt=""><span>▶</span></figure>`}).join('')}</div><p>${c.en}</p></div>`;return el;}
function paginateDeck(){
  const opening=$('#opening'),coverNodes=[$('.hero-copy',opening),$('.hero-visual',opening)];opening.replaceChildren();opening.className='chapter deck-chapter';makeDeckPage(opening,'opening-page','cover','品牌获得什么',coverNodes);
  const modelRoot=$('#model'),modelNodes=[$('.section-heading',modelRoot),$('.engine-grid',modelRoot),$('.definition',modelRoot),$('.logic-line',modelRoot)];modelRoot.replaceChildren();modelRoot.classList.add('deck-chapter');makeDeckPage(modelRoot,'model-page','model','UGC与KOC怎样配合',modelNodes);
  makeDeckPage(modelRoot,'matrix-work-wall','wall','不同行业 / 视频作品墙',[deckHeading('WORKS / INDUSTRIES & FORMATS','不同行业，不同表达。','产品展示、门店场景、AI口播、AIGC创意，点击放大看。'),makeWorkWall()]);
  for(const id of ['domestic','overseas','conversion']){
    const root=$('#'+id),h=$('.section-heading',root),meta=$('.scenario-meta',root),cases=$('.portfolio-grid',root),road=$('.delivery',root),commercial=$('.commercial',root),label=data.scenarios.find(s=>s.id===id).label;
    let pages=[];
    if(id==='domestic')pages=[
      ['domestic-platform-value','platform-value',label+' / 平台价值',[deckHeading('PLATFORM VALUE / 国内矩阵','抖快算声量成本，小红书看内容沉淀。','目标不同，看的数据也不同。把每个平台的任务和复盘口径对齐。'),domesticPlatformValue()]],
      ['domestic-report','battle',label+' / 代表项目阶段战报',[deckHeading('DOMESTIC / VERIFIED PROJECT SNAPSHOTS','14天，完成1.24万次矩阵发布。','短期内把内容铺开，让品牌持续出现在用户的信息流。'),domesticBattleReport()]],
      ['domestic-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['domestic-insight','domestic-insight',label+' / 规模与表现',[$('.analysis-board',root),$('.formula-board',root)]],
      ['domestic-methods','domestic-method',label+' / 表达方法',[$('.scene-grid',root)]],
      ['domestic-delivery','roadmap',label+' / 交付与合作',[road,commercial]]
    ];
    if(id==='overseas')pages=[
      ['overseas-cpm-guide','cpm-guide-page',label+' / 全球CPM导览',[deckHeading('GLOBAL CPM GUIDE / 逐国声量','全球声量，按国家算清每一笔曝光。','选国家，看分档CPM；再按品牌目标组合曝光与预算。'),globalCpmGuide()]],
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
    const holding=document.createDocumentFragment();pages.forEach(p=>p[3].filter(Boolean).forEach(el=>holding.append(el)));root.replaceChildren();root.classList.add('deck-chapter');makeDeckPage(root,id+'-chapter','chapter-intro',label+' / 章节引导',[sceneChapter(id)]);pages.forEach(p=>makeDeckPage(root,...p));
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
  const nav=document.createElement('nav');nav.className='deck-navigation';nav.setAttribute('aria-label','演示操作栏');nav.innerHTML=`<div class="deck-pagination"><button id="deck-prev" aria-label="上一页"><span aria-hidden="true">←</span><span>上一页</span></button><span id="deck-position" aria-live="polite">01 / ${pad(deckPages.length)}</span><button id="deck-next" aria-label="下一页"><span>下一页</span><span aria-hidden="true">→</span></button></div><div class="deck-tools"><button id="deck-contents" aria-controls="contents" aria-expanded="false">目录</button><button id="deck-language" data-locale-fixed title="中英文切换" aria-label="中英文切换" aria-pressed="false"><span class="lang-zh">中</span><span>/</span><span class="lang-en">EN</span></button><button id="deck-fullscreen">全屏</button><button id="deck-motion" aria-pressed="true">动效<i aria-hidden="true"></i></button></div>`;document.body.append(nav);
  $('#deck-contents').onclick=()=>$('#menu-toggle').click();$('#deck-fullscreen').onclick=()=>$('#fullscreen').click();$('#deck-motion').onclick=()=>$('#motion').click();
  document.body.insertAdjacentHTML('beforeend','<dialog id="wall-dialog" aria-labelledby="wall-title"><header><h2 id="wall-title">完整作品</h2><button data-dialog-close aria-label="关闭作品">×</button></header><video controls playsinline preload="metadata"></video><div id="wall-caption"></div></dialog>');
  $('#wall-dialog').addEventListener('close',()=>{const v=$('#wall-dialog video');v.removeAttribute('src');v.load();syncWallPreviews();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-wall]');if(b)openWallWork(b.dataset.wall);});document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncWallPreviews();});
  const scale=new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--deck-scale',String(e.contentRect.width/1600));});$$('.deck-sheet').forEach(el=>scale.observe(el));
}
function goDeck(i){const n=Math.max(0,Math.min(deckPages.length-1,i));setDeckPosition(n);history.replaceState(null,'','#'+deckPages[n].id);window.scrollTo({top:0,behavior:'instant'});}
function setDeckPosition(i){deckActive=i;deckPages.forEach((p,j)=>{p.el.classList.toggle('is-current',j===i);if(j!==i)$$('video',p.el).forEach(v=>v.pause());});const sheet=$('.deck-sheet',deckPages[i].el),width=sheet.getBoundingClientRect().width;sheet.style.setProperty('--deck-scale',String(width/1600));document.documentElement.style.setProperty('--deck-sheet-height',width*9/16+'px');document.documentElement.style.setProperty('--deck-sheet-width',width+'px');$('#deck-position').textContent=pad(i+1)+' / '+pad(deckPages.length);$('#deck-prev').disabled=i===0;$('#deck-next').disabled=i===deckPages.length-1;$$('.desktop-nav a').forEach(a=>a.classList.toggle('current',a.hash==='#'+deckPages[i].el.parentElement.id));syncWallPreviews();updateCatalogCurrent();}
const catalogSpecs=[
 ['opening-page','品牌如何获得增长','all','把种草做成矩阵，把内容做成生意。','价值主张'],
 ['model-page','品牌如何获得增长','methods','一套内容方法，一张KOC账号网络。','UGC × KOC × Clipo'],
 ['matrix-work-wall','品牌如何获得增长','cases','六个作品窗口，看内容如何跨行业展开。','完整版视频墙'],
 ['domestic-chapter','01 国内UGC矩阵','all','让一轮上新，形成持续的品牌声量。','章节引导'],
 ['domestic-platform-value','01 国内UGC矩阵','cases','抖快算声量成本，小红书看内容沉淀。','CPM与小红书原始报告'],
 ['domestic-report','01 国内UGC矩阵','cases','14天，完成1.24万次矩阵发布。','双平台阶段战报'],
 ['domestic-cases-page','01 国内UGC矩阵','cases','一批素材，持续供给多个账号。','案例集与真实作品'],
 ['domestic-insight','01 国内UGC矩阵','methods','规模怎么做出来，表现怎么分开看。','规模公式与专家判断'],
 ['domestic-methods','01 国内UGC矩阵','methods','从一条作品，拆出可复用的内容结构。','产品 / 门店 / 热点'],
 ['domestic-delivery','01 国内UGC矩阵','delivery','每一步都有交付物，每一轮接回反馈。','交付路线与合作'],
 ['overseas-chapter','02 海外UGC矩阵','all','同一个产品，在不同国家各自讲通。','章节引导'],
 ['overseas-cpm-guide','02 海外UGC矩阵','methods','全球声量，按国家算清每一笔曝光。','全球CPM国家导览'],
 ['overseas-cases-page','02 海外UGC矩阵','cases','六国矩阵，留下可核对的传播实绩。','案例集与真实作品'],
 ['overseas-contribution','02 海外UGC矩阵','methods','不是每种脚本，都贡献同样的声量。','脚本贡献分析'],
 ['overseas-trend','02 海外UGC矩阵','methods','先验证方向，再决定下一轮怎么放量。','两阶段复盘'],
 ['overseas-methods','02 海外UGC矩阵','methods','逐国改表达，不只逐句翻译。','国家 / SKU / 本土内容'],
 ['overseas-delivery','02 海外UGC矩阵','delivery','一个总部Brief，接上逐国交付。','交付路线与合作'],
 ['conversion-chapter','03 电商转化','all','有限素材，也能测试更多购买理由。','章节引导'],
 ['conversion-cases-page','03 电商转化','cases','从素材供给，到可比较的创意测试。','案例集与真实作品'],
 ['conversion-combinations','03 电商转化','methods','同一产品，组合出不同的购买理由。','内容组合公式'],
 ['conversion-decisions','03 电商转化','methods','测完之后，知道该复制还是该改。','测试决策路径'],
 ['conversion-scripts','03 电商转化','methods','换一个用户任务，写一套新脚本。','脚本实验室'],
 ['conversion-testing','03 电商转化','methods','一次测清一个变量，下一批更有方向。','创意测试设计'],
 ['conversion-delivery','03 电商转化','delivery','让测试结果，接回下一批内容。','交付路线与合作'],
 ['offering-services','合作与AI Native团队','delivery','按品牌这一轮的任务，选需要的服务。','服务Offering'],
 ['offering-pricing','合作与AI Native团队','delivery','内容怎么交，费用怎么算，先讲清。','三场景报价口径'],
 ['team-platform','合作与AI Native团队','methods','SKU再多，每一版都用同一份产品依据。','产品底座'],
 ['team-roles','合作与AI Native团队','delivery','AI把选择做多，专业团队把交付做稳。','团队与责任'],
 ['closing-page','合作与AI Native团队','delivery','带一个品牌任务，从第一批内容开始。','准备需求与下一步']
];
let catalogFilter='all';
function setupCatalog(){const aside=$('#contents');aside.className='viewer-catalog';aside.setAttribute('role','complementary');aside.removeAttribute('aria-modal');const groups=[...new Set(catalogSpecs.map(s=>s[1]))];aside.innerHTML=`<header><h2 id="contents-title">演示目录</h2><button data-close="contents" aria-label="返回演示">×</button></header><p class="catalog-summary"><span>${deckPages.length}</span><span>页 · 三个核心场景 · 7段完整作品</span></p><label class="catalog-search"><input id="catalog-search" type="search" aria-label="搜索页面、案例或方法" placeholder="搜索页面、案例或方法"></label><div class="catalog-filters" role="group" aria-label="按内容筛选">${[['all','全部'],['cases','案例'],['methods','方法'],['delivery','交付']].map(([k,t])=>`<button data-catalog-filter="${k}" aria-pressed="${k==='all'}">${t}</button>`).join('')}</div><nav class="catalog-list" aria-label="逐页目录">${groups.map(g=>`<section class="catalog-group"><h3>${g}</h3>${catalogSpecs.filter(s=>s[1]===g).map(s=>`<a class="catalog-item" href="#${s[0]}" data-catalog-kind="${s[2]}"><small>${pad(deckPages.findIndex(p=>p.id===s[0])+1)}</small><div><b>${s[3]}</b><span>${s[4]}</span></div></a>`).join('')}</section>`).join('')}</nav><p class="catalog-empty" hidden>没有匹配页面，试试“案例”“国家”或“脚本”。</p><p class="catalog-footer">选择页面直接进入 · Esc返回演示</p>`;$('#catalog-search').addEventListener('input',filterCatalog);aside.addEventListener('click',e=>{const b=e.target.closest('[data-catalog-filter]');if(!b)return;catalogFilter=b.dataset.catalogFilter;$$('[data-catalog-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterCatalog();});updateCatalogCurrent();}
function filterCatalog(){const q=$('#catalog-search').value.trim().toLocaleLowerCase();let count=0;$$('.catalog-item').forEach(a=>{const p=deckPages.find(x=>'#'+x.id===a.hash),text=(a.textContent+' '+(p?.el.textContent||'')).toLocaleLowerCase(),show=(!q||text.includes(q))&&(catalogFilter==='all'||a.dataset.catalogKind===catalogFilter);a.hidden=!show;if(show)count++;});$$('.catalog-group').forEach(g=>g.hidden=!$$('.catalog-item',g).some(a=>!a.hidden));$('.catalog-empty').hidden=count>0;}
function updateCatalogCurrent(){$$('.catalog-item').forEach(a=>{const on=a.hash==='#'+deckPages[deckActive]?.id;a.classList.toggle('current',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
paginateDeck();setDeckPosition(0);setCpmCountry('VN');document.addEventListener('click',e=>{const c=e.target.closest('[data-cpm-country]');if(c)setCpmCountry(c.dataset.cpmCountry);});
$('#deck-prev').onclick=()=>goDeck(deckActive-1);$('#deck-next').onclick=()=>goDeck(deckActive+1);
function syncHashToDeck(){const target=document.getElementById(location.hash.slice(1));if(!target)return;const frame=target.closest('.deck-frame')||$('.deck-frame',target);const i=deckPages.findIndex(p=>p.el===frame);if(i>=0){setDeckPosition(i);window.scrollTo({top:0,behavior:'instant'});}}
addEventListener('hashchange',syncHashToDeck);addEventListener('resize',()=>requestAnimationFrame(()=>setDeckPosition(deckActive)));
$('.deck-navigation').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();goDeck(deckActive+(e.key==='ArrowRight'?1:-1));}});
