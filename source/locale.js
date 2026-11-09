// Offline, reviewed copy: no translation service or external request is needed.
const englishCopy=JSON.parse($('#locale-en-data').textContent),textOrigins=new WeakMap(),attributeOrigins=new WeakMap();
const normalizeCopy=s=>String(s??'').replace(/\s+/g,' ').trim();
let currentLocale='zh',localeQueued=false;
const originalDocumentTitle=document.title;
function textOrigin(node){let r=textOrigins.get(node),value=node.data;if(!r){r={raw:value,last:value};textOrigins.set(node,r);}else if(value!==r.last&&value!==r.raw){r.raw=value;r.last=value;}return r;}
function convertDisplayNumber(node,raw){if(!/^[\d,.]+$/.test(normalizeCopy(raw))||node.parentElement?.tagName!=='STRONG')return null;const small=node.parentElement.querySelector('small');if(!small)return null;const unit=[...small.childNodes].filter(n=>n.nodeType===3).map(n=>textOrigin(n).raw).join('');if(!normalizeCopy(unit).startsWith('万次'))return null;return (Number(raw.replace(/,/g,''))/100).toLocaleString('en-US',{maximumFractionDigits:3})+'M';}
function translateContent(){
  const nodes=[],walk=document.createTreeWalker(document.body,4);let node;
  while(node=walk.nextNode()){if(node.parentElement?.closest('script,style,[data-locale-fixed]'))continue;textOrigin(node);nodes.push(node);}
  for(const n of nodes){const r=textOrigin(n),key=normalizeCopy(r.raw),number=currentLocale==='en'?convertDisplayNumber(n,r.raw):null;let value=r.raw;if(currentLocale==='en'&&(number!==null||englishCopy[key])){const leading=r.raw.match(/^\s*/)?.[0]||'',trailing=r.raw.match(/\s*$/)?.[0]||'';value=leading+(number??englishCopy[key])+trailing;}if(n.data!==value)n.data=value;r.last=value;}
  for(const el of $$('[aria-label],[title],[alt],[placeholder]')){if(el.closest('[data-locale-fixed]'))continue;let records=attributeOrigins.get(el);if(!records){records={};attributeOrigins.set(el,records);}for(const name of ['aria-label','title','alt','placeholder']){const value=el.getAttribute(name);if(value===null)continue;let r=records[name];if(!r)r=records[name]={raw:value,last:value};else if(value!==r.last&&value!==r.raw){r.raw=value;r.last=value;}const translated=currentLocale==='en'?(englishCopy[normalizeCopy(r.raw)]||r.raw):r.raw;if(value!==translated)el.setAttribute(name,translated);r.last=translated;}}
}
function changeLocale(locale,remember=true){
  currentLocale=locale==='en'?'en':'zh';document.documentElement.lang=currentLocale==='en'?'en':'zh-CN';document.body.classList.toggle('locale-en',currentLocale==='en');
  translateContent();const b=$('#deck-language');b.setAttribute('aria-pressed',String(currentLocale==='en'));b.setAttribute('aria-label',currentLocale==='en'?'Switch to Chinese':'切换到英文');b.title=currentLocale==='en'?'Switch to Chinese':'切换到英文';
  document.title=currentLocale==='en'?(englishCopy[normalizeCopy(originalDocumentTitle)]||'SuperContent Clipo | UGC & Content Growth'):originalDocumentTitle;
  if(remember){try{localStorage.setItem('sc-v20-locale',currentLocale);}catch{}const url=new URL(location.href);if(currentLocale==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url.pathname+url.search+url.hash);}
  filterCatalog();setDeckPosition(deckActive);
}
$('#deck-language').onclick=()=>changeLocale(currentLocale==='zh'?'en':'zh');
let preferredLocale=new URLSearchParams(location.search).get('lang');if(!preferredLocale){try{preferredLocale=localStorage.getItem('sc-v20-locale');}catch{}}
changeLocale(preferredLocale||'zh',false);
const localeObserver=new MutationObserver(()=>{if(localeQueued)return;localeQueued=true;queueMicrotask(()=>{localeQueued=false;translateContent();});});
localeObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});
