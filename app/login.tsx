'use client';
import {asset} from '@/lib/utils';
import {useState} from 'react';
import {ArrowRight,Check,LockKeyhole,ShieldCheck,Mail} from 'lucide-react';
import {InputOTP,InputOTPGroup,InputOTPSlot} from '@/components/ui/input-otp';
import {toast} from 'sonner';

// Credenciais da demonstração. Ficam visíveis na tela porque o portal
// publicado precisa ser acessível pela equipe; nada aqui protege acesso real.
// A autenticação verdadeira depende do Kratos (realm affiliates), conforme o
// item 1 do README e a Feature 1 do PRD.
export const DEMO_EMAIL='afiliado@demo.tipmarket';
export const DEMO_PASSWORD='parceria2026';
export const DEMO_CODE='123456';

export default function Login({onSuccess,onInvite}:{onSuccess:()=>void;onInvite:()=>void}){
 const [step,setStep]=useState(0);const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [otp,setOtp]=useState('');
 function submitCredentials(e:React.FormEvent){e.preventDefault();
  if(email.trim().toLowerCase()!==DEMO_EMAIL||password!==DEMO_PASSWORD){toast.error('E-mail ou senha não conferem. Use as credenciais de demonstração indicadas na tela.');return;}
  setPassword('');setStep(1);}
 function submitCode(e:React.FormEvent){e.preventDefault();
  if(otp!==DEMO_CODE){toast.error(`Código inválido. Nesta demonstração, use ${DEMO_CODE}.`);setOtp('');return;}
  onSuccess();}
 return <div className="onboarding"><aside className="onboarding-brand">
  <a className="brand" href="#"><img src={asset('brand/logo-white.svg')} alt="Tipmarket" width="180" height="40"/></a>
  <div><span className="eyebrow">PORTAL DO AFILIADO</span><h1>Bem-vindo<br/>de volta.</h1><p>Acompanhe cliques, cadastros, comissões e extratos da sua parceria.</p></div>
  <small>TipMarket · Portal do afiliado</small></aside>
 <main><span className="demo-pill">Acesso · Simulação local</span>
  <div className="onboarding-progress">{['Credenciais','Verificação'].map((s,i)=><span className={step>=i?'current':''} key={s}>{step>i?<Check size={15}/>:<b>{i+1}</b>}{s}</span>)}</div>
  <section className="onboarding-content">
   <span className="access-icon">{step===0?<LockKeyhole/>:<ShieldCheck/>}</span>
   <h1>{step===0?'Entrar no portal':'Verificação em duas etapas'}</h1>
   <p>{step===0?'Informe o e-mail e a senha da sua parceria.':'Informe o código de seis dígitos do seu aplicativo autenticador. O portal não abre nenhuma tela antes desta verificação.'}</p>
   {step===0
    ?<form onSubmit={submitCredentials}>
      <label className="field">E-mail<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label className="field">Senha<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      <div className="demo-credentials"><Mail size={18}/><div><strong>Credenciais de demonstração</strong><p>E-mail <b>{DEMO_EMAIL}</b> · Senha <b>{DEMO_PASSWORD}</b> · Código <b>{DEMO_CODE}</b></p></div></div>
      <button className="btn primary full" type="submit">Continuar<ArrowRight size={17}/></button>
     </form>
    :<form onSubmit={submitCode}>
      <label className="field">Código de verificação<InputOTP aria-label="Código de verificação" maxLength={6} pattern="[0-9]*" value={otp} onChange={setOtp}><InputOTPGroup>{Array.from({length:6},(_,i)=><InputOTPSlot key={i} index={i}/>)}</InputOTPGroup></InputOTP></label>
      <p className="field-note">Nesta demonstração, use <b>{DEMO_CODE}</b>. Perdeu o acesso ao aplicativo? O código de backup é tratado pelo gerente do programa.</p>
      <button className="btn primary full" type="submit">Entrar<ArrowRight size={17}/></button>
      <button className="btn full" type="button" onClick={()=>{setOtp('');setStep(0);}}>Voltar</button>
     </form>}
  </section>
  <div className="invite-entry"><div><strong>Primeiro acesso ao programa?</strong><p>Ele começa pelo convite enviado por e-mail no seu cadastro.</p></div><button className="btn" type="button" onClick={onInvite}>Usar meu convite<ArrowRight size={16}/></button></div>
  <p className="onboarding-note">Simulação da experiência: o acesso real dependerá do convite, do Kratos e dos termos oficiais.</p>
 </main></div>;
}
