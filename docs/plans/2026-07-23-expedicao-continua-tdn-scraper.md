# Expedição Contínua TDN Scraper Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Página GitHub Pages (`index.html`) que, ao clicar em Atualizar, busca no TDN a data de corte e o link do pacote Backoffice do Faturamento e exibe em um card.

**Architecture:** Um único `index.html` com array `MODULES`, fetch via proxy CORS, `DOMParser` no primeiro parágrafo Backoffice/data de corte, UI em cards extensível.

**Tech Stack:** HTML, CSS, JavaScript vanilla, GitHub Pages, proxies CORS (allorigins + fallback).

**Design:** `docs/plans/2026-07-23-expedicao-continua-tdn-scraper-design.md`

---

### Task 1: Criar `index.html` completo

**Files:**
- Create: `index.html`

**Step 1: Implementar página**

Incluir:
- Cabeçalho “Expedição Contínua”
- `MODULES` com Faturamento (`pageId: 521997859`)
- Card com estados idle / loading / success / error
- Fetch via proxies (allorigins raw, depois corsproxy)
- Parser: primeiro `<p>` com “data de corte” + “Backoffice”; extrair `<time>` e link “aqui”
- Botões: Atualizar, Baixar pacote, Ver no TDN
- CSS simples e responsivo

**Step 2: Validar parser com HTML real do TDN**

Rodar script Node/shell que aplica a mesma lógica no HTML baixado e confere data + link.

**Step 3: Commit**

```bash
git add index.html docs/plans/2026-07-23-expedicao-continua-tdn-scraper.md
git commit -m "Add GitHub Pages page to scrape TDN Expedição Contínua package"
```
