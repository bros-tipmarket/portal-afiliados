'use client';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Tooltip,TooltipTrigger,TooltipContent} from '@/components/ui/tooltip';
import {Info} from 'lucide-react';
import {toast} from 'sonner';
export function Picker({value,onChange,options,label,disabled=false}:{value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];label:string;disabled?:boolean}){return <Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger aria-label={label} className="picker"><SelectValue placeholder="Selecione"/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;}
export async function copy(text:string){try{await navigator.clipboard.writeText(text);toast.success('Copiado para a área de transferência.');}catch{toast.error('Não foi possível copiar. Selecione o texto e copie manualmente.');}}
export function Help({text}:{text:string}){return <Tooltip><TooltipTrigger asChild><button type="button" className="help-icon" aria-label={text}><Info size={14}/></button></TooltipTrigger><TooltipContent className="max-w-72">{text}</TooltipContent></Tooltip>;}
export function readLocal<T>(key:string,fallback:T):T{try{const value=localStorage.getItem('tm-demo:'+key);return value?JSON.parse(value):fallback;}catch{return fallback;}}
export function saveLocal(key:string,value:unknown){try{localStorage.setItem('tm-demo:'+key,JSON.stringify(value));return true;}catch{toast.error('Não foi possível salvar neste navegador. Libere espaço e tente novamente.');return false;}}

// Lê o token do convite tanto da query quanto do hash. O link enviado por e-mail
// usa ?convite=<token>; colado depois de um hash de navegação, o parâmetro acaba
// atrás do # e `location.search` fica vazio.
export function readInvite():string|null{
 try{
  const search=new URLSearchParams(window.location.search);
  const hash=window.location.hash.slice(1);
  const afterQuestion=hash.includes('?')?hash.slice(hash.indexOf('?')+1):hash;
  const fromHash=new URLSearchParams(afterQuestion);
  return search.get('convite')||search.get('invite')||fromHash.get('convite')||fromHash.get('invite');
 }catch{return null;}
}
