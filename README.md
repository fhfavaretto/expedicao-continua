# Expedição Contínua

Ferramenta comunitária que reúne, em um só lugar, links e informações públicas da TOTVS (TDN, GitHub e canais oficiais) sobre:

- **Expedição Contínua** — visão geral com sazonalidade (semanal / quinzenal / mensal), último pacote e próxima atualização estimada; Qualidade entra em Mensal; LIB à parte
- **Binários** — AppServer, DBAccess, SmartClient HTML
- **Ferramental** — releases do TDS e do TIR no VS Code

Site: https://fhfavaretto.github.io/expedicao-continua/

> Não é um produto oficial da TOTVS. A “próxima atualização” é uma estimativa com base na cadência do hub TDN + data do último pacote — sempre confira o TDN / Portal do Cliente antes de aplicar qualquer pacote.

## Como usar

Abra o site, escolha a área e clique em **Atualizar todos** para buscar os dados mais recentes.

Para rodar localmente:

```bash
# basta abrir o index.html no navegador
open index.html
```

Testes:

```bash
npm install
npm test
```

## Como ajudar

Toda contribuição é bem-vinda. Algumas ideias:

1. Corrigir parsers quando o TDN mudar o layout
2. Melhorar acessibilidade e uso no mobile
3. Adicionar novas fontes públicas úteis (sempre com link oficial)
4. Reportar bugs ou sugestões via [Issues](https://github.com/fhfavaretto/expedicao-continua/issues)

Fluxo simples:

```bash
# 1. Faça um fork e clone
# 2. Crie uma branch
git checkout -b minha-melhoria

# 3. Altere o código e rode os testes
npm test

# 4. Abra um Pull Request descrevendo o que mudou
```

Antes de enviar:

- Mantenha o projeto simples (HTML estático + JS)
- Não inclua dados sensíveis nem credenciais
- Prefira links oficiais da TOTVS / GitHub

## Licença

Este projeto está sob a licença [MIT](LICENSE).

Marcas, produtos e documentações mencionados pertencem à TOTVS S.A. e respectivos titulares.
