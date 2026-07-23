# Expedição Contínua — scraper TDN (GitHub Pages)

Data: 2026-07-23

## Objetivo

Página estática no GitHub Pages que, sob demanda, busca na página do TDN o pacote atual de Expedição Contínua (módulo Faturamento), extrai data de corte e link de download, e exibe em um card. Sem dados de pacote chumbados no HTML. Arquitetura preparada para novos módulos depois.

Fonte inicial:

- https://tdn.totvs.com/pages/releaseview.action?pageId=521997859

## Decisões

| Decisão | Escolha |
|----------|---------|
| Hospedagem | GitHub Pages |
| Estrutura | Um único `index.html` (HTML + CSS + JS) |
| Fetch | Script no browser + proxy CORS (allorigins + fallback) |
| Quando buscar | Somente ao clicar em **Atualizar** |
| Qual trecho | Primeiro parágrafo da página com pacote Backoffice / data de corte |
| Conteúdo do card | Módulo, data de corte, download, link para o TDN |

## Arquitetura

1. Array `MODULES` no JS (`id`, `name`, `pageId` ou `url`).
2. Clique em **Atualizar** → monta URL do TDN → proxy CORS → HTML.
3. `DOMParser` → primeiro `<p>` com “data de corte” e “Backoffice”.
4. Extrai `<time datetime>` e `href` do link “aqui”.
5. Preenche o card (sucesso) ou mensagem de erro.

Estados do card: vazio → carregando → sucesso | erro.

## Interface

- Cabeçalho: “Expedição Contínua” + subtítulo curto.
- Grade de cards (hoje: só Faturamento).
- Card: nome do módulo; estado inicial pedindo Atualizar; após sucesso — data, **Baixar pacote**, **Ver no TDN**, botão **Atualizar**; loading e erro no próprio card.
- Layout simples, legível, mobile-friendly.

## Extração

Do primeiro `<p>` correspondente:

- **Data:** atributo `datetime` de `<time>` (exibir dd/mm/yyyy).
- **Download:** `href` do `<a>` “aqui”.
- **Pacote:** “Backoffice” (fixo).
- **TDN:** URL do módulo em `MODULES`.

A página do TDN pode repetir o mesmo aviso em abas/decks com links diferentes; usamos sempre o **primeiro** no HTML.

## Erros

- Rede/proxy: “Não foi possível buscar o TDN. Tente de novo.”
- Trecho não encontrado: “Não achei o pacote na página.”
- Trecho incompleto: “A página do TDN mudou de formato.”
- Durante o fetch: desabilitar **Atualizar** e mostrar “Buscando…”.

Proxy principal + um fallback para reduzir falha pontual de terceiros.

## Extensão (módulos futuros)

Acrescentar objeto em `MODULES` e o renderer gera o card. Sem mudança de fluxo de scrape, desde que a página TDN use o mesmo padrão de parágrafo.

## Validação manual

1. Abrir a página (local ou GitHub Pages).
2. Clicar **Atualizar** no card Faturamento.
3. Conferir data e link de download contra o TDN.
4. Testar **Baixar pacote** e **Ver no TDN**.
5. Testar offline e conferir mensagem de erro.

## Fora de escopo (agora)

- GitHub Actions / JSON commitado.
- Auto-fetch no carregamento da página.
- Lista de issues do pacote.
- Autenticação no portal de downloads.
