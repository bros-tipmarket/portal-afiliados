export const TODAY = '2026-09-11';
export const CODE = 'AF7K2Q';
export type Campaign = {id:string;name:string;status:'ACTIVE'|'INACTIVE';created_at:string};
export const initialCampaigns:Campaign[] = [
 {id:'c_01',name:'geral',status:'ACTIVE',created_at:'2026-05-01'},
 {id:'c_12',name:'telegram_grupo_vip',status:'ACTIVE',created_at:'2026-05-12'},
 {id:'c_13',name:'youtube_analises',status:'ACTIVE',created_at:'2026-06-03'},
 {id:'c_14',name:'instagram',status:'ACTIVE',created_at:'2026-07-15'},
 {id:'c_15',name:'newsletter_crypto',status:'INACTIVE',created_at:'2026-05-20'}
];
export const metricKeys=['clicks','signups','ftds','ftdValue','qualified','active','deposits','volume','ngr','commission'] as const;
export type MetricKey=typeof metricKeys[number];
export type Metrics=Record<MetricKey,number>;
export type Row=Metrics&{date:string;campaign:string;market_type:string};
export const labels:Record<MetricKey,string>={clicks:'Cliques',signups:'Cadastros',ftds:'Primeiros depósitos',ftdValue:'Valor dos primeiros depósitos',qualified:'Clientes qualificados',active:'Clientes ativos',deposits:'Depósitos',volume:'Volume negociado',ngr:'Receita líquida (NGR)',commission:'Comissão estimada'};
export const definitions:Record<MetricKey,string>={clicks:'Cliques registrados nos seus links de afiliado no período.',signups:'Cadastros atribuídos ao seu código no período.',ftds:'Clientes atribuídos que realizaram seu primeiro depósito no período.',ftdValue:'Valor dos primeiros depósitos realizados no período.',qualified:'Clientes que atenderam aos critérios de qualificação do acordo vigente.',active:'Clientes atribuídos com atividade no período. Dados de demonstração.',deposits:'Valor total depositado pelos clientes atribuídos no período.',volume:'Volume total negociado pelos clientes atribuídos no período.',ngr:'Receita líquida de jogo usada como base do revenue share.',commission:'Estimativa de revenue share e CPA. O valor é confirmado no fechamento financeiro.'};
export const money=(c:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD'}).format(c/100);
export const number=(n:number)=>new Intl.NumberFormat('pt-BR').format(n);
export const dateLabel=(d:string)=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR');
export const isMoney=(k:MetricKey)=>['ftdValue','deposits','volume','ngr','commission'].includes(k);
export const format=(k:MetricKey,n:number)=>isMoney(k)?money(n):number(n);
export function sum(rows:Metrics[]):Metrics {return Object.fromEntries(metricKeys.map(k=>[k,rows.reduce((s,r)=>s+r[k],0)])) as Metrics;}
export const activity:Row[]=[];
for(let d=new Date('2026-05-01T12:00:00Z');d.toISOString().slice(0,10)<=TODAY;d.setUTCDate(d.getUTCDate()+1)){
 initialCampaigns.forEach((c,i)=>{if(c.created_at>d.toISOString().slice(0,10)||(c.status==='INACTIVE'&&d.getUTCMonth()>6))return;
 for(let t=0;t<2;t++){const seed=d.getUTCDate()*7+d.getUTCMonth()*11+i*17+t*13;
 const clicks=80+(seed*19)%370;const signups=i===3?0:Math.floor(clicks/(i===1?8:15));const ftds=Math.floor(signups*.42);const qualified=Math.floor(ftds*.75);const ngr=i===3?0:(seed%70+9)*100;const active=i===3?0:ftds+seed%7;
 activity.push({date:d.toISOString().slice(0,10),campaign:c.id,market_type:t?'Fast markets':'Mercados de previsão',clicks,signups,ftds,ftdValue:ftds*4500,qualified,active,deposits:active*7200,volume:active*23800,ngr,commission:Math.round(ngr*.3)+qualified*1000});}
 });
}
// Closed demonstration snapshots reconcile with the same daily fixture source.
// These are sample records, not an implementation of backoffice economics.
for(const [month,ngr,qualified,commission] of [['2026-05',-56000,5,0],['2026-06',458000,40,165600],['2026-07',534100,57,218430]] as const){
 const records=activity.filter(r=>r.date.startsWith(month)&&r.campaign!=='c_14');
 for(const [key,target] of [['ngr',ngr],['qualified',qualified],['commission',commission]] as const){
  const sign=Math.sign(target);const absolute=Math.abs(target);const base=Math.floor(absolute/records.length);const rest=absolute%records.length;
  records.forEach((r,i)=>{r[key]=sign*(base+(i<rest?1:0));});
 }
}
export function query(from:string,to:string,campaigns:string[]=[],breakdown=false){
 const filtered=activity.filter(r=>r.date>=from&&r.date<=to&&(!campaigns.length||campaigns.includes(r.campaign)));
 const groups=new Map<string,Row[]>();filtered.forEach(r=>{const key=r.date+(breakdown?'|'+r.market_type:'');groups.set(key,[...(groups.get(key)||[]),r]);});
 return [...groups.values()].map(rs=>({...sum(rs),date:rs[0].date,campaign:'',market_type:breakdown?rs[0].market_type:''})).sort((a,b)=>b.date.localeCompare(a.date)||a.market_type.localeCompare(b.market_type));
}
export function periodRange(period:string):[string,string]{switch(period){case 'today':return [TODAY,TODAY];case 'yesterday':return ['2026-09-10','2026-09-10'];case 'week':return ['2026-09-05',TODAY];case 'last':return ['2026-08-01','2026-08-31'];default:return ['2026-09-01',TODAY];}}
export function csvCell(v:unknown){let s=String(v??'');if(/^[=+@\t\r]/.test(s)||(/^\s*-/.test(s)&&!/^\-\d+(\.\d+)?$/.test(s)))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function csv(headers:string[],rows:unknown[][]){return '\uFEFF'+[headers,...rows].map(r=>r.map(csvCell).join(';')).join('\r\n');}
export function download(name:string,content:string,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function validateCampaign(name:string,campaigns:Campaign[],id?:string){if(!name.trim())return 'Informe um nome para a campanha.';if(name.trim().length>80)return 'Use até 80 caracteres.';if(campaigns.some(c=>c.id!==id&&c.name.trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase()))return 'Você já tem uma campanha com esse nome.';return '';}
export function buildLink(path:string,campaign:string,clickId='',source='',medium=''){if(!path.startsWith('/')||path.startsWith('//')||/[?#]/.test(path))throw Error('Destino inválido');if(!campaign)throw Error('Selecione uma campanha');const u=new URL(path,process.env.NEXT_PUBLIC_B2C_ORIGIN||'https://tipmarket.example');u.searchParams.set('ref',CODE);u.searchParams.set('campaign',campaign);if(clickId.trim())u.searchParams.set('click_id',clickId.trim());if(source.trim())u.searchParams.set('utm_source',source.trim());if(medium.trim())u.searchParams.set('utm_medium',medium.trim());return u.toString().replaceAll('%7Bclick_id%7D','{click_id}');}
