# TipMarket Partners - portal local

Implementação local baseada no PRD 17 (v1.0, 09/09/2026) e no relatório MyAffiliates. Os 19 prints do relatório foram inspecionados; o escopo seguido é o PRD, incluindo a ausência de gráficos no MVP.

## Executar

Na pasta superior, abra **Iniciar plataforma.cmd** e acesse http://localhost:5173.

Ou, nesta pasta:

```sh
npm ci
npm run dev
```

Requer Node.js 22.13 ou superior. Dependências já instaladas neste computador. Dados demonstrativos têm data de referência fixa em 11/09/2026, com histórico a partir de maio. Não há publicação ou serviço externo de dados.

## O que funciona

- Visão geral: seis KPIs, definições, período predefinido/personalizado, filtro de campanhas, tabela diária, código copiável e resumo financeiro. Períodos ainda não confirmados usam “estimada/prévia”.
- Relatórios: campanha múltipla, datas, quebra por mercado, dez métricas, paginação, total do recorte, exportação CSV de todas as páginas filtradas. Somente agregados.
- Links: home/categoria/mercado, busca no catálogo demonstrativo, campanha obrigatória e criação inline, click_id fixo ou `{click_id}`, UTMs e histórico local.
- Campanhas: criar, renomear e confirmar desativação; unicidade sem distinguir maiúsculas; histórico preservado e inativas excluídas do gerador.
- Extratos: cinco estados, detalhamento de NGR, revshare, CPA, carryover, ajustes, pagamentos e referência copiável; CSV e PDFs efetivos; cenário negativo explicado.
- Perfil: contato, idioma de preferência e notificações persistidos localmente; identidade, deal e pagamento mascarado somente leitura. A interface permanece em português nesta versão.
- Login obrigatório (PRD, Feature 1): e-mail e senha, depois o código de duas etapas. Nenhuma tela do portal abre antes da verificação. Credenciais da demonstração, exibidas na própria tela: `afiliado@demo.tipmarket` · `parceria2026` · código `123456`. A sessão fica em `localStorage` e o botão de sair, no topo, encerra.
- Primeiro acesso demonstrativo: entra pelo link de convite `?convite=<token>` (o token também é lido depois do `#`) ou pelo botão "Usar meu convite", na tela de login, para que o fluxo não dependa da URL sobreviver ao caminho até o afiliado. Senha de teste (não armazenada), QR ilustrativo, código 123456, backup, termos demo-1.0 e registro de versão/data; ao concluir, a sessão é aberta e o parâmetro sai da URL.
- Menu “Ambiente local · Demonstração”: estados ACTIVE/PENDING/SUSPENDED/TERMINATED, programa inativo, sem atividade, falha e fluxo de primeiro acesso. Estado suspenso/inativo bloqueia as escritas do portal.
- Interface responsiva, controles acessíveis por teclado, feedback de ações e estados vazios.

## Publicação

O portal está publicado em <https://bros-tipmarket.github.io/portal-afiliados/>, para a equipe navegar sem instalar nada. É o mesmo ambiente demonstrativo: dados fixos, `localStorage` e nenhuma integração real. O link é público na internet — não inserir credenciais nem dados reais.

Para atualizar depois de mudar o código:

```sh
npm run publish:pages
```

O script gera o build estático (`vite.static.config.ts` → `dist-static/`) e envia para a branch `gh-pages`, que o GitHub Pages serve. A atualização leva cerca de um minuto. É preciso estar autenticado como `bros-tipmarket` (`gh auth switch --user bros-tipmarket`), dona do repositório.

O caminho base é `/portal-afiliados/`, e não a raiz do domínio. Por isso arquivos de `public/` são referenciados por `asset()` em `lib/utils.ts`; caminhos absolutos como `/brand/logo-white.svg` quebrariam na publicação. Para publicar em outro caminho, defina `PORTAL_BASE`.

O build local (`npm run dev` e `npm run build`, vinext sobre Cloudflare) segue inalterado e é o ambiente de desenvolvimento.

