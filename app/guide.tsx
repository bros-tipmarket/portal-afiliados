'use client';
import {useState,useEffect,useLayoutEffect,useCallback,useRef} from 'react';
import {X,ArrowRight,ArrowLeft,Compass} from 'lucide-react';
import {guide,statusLabels,GuideStep} from '@/lib/guide';

const MARGIN=10;      // respiro entre o destaque e o elemento
const CARD_WIDTH=380;
const GAP=14;         // distância do cartão até o destaque

type Box={top:number;left:number;width:number;height:number};

function useIsNarrow(){
 const [narrow,setNarrow]=useState(false);
 useEffect(()=>{
  const query=window.matchMedia('(max-width: 900px)');
  const apply=()=>setNarrow(query.matches);
  apply();query.addEventListener('change',apply);
  return ()=>query.removeEventListener('change',apply);
 },[]);
 return narrow;
}

/**
 * Posição do cartão: abaixo do destaque, senão acima. Quando o elemento é mais
 * alto que a tela — a lista de extratos, o bloco lateral da home — não sobra
 * espaço dos dois lados, e o cartão vai para o rodapé em vez de sair da tela.
 */
function placeCard(box:Box,cardHeight:number){
 const left=Math.min(Math.max(box.left,16),Math.max(16,window.innerWidth-CARD_WIDTH-16));
 const below=box.top+box.height+GAP;
 if(below+cardHeight<window.innerHeight-12)return {top:below,left};
 if(box.top-GAP-cardHeight>12)return {top:box.top-GAP,left,transform:'translateY(-100%)'};
 return null;
}

