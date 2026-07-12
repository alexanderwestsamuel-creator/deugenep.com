document.querySelectorAll('[data-year]').forEach((element)=>{element.textContent=new Date().getFullYear()});
requestAnimationFrame(()=>document.body.classList.add('ready'));

const clamp=(value)=>Math.min(1,Math.max(0,value));
const opening=document.querySelector('[data-opening]');
let ticking=false;

function paint(){
  ticking=false;
  if(opening){
    document.body.classList.toggle('past-opening',window.scrollY>opening.offsetHeight*.65);
  }
}

function requestPaint(){if(!ticking){ticking=true;requestAnimationFrame(paint)}}
window.addEventListener('scroll',requestPaint,{passive:true});
window.addEventListener('resize',requestPaint,{passive:true});
paint();

const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -7%'});
document.querySelectorAll('.fade').forEach((element)=>observer.observe(element));
document.querySelectorAll('.reveal').forEach((element)=>observer.observe(element));
requestAnimationFrame(()=>document.documentElement.classList.add('motion-ready'));

const lookbook=document.querySelector('[data-lookbook]');
const viewer=document.querySelector('[data-viewer]');
if(lookbook&&viewer){
  const labels=['SS26 opening image','SS26 title page','SS26 collection statement','The Shell of a Man, back view','The Shell of a Man, front view','The Shell of a Man statement','White jacket and black shorts look','White suiting and leather accessory look','White fabric movement detail','dEugenep monogram','White pleated skirt look','White pleated skirt side view','The Clutch full view','The Clutch detail','The Clutch statement','White dress movement detail','White dress overhead movement','The Dress of Masculinity statement','The Dress of Masculinity','SS26 open-back white look','Sculptural white trouser look','White sleeve portrait','White shirt and black shorts look','Black leather look','Black garment detail','Black shirt and leather cuff look','SS26 closing page','dEugenep SS26 closing image'];
  const viewerImage=viewer.querySelector('img');
  const viewerCount=viewer.querySelector('.viewer-count');
  const pageContent=document.querySelector('.page-enter');
  const persistentUi=[document.querySelector('.site-logo'),document.querySelector('.site-nav')].filter(Boolean);
  let current=0;
  let returnFocus=null;
  const show=(index)=>{
    current=(index+labels.length)%labels.length;
    const number=String(current+1).padStart(2,'0');
    viewerImage.src=`assets/ss26/page-${number}.jpg`;
    viewerImage.alt=labels[current];
    viewerCount.textContent=`${number} / 28`;
  };
  const open=(index=0)=>{returnFocus=document.activeElement;show(index);viewer.classList.add('open');viewer.setAttribute('aria-hidden','false');document.body.classList.add('viewer-open');if(pageContent)pageContent.inert=true;persistentUi.forEach((element)=>element.inert=true);viewer.querySelector('.viewer-close').focus()};
  const close=()=>{viewer.classList.remove('open');viewer.setAttribute('aria-hidden','true');document.body.classList.remove('viewer-open');if(pageContent)pageContent.inert=false;persistentUi.forEach((element)=>element.inert=false);returnFocus?.focus()};
  lookbook.addEventListener('click',(event)=>{const button=event.target.closest('[data-index]');if(button)open(Number(button.dataset.index))});
  document.querySelectorAll('[data-view]').forEach((button)=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-view]').forEach((item)=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});
    lookbook.classList.toggle('grid',button.dataset.view==='grid');
  }));
  document.querySelector('[data-fullscreen]')?.addEventListener('click',()=>open(0));
  viewer.querySelector('.viewer-close').addEventListener('click',close);
  viewer.querySelector('.viewer-prev').addEventListener('click',()=>show(current-1));
  viewer.querySelector('.viewer-next').addEventListener('click',()=>show(current+1));
  document.addEventListener('keydown',(event)=>{
    if(!viewer.classList.contains('open'))return;
    if(event.key==='Escape')close();
    if(event.key==='ArrowLeft')show(current-1);
    if(event.key==='ArrowRight')show(current+1);
    if(event.key==='Tab'){
      const controls=[...viewer.querySelectorAll('button')];
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
}
