# Chrome Web Store — material de submissão (v0.3.0, unlisted)

Tudo abaixo é copiar-e-colar no formulário do Developer Dashboard
(https://chrome.google.com/webstore/devconsole, conta Google da Isabela,
taxa única US$5). Visibilidade: **Unlisted**.

## Campos básicos

- **Nome**: Luciola — Hate Speech Triage (EN/PT)
- **Categoria**: Ferramentas (Tools) — alternativa: Acessibilidade
- **Idioma padrão**: Português (Brasil); adicionar inglês como segundo idioma
- **Site**: https://github.com/isasaade-23/luciola-extension
- **Privacy policy URL**: https://isasaade-23.github.io/luciola-extension/privacy

## Descrição curta (até 132 caracteres)

**pt-BR**: Sinaliza possível discurso de ódio (PT/EN) no texto da página. Roda
100% no seu navegador: nada é enviado a servidor algum.

**EN**: Flags possible hate speech (EN/PT) in page text. Runs 100% inside your
browser: nothing is ever sent to any server.

## Descrição longa

**pt-BR**:

A Luciola destaca trechos de texto com provável discurso de ódio, em português
e inglês, na página que você estiver lendo. É uma ferramenta de triagem: ela
apoia a sua leitura, não decide por você.

Como funciona:
• Clique no botão da Luciola e depois em Analisar esta página.
• Os blocos de texto acima do limiar recebem um contorno e um selo com a
probabilidade estimada.
• O limiar é ajustável no popup.

Privacidade por construção:
• O modelo roda inteiro dentro do navegador. A extensão não tem permissão de
rede e não faz nenhuma requisição: o texto da página nunca sai do seu aparelho.
• Nada é coletado. A única coisa salva é a sua preferência de limiar.

Limites honestos (leia antes de usar):
• O modelo vem de um estudo científico e erra. Ele pode sinalizar por engano
frases neutras ou até positivas que mencionam grupos de identidade, e pode
deixar passar ódio implícito dito sem palavrões.
• A probabilidade é uma representação do modelo, não um veredito humano.
• Uso em pesquisa e educação. Não use como única base para moderar, punir ou
expor pessoas.

Projeto de doutorado (USP). Código aberto, estudo e métricas completas:
https://github.com/isasaade-23/luciola-extension

**EN**:

Luciola highlights text passages with probable hate speech, in Portuguese and
English, on the page you are reading. It is a triage tool: it supports your
reading, it does not decide for you.

How it works:
• Click the Luciola button, then Scan this page.
• Text blocks above the threshold get an outline and a badge with the
estimated probability.
• The threshold is adjustable in the popup.

Privacy by construction:
• The model runs entirely inside your browser. The extension has no network
permission and makes no requests: page text never leaves your device.
• Nothing is collected. The only thing saved is your threshold preference.

Honest limits (read before using):
• The model comes from a scientific study and makes mistakes. It can wrongly
flag neutral or even positive sentences that mention identity groups, and it
can miss implicit hate expressed without slurs.
• The probability is a model representation, not a human verdict.
• Research and educational use. Do not use it as the sole basis to moderate,
punish, or expose anyone.

PhD project (University of São Paulo). Open source, full study and metrics:
https://github.com/isasaade-23/luciola-extension

## Justificativas de permissão (aba Privacy practices)

- **activeTab**: A extensão só lê o texto da aba ativa quando a pessoa clica em
  Analisar. Nenhum acesso contínuo ou em segundo plano.
- **scripting**: Injeta o script de análise na aba ativa, apenas sob clique,
  para destacar os trechos sinalizados.
- **storage**: Guarda uma única preferência (o limiar de sinalização). Nenhum
  conteúdo de página é armazenado.
- **Uso remoto de código**: Nenhum. Todo o código e o modelo vêm no pacote.
- **Coleta de dados** (formulário de data usage): marcar "não coleta nenhum
  dado de usuário" em todas as categorias.

## Single purpose (campo do review)

Identificar e destacar, localmente, possível discurso de ódio no texto da
página ativa, a pedido da pessoa usuária.

## Assets

- Ícone da loja 128×128: `icons/icon128.png` (gerado da marca oficial).
- Screenshots 1280×800 (mínimo 1, ideal 3): `store/shot1.png` (demo page com
  destaques), `store/shot2.png` (popup com slider), `store/shot3.png` (site
  real). Capturar com a extensão carregada, tema claro.
- Promo tile 440×280 (opcional): `store/promo440.png`.

## Passo a passo do envio (Isabela)

1. Criar a conta dev: https://chrome.google.com/webstore/devconsole (US$5).
2. "New item" → subir `store/luciola-extension-0.3.0.zip`.
3. Preencher listing com os textos acima (pt-BR e EN), assets, privacy URL.
4. Privacy practices: justificativas acima + "no data collected".
5. Distribution: **Visibility = Unlisted**. Salvar e "Submit for review".
6. Review típico: 1 a 3 dias úteis. O link de instalação sai no dashboard.