export default function Guide({page,setPage,onClose}:{page:string;setPage:(p:string)=>void;onClose:()=>void}){
 const [index,setIndex]=useState(0);
 const [box,setBox]=useState<Box|null>(null);const [cardHeight,setCardHeight]=useState(300);
 const narrow=useIsNarrow();
 const cardRef=useRef<HTMLDivElement>(null);
 const step:GuideStep=guide[index];
 const last=index===guide.length-1;

 // O guia troca de tela sozinho; a medição espera o conteúdo novo entrar.
 useEffect(()=>{if(step.page!==page)setPage(step.page);},[index,step.page,page,setPage]);

 const measure=useCallback(()=>{
  if(!step.selector){setBox(null);return;}
  const target=document.querySelector(step.selector);
  if(!target){setBox(null);return;}
  const rect=target.getBoundingClientRect();
  if(!rect.width&&!rect.height){setBox(null);return;}
  // O destaque nunca passa da tela: elementos altos ficam recortados na parte visível.
  const top=Math.min(Math.max(8,rect.top-MARGIN),window.innerHeight-32);
  const bottom=Math.min(window.innerHeight-8,rect.bottom+MARGIN);
  const next={top,left:rect.left-MARGIN,width:rect.width+MARGIN*2,height:Math.max(24,bottom-top)};
  setBox(prev=>prev&&prev.top===next.top&&prev.left===next.left&&prev.width===next.width&&prev.height===next.height?prev:next);
 },[step.selector]);

 useEffect(()=>{
  const target=step.selector?document.querySelector(step.selector):null;
  // Elemento mais alto que a tela: alinhar pelo topo, senão o começo dele some.
  const tall=target?target.getBoundingClientRect().height>window.innerHeight*0.7:false;
  target?.scrollIntoView({block:tall?'start':'center',behavior:'smooth'});
  // O rolamento é suave e a troca de tela tem animação: medir uma vez só fixaria
  // a posição no meio do movimento. Remede até o alvo parar de se mexer.
  // Por timer, e não por quadro de animação: em aba de fundo o navegador
  // suspende requestAnimationFrame e o destaque nunca sairia do lugar.
  let timer=0,stable=0,previous='',rescued=false;
  const start=Date.now();
  const settle=()=>{
   measure();
   const element=step.selector?document.querySelector(step.selector):null;
   const rect=element?element.getBoundingClientRect():null;
   const key=rect?`${Math.round(rect.top)}:${Math.round(rect.left)}:${Math.round(rect.height)}`:'';
   if(key===previous)stable+=1;else{stable=0;previous=key;}
   const done=stable>=3||Date.now()-start>1500;
   if(done){
    const outOfView=rect&&(rect.bottom<0||rect.top>window.innerHeight);
    // Aba de fundo e "movimento reduzido" suspendem o rolamento suave: se o
    // alvo continuou fora da tela, reposiciona sem animação e mede de novo.
    if(outOfView&&!rescued){
     rescued=true;stable=0;previous='';
     element?.scrollIntoView({block:tall?'start':'center',behavior:'auto'});
    }else return;
   }
   timer=window.setTimeout(settle,60);
  };
  settle();
  return ()=>window.clearTimeout(timer);
 },[index,measure,step.selector]);

 useEffect(()=>{
  window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);
  return ()=>{window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);};
 },[measure]);

 useEffect(()=>{cardRef.current?.focus();},[index]);
 // A altura do cartão muda por etapa e entra na escolha do lado; guardar em
 // estado garante um novo render com o valor certo em vez do da etapa anterior.
 useLayoutEffect(()=>{const height=cardRef.current?.offsetHeight;if(height&&height!==cardHeight)setCardHeight(height);},[index,cardHeight,box]);

 const next=useCallback(()=>{if(last)onClose();else setIndex(i=>i+1);},[last,onClose]);
 const previous=useCallback(()=>setIndex(i=>Math.max(0,i-1)),[]);

 useEffect(()=>{
  function onKey(event:KeyboardEvent){
   if(event.key==='Escape'){onClose();return;}
   if(event.key==='ArrowRight'){event.preventDefault();next();}
   if(event.key==='ArrowLeft'){event.preventDefault();previous();}
  }
  window.addEventListener('keydown',onKey);
  return ()=>window.removeEventListener('keydown',onKey);
 },[next,previous,onClose]);

 const position=box&&!narrow?placeCard(box,cardHeight):undefined;
 const centered=!box&&!narrow;
 // Destaque na tela, mas sem espaço para o cartão ao lado dele.
 const floating=Boolean(box)&&!narrow&&position===null;

 return <div className="guia">
  {box
   ?<div className="guia-foco" style={{top:box.top,left:box.left,width:box.width,height:box.height}}/>
   :<div className="guia-fundo"/>}
  <div
   ref={cardRef}
   tabIndex={-1}
   role="dialog"
   aria-modal="true"
   aria-labelledby="guia-titulo"
   className={'guia-cartao'+(centered?' guia-centro':'')+(narrow?' guia-rodape':'')+(floating?' guia-flutuante':'')}
   style={position??undefined}>
   <div className="guia-topo">
    <span className="guia-marca"><Compass size={15}/>Guia da equipe</span>
    <span className="guia-contagem">Etapa {index+1} de {guide.length}</span>
    <button className="guia-fechar" onClick={onClose} aria-label="Fechar o guia"><X size={16}/></button>
   </div>
   <div className="guia-barra"><span style={{width:((index+1)/guide.length*100)+'%'}}/></div>
   <h2 id="guia-titulo">{step.title}</h2>
   <p>{step.body}</p>
   {step.bullets&&<ul className="guia-itens">{step.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
   <div className="guia-referencia">
    <code>{step.prd}</code>
    {step.status&&<span className={'badge '+(step.status==='conforme'?'green':step.status==='pendente'?'yellow':'neutral')}>{statusLabels[step.status]}</span>}
   </div>
   <div className="guia-acoes">
    <button className="text-button" onClick={onClose}>Sair do guia</button>
    <button className="btn" onClick={previous} disabled={index===0}><ArrowLeft size={15}/>Anterior</button>
    <button className="btn primary" onClick={next}>{last?'Concluir':'Próxima'}<ArrowRight size={15}/></button>
   </div>
  </div>
 </div>;
}