## Persistência e integração real

Este é um ambiente funcional de demonstração, **não uma implantação de produção**. Campanhas, links recentes, preferências e aceite demonstrativo usam `localStorage` com prefixo `tm-demo:`. Não se devem inserir credenciais ou dados sensíveis reais.

Dados financeiros e métricas são fixtures em `lib/affiliate.ts` e `lib/settlements.ts`. Os snapshots mensais fechados reconciliam os totais desse conjunto de dados. O código de fixtures não deve ser usado para calcular comissões reais. Definições finais e a deduplicação de ativos devem vir do contrato compartilhado com o PRD Admin F4, que não foi fornecido.

Pontos pendentes antes da operação real:

1. Kratos no realm affiliates, convite, senha, TOTP AAL2, sessão/cookies em domínio separado e Keto. A tela de login, o código 123456 e o QR atual apenas simulam a interface; não protegem acesso real — as credenciais ficam visíveis no código do cliente. O token do convite não é validado contra nada.
2. Conectar GET/PUT `/affiliate/me`, campanhas, métricas, destinos e extratos aos endpoints existentes. Derivar o afiliado **no servidor**, exclusivamente da identidade autenticada; nunca aceitar affiliate_id do cliente.
3. Negar token affiliates em player/trading. Os testes de autorização, isolamento e paridade com backoffice dependem dos serviços ausentes, não são substituídos por controles da interface.
4. Conectar os estados e pagamentos às consultas compartilhadas do Admin; nenhuma escrita financeira é exposta neste portal.
5. Implantar `integrations/attribution.ts` no repositório do site B2C (não fornecido). O adaptador já cobre o cookie Secure/SameSite/30 dias, verificação trackable, parâmetros, evento e entrega de código editado. Ele não é executado no portal. Rate limit/idempotência são do serviço. Propagação Google OAuth requer state assinado no servidor e ainda depende do player app/Attribution Service.
6. Substituir termos demonstrativos pelo texto aprovado e PDFs locais pelo template do Financeiro. Os itens AFP-04/05 seguem abertos no PRD.
7. Configurar o domínio público B2C, o link externo de suporte e notificações. O botão de suporte explica que o canal ainda não foi configurado; não envia mensagens.

Para alterar o domínio dos links, configure `NEXT_PUBLIC_B2C_ORIGIN` em `.env.local` e reinicie. O padrão é `https://tipmarket.example`, explicitamente ilustrativo. Nunca configure segredos em variáveis NEXT_PUBLIC.

Fora do escopo: postbacks, galeria de mídia, landing pages, tickets/chat, clientes individuais, alteração de deal ou pagamento.

## Verificações

```sh
node tests/domain.mjs
node scripts/check-settlements.mjs
npx tsc --noEmit
npm run build
```

Os testes cobrem filtros/totalização, agrupamento, período vazio, campanhas inativas/duplicadas, deep links, escaping de CSV, ausência de PII e o contrato do adaptador B2C. Eles não certificam integrações que não estão presentes.

WebMCP: ferramenta somente leitura `read_filtered_affiliate_metrics`, com rejeição de estados sem acesso/dados. Uso condicionado ao suporte do navegador.

Os PDFs incluídos são artefatos demonstrativos estáticos. Para regenerá-los após alterar fixtures: `node scripts/export-fixtures.mjs`, depois `python scripts/generate-demo-assets.py` com reportlab e qrcode instalados. A aplicação não depende de Python para iniciar ou baixar os PDFs existentes.


## Identidade visual e clareza

O portal usa os logotipos oficiais do site institucional e uma paleta de superfícies claras, preto e azul. As regras permanentes de usabilidade estão no AGENTS.md da raiz. A camada visual está em app/brand.css; os tokens compartilhados permanecem em app/globals.css. As fontes Poppins e Inter têm alternativas locais do sistema; os arquivos dessas fontes ainda não foram incorporados. O download adicional foi bloqueado pela revisão automática por limite de uso. Os PDFs demonstrativos existentes mantêm seu layout anterior.
