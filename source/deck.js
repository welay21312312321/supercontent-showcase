// One real DOM instance per work, chart, and interactive panel.
const deckPages=[];let deckActive=0,cpmTourTimer=null,cpmTourEnabled=true,cpmTourHover=false,cpmTourHoldUntil=0,cpmSelected='VN';
const deckHeading=(kicker,title,body='')=>{const el=document.createElement('div');el.className='section-heading deck-heading';el.innerHTML=`<p class="eyebrow">${esc(kicker)}</p><h2>${lines(title)}</h2>${body?`<p class="section-lead">${esc(body)}</p>`:''}`;return el;};
const wallSelection=[['work-domestic','3C数码','产品卖点'],['work-overseas','家电','当地生活场景'],['work-pet','宠物零售','门店与产品展示'],['work-food','食品饮料','AI数字人口播'],['work-beauty','美妆个护','AIGC产品场景'],['work-mobility','出行创意','AIGC创意Demo']];
function makeWorkWall(){const el=document.createElement('div');el.className='work-wall';el.innerHTML=`<div class="work-wall-grid">${wallSelection.map(([id,industry,format],i)=>{const w=media.works.find(x=>x.id===id);return `<button class="wall-tile ${w.width>w.height?'wall-landscape':''}" data-wall="${id}" aria-label="放大播放${esc(w.title)}"><div class="wall-media"><video src="${esc(w.src)}" poster="${esc(w.poster)}" playsinline muted loop preload="none" data-ambient="true" aria-hidden="true"></video><span class="wall-play">↗</span><span class="wall-index">${pad(i+1)}</span></div><span class="wall-industry">${industry}</span><span class="wall-format">${format}</span><small><span>${id==='work-mobility'?'完整创意Demo':'完整作品'}</span> / ${w.duration.toFixed(1)}<span>秒</span></small></button>`;}).join('')}</div><p class="wall-note">六个行业窗口，点击观看完整作品。</p>`;return el;}
function syncWallPreviews(){syncCpmTour();const allowed=motion&&!reading&&!reduce.matches&&!document.hidden&&!$('dialog[open]')&&($('#contents').hidden||innerWidth>=1000),page=deckPages[deckActive]?.id;$$('.wall-tile video,.gallery-tile video,.showstage-film video').forEach(v=>{const isHero=!!v.closest('.showstage-film'),gallery=v.closest('.scenario-gallery'),frame=v.closest('.deck-frame'),active=(isHero?page==='opening-page':gallery?frame?.id===page:page==='matrix-work-wall')&&allowed,phoneSecondary=innerWidth<650&&(isHero?!v.closest('.showstage-film-2'):gallery?Number(v.closest('.gallery-tile').dataset.previewIndex)>0:false);if(active&&!phoneSecondary)v.play().catch(()=>{});else v.pause();});}
async function openWallWork(id){const w=media.works.find(x=>x.id===id);if(!w)return;$$('video').forEach(v=>v.pause());const d=$('#wall-dialog'),v=$('video',d);$('#wall-title').textContent=w.title;$('#wall-caption').innerHTML=`<b><span>${esc(w.caption)}</span> / ${w.duration.toFixed(1)} <span>秒</span></b><p><span>${esc(w.deliveryStatus)}</span></p>${source(w.sourceId)}`;v.src=w.src;v.poster=w.poster;v.setAttribute('aria-label',w.title);openDialog(d);try{await v.play();}catch{}}
function makeScenarioGallery(id){const config=data.scenarioGalleries[id],el=document.createElement('div');el.className='scenario-gallery';el.dataset.scenario=id;el.innerHTML=`<div class="scenario-gallery-grid">${config.cards.map((card,i)=>{const w=media.works.find(x=>x.id===card.workId);return `<button class="gallery-tile" data-wall="${w.id}" data-preview-index="${i}" aria-label="播放${esc(w.title)}"><div class="gallery-media" style="--gallery-poster:url('${esc(w.poster)}')"><video src="${esc(w.src)}" poster="${esc(w.poster)}" playsinline muted loop preload="none" data-ambient="true" aria-hidden="true"></video><span class="gallery-index">${pad(i+1)}</span><span class="gallery-open" aria-hidden="true">▶</span><b class="gallery-client">${esc(card.client)}</b></div><div class="gallery-caption"><span>${esc(card.sector)}</span><h3>${esc(card.format)}</h3><small><span>完整视频</span> / ${w.duration.toFixed(1)}<span>秒</span><i>↗</i></small></div></button>`;}).join('')}</div><p class="gallery-bottom"><b>不同行业，不同表达，同样讲清产品。</b><span>点击任一作品，原声播放完整版 ↗</span></p>`;return el;}
function makeDeckPage(root,id,kind,label,nodes){
  const frame=document.createElement('div');frame.id=id;frame.className='deck-frame';frame.dataset.deckPage=String(deckPages.length);
  frame.setAttribute('role','group');frame.setAttribute('aria-roledescription','幻灯片');frame.setAttribute('aria-label',label);
  frame.innerHTML=`<div class="deck-sheet"><article class="deck-canvas deck-kind-${kind}"><div class="deck-brand"><span>SUPERCONTENT <i>×</i> CLIPO</span><span>${esc(label)}</span></div><div class="deck-content"></div><footer class="deck-footer"><span>特赞的 AI Native 内容团队</span><span class="deck-number"></span></footer></article></div>`;
  const body=$('.deck-content',frame);nodes.filter(Boolean).forEach(node=>body.append(node));root.append(frame);deckPages.push({id,label,el:frame});
}
function domesticBattleReport(){const el=document.createElement('div');el.className='domestic-battle-report';el.innerHTML=`<div class="battle-platforms"><article><div><span>某出行品牌 / 抖音</span><b>2025.09.01—09.14</b></div><strong>205.3<small>万次播放</small></strong><p><b>593</b>个账号 <i>·</i> <b>5,985</b>次发布</p><div class="battle-bar"><i style="width:15.2%"></i></div></article><article><div><span>某出行品牌 / 快手</span><b>2025.09.01—09.14</b></div><strong>1,349.3<small>万次播放</small></strong><p><b>562</b>个账号 <i>·</i> <b>6,393</b>次发布</p><div class="battle-bar"><i style="width:100%"></i></div></article></div><div class="battle-supply"><div><span>同一品牌 / 14天发布期复盘</span><strong>12,378<small>次矩阵发布</small></strong></div><p>双平台矩阵，复盘总播放1,554.6万次。<br><small>发布次数与账号规模，按平台分别展示。</small></p></div><footer>2025.09.01—09.14发布期复盘 · 播放按该期发布内容汇总${source('D19')}</footer>`;return el;}
function domesticPlatformValue(){
  const el=document.createElement('div');el.className='platform-playbook-board';
  el.innerHTML=`<div class="platform-playbook-grid">
    <article class="platform-playbook-card platform-playbook-douyin" data-platform="douyin" style="--platform-accent:#174cff">
      <header><img src="assets/editorial/douyin.webp" alt="抖音"><h3>抖音</h3><span>声量效率</span></header>
      <h4>用热点开场，<br>把声量放大。</h4>
      <p class="platform-practice">热点选题接产品卖点，Clipo展开不同版本，用KOC矩阵小批验证后放量。</p>
      <div class="platform-proof"><p>某出行品牌 · 阶段复盘</p><strong>5,985<small>次发布</small></strong><span><b>593</b>个账号 / 14天发布期</span></div>
      <footer><span>2025.09.01—09.14</span><a href="#domestic-report">看阶段战报 ↗</a></footer>
    </article>
    <article class="platform-playbook-card" data-platform="xiaohongshu" style="--platform-accent:#ff2442">
      <header><img src="assets/editorial/xiaohongshu.webp" alt="小红书"><h3>小红书</h3><span>种草沉淀</span></header>
      <h4>从使用场景，<br>讲清购买理由。</h4>
      <p class="platform-practice">围绕选购和使用问题铺开图文、视频；复盘阅读与互动，再选下一批话题。</p>
      <div class="platform-proof"><p>某家电品牌 · 阶段复盘</p><strong>153,722<small>次阅读</small></strong><span><b>1,498</b>次互动 / <b>270</b>条发布</span></div>
      <footer><span>2026年7月项目复盘</span><b>看阅读，也看互动</b></footer>
    </article>
    <article class="platform-playbook-card" data-platform="kuaishou" style="--platform-accent:#ff6500">
      <header><img src="assets/editorial/kuaishou.svg?v=24" alt="快手"><h3>快手</h3><span>矩阵供给</span></header>
      <h4>内容和账号，<br>找到好组合。</h4>
      <p class="platform-practice">单独看快手的账号与内容表现，调整选题和供给；按本平台的数据选片、放量。</p>
      <div class="platform-proof"><p>某出行品牌 · 阶段复盘</p><strong>6,393<small>次发布</small></strong><span><b>562</b>个账号 / 14天发布期</span></div>
      <footer><span>2025.09.01—09.14</span><a href="#domestic-report">看分平台表现 ↗</a></footer>
    </article>
    <article class="platform-playbook-card" data-platform="wechat-channels" style="--platform-accent:#eea31b">
      <header><img src="assets/editorial/wechat-channels.svg?v=24" alt="视频号"><h3>视频号</h3><span>内容适配</span></header>
      <h4>好结构接着用，<br>开场节奏重新调。</h4>
      <p class="platform-practice">已有产品素材继续用，拆开脚本、重组镜头、调整节奏，做适合视频号的新版本。</p>
      <button class="platform-work-proof" data-wall="work-gallery-conversion-06" aria-label="播放视频号口腔护理完整作品"><span class="platform-work-poster"><img src="assets/real-work/work-gallery-conversion-06.jpg" alt="口腔护理视频号改版作品"><i aria-hidden="true">▶</i></span><span><b>脚本复刻<br>素材重组<br>节奏调整</b><small>播放完整作品 ↗</small></span></button>
      <footer><span>某口腔护理品牌</span><b>跨平台内容二创</b></footer>
    </article>
  </div><p class="platform-playbook-conclusion"><b>复用产品依据，按平台改表达。</b><span>先对齐任务，再用实际反馈决定下一批。</span></p>`;
  return el;
}
function globalCpmGuide(){const el=document.createElement('div');el.className='cpm-guide';el.innerHTML=`<div class="cpm-guide-main"><div class="cpm-world"><div class="cpm-world-caption"><b>26国分档CPM参考</b><span>USD / 千次曝光</span><button id="cpm-tour-toggle" aria-pressed="true">暂停导览</button></div>${data.cpm.mapSvg}<p>颜色越深，基础档CPM越高。点击国家查看阶梯价。</p></div><aside class="cpm-country-detail" id="cpm-country-detail" aria-live="polite"></aside></div><div class="cpm-country-buttons" role="group" aria-label="选择CPM国家">${data.cpm.countries.map(c=>`<button data-cpm-country="${c.iso2}" title="${c.name}" aria-label="${c.name}" aria-pressed="${c.iso2==='VN'}">${c.iso2}</button>`).join('')}</div><p class="cpm-guide-note">2026.11.09报价参考 · USD/千次曝光 · 各国独立、分档计价${source('O-CPM')}</p>`;return el;}
function setCpmCountry(iso){cpmSelected=iso;const c=data.cpm.countries.find(x=>x.iso2===iso);if(!c)return;$('#cpm-country-detail').innerHTML=`<p class="eyebrow">${c.region}</p><h3>${c.name}</h3><strong>US$${c.base.toFixed(2)}<small>基础档CPM</small></strong><div class="cpm-tier-rows">${[['0–1,000万',c.base],['1,000–2,000万',c.t1],['2,000–3,000万',c.t2],['3,000万以上',c.t3]].map(([tier,rate])=>`<div><span>${tier}</span><b>US$${rate.toFixed(2)}</b></div>`).join('')}</div><p>每档仅对落入本档的曝光计价。</p>`;$$('[data-cpm-country]').forEach(el=>{const on=el.dataset.cpmCountry===iso;el.classList.toggle('selected',on);if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(on));});}
function syncCpmTour(){clearTimeout(cpmTourTimer);cpmTourTimer=null;const button=$('#cpm-tour-toggle');if(button){button.textContent=cpmTourEnabled&&motion?'暂停导览':'自动导览';button.setAttribute('aria-pressed',String(cpmTourEnabled&&motion));}const on=deckPages[deckActive]?.id==='overseas-cpm-guide'&&cpmTourEnabled&&motion&&!reading&&!reduce.matches&&!document.hidden&&!$('dialog[open]')&&$('#contents').hidden&&!cpmTourHover;if(!on)return;const delay=Math.max(4500,cpmTourHoldUntil-Date.now());cpmTourTimer=setTimeout(()=>{const list=data.cpm.countries,index=list.findIndex(c=>c.iso2===cpmSelected);setCpmCountry(list[(index+1)%list.length].iso2);syncCpmTour();},delay);}
const sceneChapters={
 domestic:{no:'01',en:'DOMESTIC UGC MATRIX',kicker:'CORE SCENARIO / 01',title:'国内UGC矩阵',hook:'每千次曝光，低至一瓶水的预算。',promise:'流量越来越贵，品牌声量仍要做大。AI批量展开UGC内容，KOC矩阵持续分发，让规模变成成本优势。',cpm:'¥3–5',cpmLabel:'亿级曝光方案 · 参考CPM',cpmNote:'每1,000次曝光 · 百万级参考CPM约¥15',path:['CPM曝光目标','内容与KOC矩阵','内容沉淀与复盘'],note:'新品上市 / 活动造势 / 日常声量',works:['work-domestic','work-pet','work-beauty']},
 overseas:{no:'02',en:'OVERSEAS UGC MATRIX',title:'海外UGC矩阵',promise:'每个国家的曝光，单独算清成本。',cpm:'US$1.51',cpmLabel:'六国历史活动综合CPM',cpmNote:'2026.07.01—08.13 · 含内容与分发费用',sourceId:'O-V13',path:['逐国内容适配','赛马找到方向','按国家放量'],note:'TikTok / 20多个国家矩阵经验',works:['work-overseas','work-food','work-mobility']},
 conversion:{no:'03',en:'ECOMMERCE CONTENT GROWTH',title:'电商转化',promise:'用有限素材，找出更多能复制的购买理由。',path:['测试脚本方向','放大有效结构','持续创意测试'],note:'抖音千川 / 内容运营与素材供给',works:['work-commerce','work-domestic','work-beauty']}
};
function sceneChapter(id){const c=sceneChapters[id],el=document.createElement('div');el.className='scene-chapter-intro';el.innerHTML=`<div class="chapter-intro-copy"><p class="eyebrow">${c.kicker||'CORE SCENARIO / '+c.no}</p><h2>${lines(c.title)}</h2>${c.hook?`<p class="chapter-hook">${esc(c.hook)}</p>`:''}<p class="chapter-promise">${c.promise}</p><p class="chapter-platforms">${c.note}</p>${c.cpm?`<div class="chapter-cpm"><div><small>${c.cpmLabel}</small><strong>${c.cpm}<span> / CPM</span></strong></div><p>${c.cpmNote}${c.sourceId?source(c.sourceId):''}</p></div>`:''}<div class="chapter-path">${c.path.map((t,i)=>`<span><small>${pad(i+1)}</small>${t}</span>`).join('')}</div><p class="chapter-preview">这一章：真实案例 → 内容方法 → 交付与合作</p></div><div class="chapter-intro-art" aria-hidden="true"><span class="chapter-giant">${c.no}</span><div class="chapter-films">${c.works.map((id,i)=>{const w=media.works.find(x=>x.id===id);return `<figure style="--i:${i}"><img src="${w.poster}" alt=""><span>▶</span></figure>`}).join('')}</div><p>${c.en}</p></div>`;return el;}
function matrixScriptBridge(){const el=document.createElement('div');el.className='matrix-script-bridge';el.innerHTML=`<div class="bridge-value"><span>当下被看见</span><b>品牌声量</b><i>＋</i><span>下轮接着用</span><b>脚本资产</b></div><div class="bridge-route">${[['01','找场景','谁会需要它？','人群 · 使用场景 · 产品卖点'],['02','矩阵验证','用户对哪种说法有反应？','开场 · 播放 · 互动 · 评论'],['03','拆好结构','什么值得留下来？','用户语言 · 产品证据 · 购买理由'],['04','电商测试','哪些内容带来下一步？','点击 · 获客 · 成交 · 复投']].map(([n,h,q,output])=>`<article><small>${n}</small><h3>${h}</h3><p>${q}</p><div>${output}</div></article>`).join('')}</div><div class="bridge-assets"><div><p class="eyebrow">品牌带走什么</p><h3>一套越用越懂用户的内容资产。</h3></div><ul><li><b>选题库</b><span>哪些人，在什么情境下会感兴趣</span></li><li><b>脚本库</b><span>开场、证据和购买理由如何衔接</span></li><li><b>测试清单</b><span>下一批保留什么，再改哪一个变量</span></li></ul></div><p class="bridge-loop">矩阵反馈 → 脚本改版 → 电商测试 → 下一轮内容</p>`;return el;}
function matrixScriptCases(){const el=document.createElement('div');el.className='matrix-script-cases';const cases=[
 ['国内 · 健康消费','挂车小样验证','900','条矩阵内容','100条挂车内容 · 早期3单','热点/生活痛点 → 成分信任 → 产品机制 → 下单','先找到用户愿意看的入口，再把购买理由讲完整。'],
 ['国内 · 电池','小额投流验证','0.56–3.18','单次测试ROI','13次小额投流 · 382条累计发布','100个矩阵账号 → 筛出6号 → SKU测试 → 脚本改版','按使用场景测卖点，把有效结构留下来。'],
 ['国内 · 宠物服务','已形成成交','546','单成交','750条发布 · 广告账户ROI 1.07','门店内容 → 保留转化素材 → 集中预算 → 成交复盘','点击高不一定成交高，购买理由要分服务来写。'],
 ['海外 · 智能终端','声量赛马','9.3–140万','TOP单条播放','7批次赛马 · 所选TOP作品含加热','耐用性 → AI功能 → 艺术玩法 → 逐国筛选','用同一产品，找到不同国家愿意看的理由。'],
 ['海外 · 3D工具','观看与互动验证','99','个创意模板','同模板5条IG观看271–45,094次','工具演示 → 使用结果 → 模板迭代 → 内容复用','保留产品结果，把场景和玩法继续展开。']];el.innerHTML=`<div class="script-case-grid">${cases.map(([label,stage,n,unit,detail,chain,insight],i)=>`<article class="script-case script-case-${i+1}"><header><span>${label}</span><small>${stage}</small></header><strong>${n}<span>${unit}</span></strong><p class="script-case-detail">${detail}</p><p class="script-case-chain">${chain}</p><p class="script-case-insight">${insight}</p></article>`).join('')}</div><p class="script-case-note">国内三案已进入成交测试；海外两案沉淀内容方向与模板，继续衔接转化验证。</p>`;return el;}
