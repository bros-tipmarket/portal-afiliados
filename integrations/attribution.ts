/** B2C integration adapter. Run on the player origin, never the affiliate portal.
 * Status, click ingestion and attribution decisions belong to the backend.
 */
export type Attribution={ref:string;campaign_id:string;click_id:string;landing_target:'HOME'|'CATEGORY'|'MARKET';landing_market_id:string;utm_source:string;utm_medium:string;referrer_url:string;clicked_at:string};
export async function captureAffiliateClick(options:{url:string;referrer:string;marketId?:string;fetcher:typeof fetch;setCookie:(cookie:string)=>void;now?:Date}):Promise<Attribution|null>{
 const url=new URL(options.url);const ref=url.searchParams.get('ref');if(!ref)return null;
 const now=options.now||new Date();
 try{
  const response=await options.fetcher('/public/attribution/codes/'+encodeURIComponent(ref)+'/status',{signal:AbortSignal.timeout(4000)});
  if(!response.ok)return null;
  const status=await response.json();
  if(!status||typeof status!=='object'||!('trackable' in status)||status.trackable!==true)return null;
  const payload:Attribution={ref,campaign_id:url.searchParams.get('campaign')||'',click_id:url.searchParams.get('click_id')||'',landing_target:url.pathname.startsWith('/m/')?'MARKET':url.pathname.startsWith('/c/')?'CATEGORY':'HOME',landing_market_id:options.marketId||'',utm_source:url.searchParams.get('utm_source')||'',utm_medium:url.searchParams.get('utm_medium')||'',referrer_url:options.referrer,clicked_at:now.toISOString()};
  options.setCookie('tm_attr='+encodeURIComponent(JSON.stringify(payload))+'; Path=/; Max-Age=2592000; SameSite=Lax; Secure');
  // Do not block rendering on ingestion. Idempotency and rate limiting are server-owned.
  void options.fetcher('/public/attribution/clicks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
  return payload;
 }catch{return null;}
}
export function registrationAttribution(code:string,cookie:Attribution|null){return {attribution_code:code.trim()||undefined,attribution_cookie:cookie};}
// Google OAuth must carry the edited code in a SHORT-LIVED SIGNED server state.
// Never sign state in this browser adapter or infer acquisition_source here.