function naturalFlowMechanism(){const el=document.createElement('div');el.className='natural-flow-mechanism';el.innerHTML=`<div class="algo-flow"><article class="algo-node algo-content"><small>01 / 内容信号</small><div class="algo-video-art"><i>▶</i><span>场景</span><span>卖点</span><span>表达</span></div><h3>这条内容，在说什么？</h3><p>画面、字幕、声音与话题，帮助形成可理解的内容信息。</p></article><span class="algo-arrow">→</span><article class="algo-node algo-match"><small>02 / 兴趣匹配</small><div class="algo-audience"><i></i><i></i><i></i><i></i><i></i><i></i><b>兴趣</b></div><h3>谁可能愿意看？</h3><p>结合用户历史行为，预测相关性，再排序和推荐。</p></article><span class="algo-arrow">→</span><article class="algo-node algo-feedback"><small>03 / 用户反馈</small><div class="algo-signal-art"><span>◷<small>观看</small></span><span>♡<small>互动</small></span><span>↗<small>分享</small></span></div><h3>用户，给出下一轮信号。</h3><p>观看时长、互动、分享与不感兴趣等反馈，持续影响推荐。</p></article></div><div class="algo-loop"><span>↶</span><b>持续更新推荐</b><p>反馈进入模型，下一次匹配随之调整。</p></div><div class="algo-practice"><div><small>内容怎么配合</small><h3>让平台能理解，<br>让用户愿意看。</h3></div><ul><li><b>说给谁听</b><span>选具体人群和使用情境</span></li><li><b>讲清一件事</b><span>开场、画面和卖点保持一致</span></li><li><b>用反馈改内容</b><span>换场景、换开场，保留有反应的结构</span></li></ul></div>`;return el;}
function paginateDeck(){
  const opening=$('#opening'),coverNodes=[$('.hero-copy',opening),$('.hero-visual',opening)];opening.replaceChildren();opening.className='chapter deck-chapter';makeDeckPage(opening,'opening-page','cover','品牌获得什么',coverNodes);
  const modelRoot=$('#model'),modelNodes=[$('.section-heading',modelRoot),$('.engine-grid',modelRoot),$('.definition',modelRoot),$('.logic-line',modelRoot)];modelRoot.replaceChildren();modelRoot.classList.add('deck-chapter');makeDeckPage(modelRoot,'model-page','model','UGC与KOC怎样配合',modelNodes);
  makeDeckPage(modelRoot,'matrix-script-bridge','script-bridge','从矩阵到转化 / 品牌获得什么',[deckHeading('MATRIX → COMMERCE','一轮矩阵，留下两份价值。','做大这一轮声量，也为下一轮电商测试留下好脚本。'),matrixScriptBridge()]);
  makeDeckPage(modelRoot,'matrix-work-wall','wall','不同行业 / 视频作品墙',[deckHeading('WORKS / INDUSTRIES & FORMATS','不同行业，不同表达。','产品展示、门店场景、AI口播、AIGC创意，点击放大看。'),makeWorkWall()]);
  for(const id of ['domestic','overseas','conversion']){
    const root=$('#'+id),h=$('.section-heading',root),meta=$('.scenario-meta',root),cases=$('.portfolio-grid',root),road=$('.delivery',root),commercial=$('.commercial',root),label=data.scenarios.find(s=>s.id===id).label;
    let pages=[];
    if(id==='domestic')pages=[
      ['domestic-platform-value','platform-value',label+' / 平台经验',[deckHeading('PLATFORM PLAYBOOK / 国内矩阵经验','同一个产品，按平台换打法。','我们的做法：产品事实保持一致，选题、开场和节奏分别调整。'),domesticPlatformValue()]],
      ['domestic-report','battle',label+' / 代表项目阶段战报',[deckHeading('DOMESTIC / VERIFIED PROJECT SNAPSHOTS','14天，完成1.24万次矩阵发布。','短期内把内容铺开，让品牌持续出现在用户的信息流。'),domesticBattleReport()]],
      ['domestic-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['domestic-insight','natural-flow',label+' / 自然流推荐机制',[deckHeading('NATURAL REACH / 推荐如何发生','先让平台看懂，再让对的人看见。','自然流推荐，会根据内容相关性与用户反馈持续调整。'),naturalFlowMechanism()]],
      ['domestic-methods','domestic-method',label+' / 表达方法',[$('.scene-grid',root)]],
      ['domestic-delivery','roadmap',label+' / 交付与合作',[road,commercial]]
    ];
    if(id==='overseas')pages=[
      ['overseas-cpm-guide','cpm-guide-page',label+' / 全球CPM导览',[deckHeading('GLOBAL CPM GUIDE / 逐国声量','全球声量，按国家算清每一笔曝光。','选国家，看分档CPM；再按品牌目标组合曝光与预算。'),globalCpmGuide()]],
      ['overseas-cases-page','cases',label+' / 案例集',[h,meta,cases]],
      ['overseas-contribution','contribution',label+' / 脚本贡献',[$('.insight-heading',root),$('.contribution-board',root),$('.case-panel>.chart-footnote',root),$('.learning-strip',root)]],
      ['overseas-trend','trend',label+' / 两阶段复盘',[$('.trend-board',root)]],
      ['overseas-methods','country',label+' / 逐国方法',[$('.country-stage',root)]],
      ['overseas-delivery','roadmap',label+' / 交付与合作',[road,commercial]],
      ['matrix-script-cases','script-cases','从矩阵到转化 / 五类客户',[deckHeading('FROM ATTENTION TO ACTION','好脚本，从真实反馈里挑出来。','先验证用户有兴趣，再验证购买理由；每一步都有能接着用的内容。'),matrixScriptCases()]]
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
    const holding=document.createDocumentFragment();pages.forEach(p=>p[3].filter(Boolean).forEach(el=>holding.append(el)));root.replaceChildren();root.classList.add('deck-chapter');makeDeckPage(root,id+'-chapter','chapter-intro',label+' / 章节引导',[sceneChapter(id)]);const gallery=data.scenarioGalleries[id];makeDeckPage(root,id+'-work-wall','gallery',label+' / 精选作品集',[deckHeading(gallery.kicker,gallery.title,gallery.lead),makeScenarioGallery(id)]);pages.forEach(p=>makeDeckPage(root,...p));
  }
  const offers=$('#offering'),offerHeading=$('.section-heading',offers),offerGrid=$('.offer-grid',offers),pricing=$('.pricing-panel',offers);offers.replaceChildren();offers.classList.add('deck-chapter');
  makeDeckPage(offers,'offering-services','services','服务怎么采购',[offerHeading,offerGrid]);
  makeDeckPage(offers,'offering-pricing','pricing','场景合作方案',[deckHeading('SERVICE / PRICING','矩阵越成规模，\n曝光越有价格优势。'),pricing]);
  const teamRoot=$('#team'),teamHeading=$('.section-heading',teamRoot),core=$('.team-core',teamRoot),roles=$('.role-grid',teamRoot),split=$('.ai-split',teamRoot);teamRoot.replaceChildren();teamRoot.classList.add('deck-chapter');
  makeDeckPage(teamRoot,'team-platform','team-core','AI能力与团队价值',[teamHeading,core]);
  makeDeckPage(teamRoot,'team-roles','roles','AI Native团队分工',[deckHeading('AI NATIVE / PROFESSIONAL DELIVERY','一位负责人，\n接住整条交付链路。'),roles,split]);
  const closingRoot=$('#closing'),endNodes=[...$('.wrap',closingRoot).children];closingRoot.replaceChildren();closingRoot.classList.add('deck-chapter');makeDeckPage(closingRoot,'closing-page','closing','从首批内容开始',endNodes);
  document.body.classList.add('slide-deck');
  $('#contents-title').textContent=deckPages.length+'页 · 从品牌任务到内容结果';
  deckPages.forEach((p,i)=>$('.deck-number',p.el).textContent=pad(i+1)+' / '+pad(deckPages.length));
  const nav=document.createElement('nav');nav.className='deck-navigation';nav.setAttribute('aria-label','演示操作栏');nav.innerHTML=`<div class="deck-pagination"><button id="deck-prev" aria-label="上一页"><span aria-hidden="true">←</span><span>上一页</span></button><span id="deck-position" aria-live="polite">01 / ${pad(deckPages.length)}</span><button id="deck-next" aria-label="下一页"><span>下一页</span><span aria-hidden="true">→</span></button></div><div class="deck-tools"><button id="deck-contents" aria-controls="contents" aria-expanded="false">目录</button><button id="deck-language" data-locale-fixed title="中英文切换" aria-label="中英文切换" aria-pressed="false"><span class="lang-zh">中</span><span>/</span><span class="lang-en">EN</span></button><button id="deck-fullscreen">全屏</button><button id="deck-motion" aria-pressed="true">动效<i aria-hidden="true"></i></button></div>`;document.body.append(nav);
  $('#deck-contents').onclick=()=>$('#menu-toggle').click();$('#deck-fullscreen').onclick=()=>$('#fullscreen').click();$('#deck-motion').onclick=()=>$('#motion').click();
  document.body.insertAdjacentHTML('beforeend','<dialog id="wall-dialog" aria-labelledby="wall-title"><header><h2 id="wall-title">完整作品</h2><button data-dialog-close aria-label="关闭作品">×</button></header><video controls playsinline preload="metadata"></video><div id="wall-caption"></div></dialog>');
  $('#wall-dialog').addEventListener('close',()=>{const v=$('#wall-dialog video');v.removeAttribute('src');v.load();syncWallPreviews();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-wall]');if(b)openWallWork(b.dataset.wall);});document.addEventListener('visibilitychange',syncWallPreviews);
  const scale=new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--deck-scale',String(e.contentRect.width/1600));});$$('.deck-sheet').forEach(el=>scale.observe(el));
}
function goDeck(i){const n=Math.max(0,Math.min(deckPages.length-1,i));setDeckPosition(n);history.replaceState(null,'','#'+deckPages[n].id);window.scrollTo({top:0,behavior:'instant'});}
function setDeckPosition(i){deckActive=i;deckPages.forEach((p,j)=>{p.el.classList.toggle('is-current',j===i);if(j!==i)$$('video',p.el).forEach(v=>v.pause());});const sheet=$('.deck-sheet',deckPages[i].el),width=sheet.getBoundingClientRect().width;sheet.style.setProperty('--deck-scale',String(width/1600));document.documentElement.style.setProperty('--deck-sheet-height',width*9/16+'px');document.documentElement.style.setProperty('--deck-sheet-width',width+'px');$('#deck-position').textContent=pad(i+1)+' / '+pad(deckPages.length);$('#deck-prev').disabled=i===0;$('#deck-next').disabled=i===deckPages.length-1;$$('.desktop-nav a').forEach(a=>a.classList.toggle('current',a.hash==='#'+deckPages[i].el.parentElement.id));syncWallPreviews();updateCatalogCurrent();}
const catalogSpecs=[
 ['opening-page','品牌如何获得增长','all','让产品，持续出现在用户眼前。','价值主张'],
 ['model-page','品牌如何获得增长','methods','从一条种草，到持续放大的内容矩阵。','UGC × KOC × Clipo'],
 ['matrix-script-bridge','品牌如何获得增长','methods','一轮矩阵，留下两份价值。','品牌声量 + 转化脚本资产'],
 ['matrix-work-wall','品牌如何获得增长','cases','六个作品窗口，看内容如何跨行业展开。','完整版视频墙'],
 ['domestic-chapter','01 国内UGC矩阵','all','国内UGC矩阵','章节引导 · CPM声量方案'],
 ['domestic-work-wall','01 国内UGC矩阵','cases','行业不同，好内容各有一套。','多客户 / 多内容形式 / 六支完整视频'],
 ['domestic-platform-value','01 国内UGC矩阵','cases','同一个产品，按平台换打法。','抖音 / 小红书 / 快手 / 视频号'],
 ['domestic-report','01 国内UGC矩阵','cases','14天，完成1.24万次矩阵发布。','双平台阶段战报'],
 ['domestic-cases-page','01 国内UGC矩阵','cases','一批素材，持续供给多个账号。','案例集与真实作品'],
 ['domestic-insight','01 国内UGC矩阵','methods','先让平台看懂，再让对的人看见。','内容信号 / 兴趣匹配 / 用户反馈'],
 ['domestic-methods','01 国内UGC矩阵','methods','从一条作品，拆出可复用的内容结构。','产品 / 门店 / 热点'],
 ['domestic-delivery','01 国内UGC矩阵','delivery','每一步都有交付物，每一轮接回反馈。','交付路线与合作'],
 ['overseas-chapter','02 海外UGC矩阵','all','同一个产品，在不同国家各自讲通。','章节引导'],
 ['overseas-work-wall','02 海外UGC矩阵','cases','不同国家，都有自己的内容语感。','多客户 / 多内容形式 / 六支完整视频'],
 ['overseas-cpm-guide','02 海外UGC矩阵','methods','全球声量，按国家算清每一笔曝光。','全球CPM国家导览'],
 ['overseas-cases-page','02 海外UGC矩阵','cases','六国矩阵，留下可核对的传播实绩。','案例集与真实作品'],
 ['overseas-contribution','02 海外UGC矩阵','methods','不是每种脚本，都贡献同样的声量。','脚本贡献分析'],
 ['overseas-trend','02 海外UGC矩阵','methods','先验证方向，再决定下一轮怎么放量。','两阶段复盘'],
 ['overseas-methods','02 海外UGC矩阵','methods','逐国改表达，不只逐句翻译。','国家 / SKU / 本土内容'],
 ['overseas-delivery','02 海外UGC矩阵','delivery','一个总部Brief，接上逐国交付。','交付路线与合作'],
 ['matrix-script-cases','矩阵如何留下转化脚本','cases','好脚本，从真实反馈里挑出来。','五类客户的实际链路'],
 ['conversion-chapter','03 电商转化','all','有限素材，也能测试更多购买理由。','章节引导'],
 ['conversion-work-wall','03 电商转化','cases','不同产品，拆出不同的购买理由。','多客户 / 多内容形式 / 六支完整视频'],
 ['conversion-cases-page','03 电商转化','cases','从素材供给，到可比较的创意测试。','案例集与真实作品'],
 ['conversion-combinations','03 电商转化','methods','同一产品，组合出不同的购买理由。','内容组合公式'],
 ['conversion-decisions','03 电商转化','methods','测完之后，知道该复制还是该改。','测试决策路径'],
 ['conversion-scripts','03 电商转化','methods','换一个用户任务，写一套新脚本。','脚本实验室'],
 ['conversion-testing','03 电商转化','methods','一次测清一个变量，下一批更有方向。','创意测试设计'],
 ['conversion-delivery','03 电商转化','delivery','让测试结果，接回下一批内容。','交付路线与合作'],
 ['offering-services','合作与AI Native团队','delivery','按品牌这一轮的任务，选需要的服务。','服务Offering'],
 ['offering-pricing','合作与AI Native团队','delivery','矩阵越成规模，曝光越有价格优势。','三场景合作方案'],
 ['team-platform','合作与AI Native团队','methods','SKU再多，每一版都用同一份产品依据。','产品底座'],
 ['team-roles','合作与AI Native团队','delivery','AI把选择做多，专业团队把交付做稳。','团队与责任'],
 ['closing-page','合作与AI Native团队','delivery','带一个品牌任务，从第一批内容开始。','准备需求与下一步']
];
let catalogFilter='all';
function setupCatalog(){const aside=$('#contents');aside.className='viewer-catalog';aside.setAttribute('role','complementary');aside.removeAttribute('aria-modal');const groups=[...new Set(catalogSpecs.map(s=>s[1]))];aside.innerHTML=`<header><h2 id="contents-title">演示目录</h2><button data-close="contents" aria-label="返回演示">×</button></header><p class="catalog-summary"><span>${deckPages.length}</span><span> 页 · 三个核心场景 · </span><span>${media.works.length}</span><span> 段完整作品</span></p><label class="catalog-search"><input id="catalog-search" type="search" aria-label="搜索页面、案例或方法" placeholder="搜索页面、案例或方法"></label><div class="catalog-filters" role="group" aria-label="按内容筛选">${[['all','全部'],['cases','案例'],['methods','方法'],['delivery','交付']].map(([k,t])=>`<button data-catalog-filter="${k}" aria-pressed="${k==='all'}">${t}</button>`).join('')}</div><nav class="catalog-list" aria-label="逐页目录">${groups.map(g=>`<section class="catalog-group"><h3>${g}</h3>${catalogSpecs.filter(s=>s[1]===g).map(s=>`<a class="catalog-item" href="#${s[0]}" data-catalog-kind="${s[2]}"><small>${pad(deckPages.findIndex(p=>p.id===s[0])+1)}</small><div><b>${s[3]}</b><span>${s[4]}</span></div></a>`).join('')}</section>`).join('')}</nav><p class="catalog-empty" hidden>没有匹配页面，试试“案例”“国家”或“脚本”。</p><p class="catalog-footer">选择页面直接进入 · Esc返回演示</p>`;$('#catalog-search').addEventListener('input',filterCatalog);aside.addEventListener('click',e=>{const b=e.target.closest('[data-catalog-filter]');if(!b)return;catalogFilter=b.dataset.catalogFilter;$$('[data-catalog-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterCatalog();});updateCatalogCurrent();}
function filterCatalog(){const q=$('#catalog-search').value.trim().toLocaleLowerCase();let count=0;$$('.catalog-item').forEach(a=>{const p=deckPages.find(x=>'#'+x.id===a.hash),text=(a.textContent+' '+(p?.el.textContent||'')).toLocaleLowerCase(),show=(!q||text.includes(q))&&(catalogFilter==='all'||a.dataset.catalogKind===catalogFilter);a.hidden=!show;if(show)count++;});$$('.catalog-group').forEach(g=>g.hidden=!$$('.catalog-item',g).some(a=>!a.hidden));$('.catalog-empty').hidden=count>0;}
function updateCatalogCurrent(){$$('.catalog-item').forEach(a=>{const on=a.hash==='#'+deckPages[deckActive]?.id;a.classList.toggle('current',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
paginateDeck();setDeckPosition(0);setCpmCountry('VN');document.addEventListener('click',e=>{const c=e.target.closest('[data-cpm-country]');if(c){setCpmCountry(c.dataset.cpmCountry);cpmTourHoldUntil=Date.now()+12000;syncCpmTour();}});
$('#deck-prev').onclick=()=>goDeck(deckActive-1);$('#deck-next').onclick=()=>goDeck(deckActive+1);
function syncHashToDeck(){const hash=location.hash.slice(1),id=['domestic','overseas','conversion'].includes(hash)?hash+'-chapter':hash,target=document.getElementById(id);if(!target)return;const frame=target.closest('.deck-frame')||$('.deck-frame',target);const i=deckPages.findIndex(p=>p.el===frame);if(i>=0){setDeckPosition(i);window.scrollTo({top:0,behavior:'instant'});}}
addEventListener('hashchange',syncHashToDeck);addEventListener('resize',()=>requestAnimationFrame(()=>setDeckPosition(deckActive)));
$('.deck-navigation').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();goDeck(deckActive+(e.key==='ArrowRight'?1:-1));}});

const cpmGuide=$('.cpm-guide');cpmGuide.addEventListener('pointerenter',()=>{cpmTourHover=true;syncCpmTour();});cpmGuide.addEventListener('pointerleave',()=>{cpmTourHover=false;syncCpmTour();});$('#cpm-tour-toggle').onclick=()=>{if(!motion){motion=true;cpmTourEnabled=true;updateMotion();}else cpmTourEnabled=!cpmTourEnabled;cpmTourHoldUntil=0;syncCpmTour();};
