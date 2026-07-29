# Relatório de Auditoria de Plataforma - AtlasGR Proposta Comercial

## 1. Resumo executivo

A plataforma de geração de propostas comerciais B2B da AtlasGR foi avaliada quanto à sua arquitetura técnica, experiência do usuário (UX), interface do usuário (UI) e qualidade visual. Atualmente, o produto é uma solução funcional baseada em HTML, CSS e Vanilla JavaScript, que cumpre seu papel básico de gerar propostas imprimíveis (PDF). Contudo, a plataforma apresenta níveis significativos de dívida técnica e visual, com inconsistências arquiteturais graves (como a coexistência de um arquivo bem segmentado `index.html` e um monolito `proposta_atlas_plano_item.html`), falta de padronização em acessibilidade e dependência de recursos nativos inconsistentes do navegador (como a impressão nativa para geração de PDF).

## 2. Veredito geral

O produto se encontra em um estado de **Produto funcional com dívidas relevantes**. Embora a solução entregue o valor principal de compilar os dados do Bitrix24 em uma proposta comercial, a base de código apresenta duplicação, falta de componentização real e falhas na separação de responsabilidades (especialmente no arquivo `proposta_atlas_plano_item.html`). Do ponto de vista de UX/UI, há inconsistência no sistema de design, falta de feedback claro para ações (como o salvamento de rascunhos) e barreiras de acessibilidade (como a ausência de navegação por teclado em elementos interativos).

## 3. Score da plataforma

**Score Geral: 62 / 100** (Produto funcional com dívidas relevantes)

*   **Experiência do usuário (20%): 65/100** - A navegação é simples, mas o feedback de interações é fraco e a carga cognitiva em telas de edição é alta.
*   **Qualidade visual (15%): 60/100** - Inconsistência entre as versões do arquivo; estilos inline e falta de padronização nas sombras e componentes.
*   **Arquitetura front-end (15%): 50/100** - Separação de responsabilidades parcial no `index.html` e inexistente no `proposta_atlas_plano_item.html`. Falta de um bundler/framework para escala.
*   **Design System (10%): 40/100** (Nível 1 - Parcial) - Existem tokens (`variables.css`), mas são ignorados em outras páginas que definem seus próprios `:root`.
*   **Acessibilidade (10%): 45/100** - Elementos clicáveis (`div` com `onclick`) sem atributos ARIA ou `tabindex`.
*   **Responsividade (10%): 75/100** - O layout principal se adapta relativamente bem, mas tabelas complexas quebram em dispositivos menores.
*   **Performance (10%): 90/100** - Por ser Vanilla e sem bibliotecas pesadas, o carregamento é extremamente rápido.
*   **Conteúdo e comunicação (5%): 80/100** - Textos adequados, mas as mensagens de interface (microcopy) são esparsas.
*   **Testes e confiabilidade (5%): 20/100** - Ausência total de testes automatizados (unitários, integração ou E2E).

## 4. Principais problemas

1.  **Código monolítico:** O arquivo `proposta_atlas_plano_item.html` concentra HTML, CSS (em tags `<style>`) e mais de 250 linhas de JavaScript, violando o princípio de responsabilidade única.
2.  **Duplicação de Design Tokens:** Cores e espaçamentos definidos em `css/variables.css` são redefinidos de forma hardcoded (ex: `--laranja: #FF5618;`) no arquivo monolítico, dificultando manutenções visuais.
3.  **Geração de PDF inconsistente:** O uso do `window.print()` e CSS `@media print` varia muito entre navegadores, gerando quebras de página e cortes de conteúdo imprevistos no PDF final.
4.  **Acessibilidade prejudicada:** Componentes customizados como sanfonas (`solution-header`) e seletores usam `divs` com `onclick`, impedindo o foco do teclado e o uso por leitores de tela.
5.  **Vulnerabilidade a XSS:** A renderização de componentes de catálogo via `.innerHTML = ...` com dados interpolados diretamente sem sanitização pode ser explorada se houver injeção via Bitrix24.
6.  **Gestão de estado frágil:** O arquivo `state.js` salva dados no `localStorage` mapeando o `id` ou a ordem dos elementos. Alterações na estrutura do HTML corrompem os dados salvos.
7.  **Inconsistência visual:** Uso concorrente de estilos (`solucion-card` vs `<article class="produto">`) que representam a mesma informação.
8.  **Feedback ao usuário escasso:** O "Auto-save" ocorre de forma invisível. O usuário não sabe ao certo se os dados foram persistidos até tentar fechar a página.
9.  **Uso de `!important`:** Excesso de hacks no CSS de impressão (`display: none !important`), o que dificulta o debug.
10. **Falta de componentização reutilizável:** Elementos como inputs e badges são reescritos repetidamente no HTML em vez de instanciados dinamicamente via um componente padronizado.

## 5. Dívida técnica

*   **Arquitetura:** O projeto sofre com a falta de um padrão arquitetural unificado. Enquanto `index.html` delega responsabilidades (`css/`, `js/`), o `proposta_atlas_plano_item.html` mistura tudo em 460 linhas de código altamente acoplado.
*   **Segurança:** A manipulação direta do DOM via `innerHTML` em `adicionarLinhaCatalogo` e `adicionarLinhaPersonalizada` sem sanitização é um risco de XSS.
*   **Manutenibilidade:** A ausência de testes e a presença de lógica de negócios (tabelas de preços `faixas`) diretamente no front-end em um arquivo HTML tornam o sistema difícil de atualizar e propenso a falhas silenciosas.

## 6. Dívida de UX

*   **Feedback de Estado:** A falta de indicações claras de carregamento (quando dados chegam do Bitrix24) ou de confirmação de salvamento automático (apenas o console emite "State saved"). O botão "Salvar" manual tem feedback, mas o auto-save não.
*   **Recuperação de Erros:** O sistema de histórico/undo do `state.js` depende de atalhos de teclado obscuros (Ctrl+Z/Ctrl+Y) que não estão documentados visualmente na interface.
*   **Hierarquia de Navegação:** Em telas com muitas categorias (`proposta_atlas_plano_item.html`), a tabela de produtos fica muito densa e a rolagem longa aumenta a carga cognitiva.

## 7. Dívida visual

*   **Inconsistência de Tokens:** Há divergência na paleta. No `variables.css` o cinza claro é `--atlas-gray-light: #f2f2f2;`, mas no arquivo da proposta plano item usa-se `#fafafa` hardcoded em alguns pontos e `--cinza:#f2f2f2;`.
*   **Tipografia:** A família Montserrat é utilizada corretamente, mas há quebras bruscas de tamanhos de fonte em modais improvisados ou inputs que herdam tamanhos diferentes.
*   **Densidade e Espaçamento:** Elementos de formulário e cartões de solução carecem de alinhamento vertical estrito (ritmo vertical prejudicado por falta de uso consistente de um grid system).

## 8. Acessibilidade

*   **Contraste:** Algumas marcações como `color: #999` sobre fundo `#eee` violam requisitos da WCAG AA para taxa de contraste.
*   **Semântica HTML:** Faltam tags como `<button>` em headers de acordeão. Elementos como `<div class="solution-header" onclick="...">` impedem navegação via `Tab` e Enter/Espaço. Atributos `aria-expanded` não existem.
*   **Formulários:** Inputs com rótulos visuais, mas não associados via `<label for="...">`, dificultando a interpretação por leitores de tela.

## 9. Responsividade

*   **Mobile e Tablets:** As tabelas de preços e detalhamentos (classe `tablewrap` e `table`) exigem overflow horizontal (`overflow-x: auto`), o que funciona tecnicamente, mas proporciona uma péssima experiência de leitura cruzada no mobile.
*   **Controles Fixos:** Os controles `no-print` (botões de ação) sobrepõem o conteúdo do rodapé em algumas visualizações mobile menores.

## 10. Performance

*   A performance de tempo de carregamento (FCP/LCP) é o ponto forte por não haver bibliotecas externas pesadas (React, Vue, etc).
*   **Ponto de atenção:** O código executa loops pesados de manipulação direta de DOM na função `calcular()` a cada evento de `input`. Em uma proposta muito grande, isso pode gerar travamentos ou Interaction to Next Paint (INP) elevado, pois bloqueia a thread principal.

## 11. Design System

**Nível 1 — Parcial**
Existem variáveis (`variables.css`) definidas, mas a adoção não é global. Componentes existem conceitualmente, mas são copiados e colados no HTML (Copy-paste driven development). Falta uma governança de componentes, estados (hover/focus padronizados em todos os inputs) e documentação.

## 12. Auditoria por tela

### Tela: Editor de Proposta (index.html)
*   **Objetivo:** Permitir ao consultor editar, salvar e imprimir uma proposta B2B.
*   **Problemas encontrados:** Acordeões acessíveis apenas via mouse; feedback de autosave inexistente.
*   **Dívida técnica:** JS misturado a regras de apresentação.
*   **Prioridade:** P1 | **Esforço:** Médio | **Score da tela:** 65/100

### Tela: Proposta Dinâmica com Produtos (proposta_atlas_plano_item.html)
*   **Objetivo:** Gerar proposta customizada com seleção de módulos complexos.
*   **Problemas encontrados:** Código legado estrutural, mistura de MVC em um único arquivo HTML. Tabela de precificação engessada.
*   **Dívida técnica:** Código espaguete; XSS potencial; repetição massiva.
*   **Prioridade:** P0 | **Esforço:** Alto | **Score da tela:** 40/100

## 13. Auditoria por componente

*   **Cartões de Solução (Accordions):** Duplicados entre as versões (`<div class="solution-card">` vs `<article class="produto">`). O estado ativo/inativo altera classes, mas não atributos ARIA.
*   **Tabelas de precificação:** Não componentizadas; geradas por concatenação de strings HTML.
*   **Botões de Ação Fixos:** Visualmente consistentes, mas a lógica de exportação falha ao tentar normalizar estilos de inputs apenas antes da impressão.

## 14. Quick wins (Vitórias Rápidas)

1.  **Acessibilidade Básica:** Substituir `<div class="solution-header" onclick="...">` por `<button class="solution-header">` para habilitar navegação por teclado instantaneamente.
2.  **Feedback Visual:** Adicionar um ícone/texto de "Salvando..." no rodapé da página integrado com o evento `setTimeout` do `state.js`.
3.  **Sanitização de Tokens:** Consolidar todas as cores de `proposta_atlas_plano_item.html` para usar as variáveis globais de `variables.css`.
4.  **Associação de Labels:** Vincular tags `<label>` aos seus respectivos `<input>` através do atributo `for` e IDs correspondentes.

## 15. Plano de redesign

*   **Fase 1 — Fundação:** Unificação da arquitetura. Separar CSS e JS do arquivo `proposta_atlas_plano_item.html`. Extensão e limpeza dos Design Tokens.
*   **Fase 2 — Componentes:** Criar funções puras ou adotar um micro-framework (ex: Web Components ou Preact) para gerenciar componentes UI (Tabelas, Cards, Inputs) sem cópia e cola.
*   **Fase 3 — Fluxos críticos:** Melhorar o fluxo de edição da tabela de produtos; substituir scroll horizontal no mobile por visualização em cartões ("Card View").
*   **Fase 4 — Performance:** Otimizar a rotina `calcular()` usando debounce e fragmentos de DOM para reduzir repaints.
*   **Fase 5 — Excelência Enterprise:** Integração bidirecional validada via API com Bitrix24 (em vez de placeholder de texto simples), substituição da impressão do browser por geração server-side (ex: Puppeteer) para PDF pixel-perfect.

## 16. Roadmap

*   **Primeiras 48 horas:** Implementar Quick Wins (Semântica HTML, Acessibilidade Básica, Feedback visual de Save).
*   **Primeiros 7 dias:** Desmembrar `proposta_atlas_plano_item.html` extraindo CSS para `main.css` e JS para módulos em `js/`.
*   **30 dias:** Estruturação dos componentes de UI; criação de um Design System gerenciado com variáveis consistentes.
*   **60 dias:** Refatoração da lógica de precificação para um gerenciador de estado centralizado, sanitizando entradas contra XSS.
*   **90 dias:** Implementação de layout responsivo adaptativo para tabelas e melhoria geral de usabilidade (UX).
*   **180 dias:** Evolução para um motor de PDF backend; integração avançada e contínua via API com Bitrix24 (Enterprise).

## 17. Matriz de priorização

1.  **Refatoração do Arquivo Monolítico:** Impacto Alto, Esforço Médio. Prioridade: **P0** (Base de segurança e manutenibilidade).
2.  **Acessibilidade e Semântica (Accordions):** Impacto Alto, Esforço Baixo. Prioridade: **P1** (Ação rápida).
3.  **Sistema de Geração de PDF Confiável:** Impacto Alto (Negócio), Esforço Alto. Prioridade: **P1**.
4.  **Feedback Visual de Estado (Undo/Redo):** Impacto Médio, Esforço Baixo. Prioridade: **P2**.

## 18. Arquitetura visual recomendada

*   **UI Orientada a Componentes:** Mover de `inline HTML strings` para Template Tags (`<template>`) ou Web Components para cartões de produtos.
*   **Padrões de Layout:** Utilizar CSS Grid para estruturação da folha de rosto e informações contratuais, substituindo flexbox complexos e larguras fixas.
*   **Paleta Consolidada:** Restringir tons de cinza a no máximo 4 variáveis claras e 3 escuras, com contraste mínimo garantido (WCAG AA).

## 19. Critérios de aceite

*   **Técnico:** Nenhum arquivo HTML contém blocos `<style>` ou `<script>` complexos. Todos os scripts são importados como módulos. Sem avisos no console ao rodar ferramentas como SonarQube/ESLint.
*   **Visual/UX:** Toda a interface passa no teste do Lighthouse de Acessibilidade com nota > 95. Interações via teclado funcionam em 100% dos componentes.
*   **Produto:** O PDF exportado tem exatamente a mesma aparência, sem cortes de texto, no Chrome, Firefox e Safari.

## 20. Veredito final

A plataforma atualmente resolve o problema de negócio de maneira pontual, mas acumulou uma dívida técnica e de design que compromete sua escalabilidade segura. A falta de componentização real, aliada a práticas inseguras de manipulação de DOM e falta de acessibilidade, torna o produto frágil a longo prazo. A transição para um padrão Enterprise exigirá limpar a base legada monolítica imediatamente e adotar uma padronização rigorosa via Design System.

---

## 29. VEREDITO FINAL DA PLATAFORMA

### Estado atual
Produto funcional com dívidas relevantes (nível de maturidade técnica e visual básico/intermediário).

### Score geral
62 / 100

### Principal dívida técnica
Arquitetura monolítica e alto acoplamento em `proposta_atlas_plano_item.html`, com renderização via manipulação direta de `.innerHTML` desprotegida contra XSS, além de forte duplicação.

### Principal dívida de UX
Ausência de feedback visual sobre o estado da aplicação (quando os dados são carregados, processados, salvos e se há erros); o sistema age silenciosamente, o que gera insegurança.

### Principal dívida visual
Inconsistência de tokens entre telas; as cores, espaçamentos e layouts (estilos de cards e botões) variam sem um controle central rígido. Uso excessivo de `!important` para sobrescrever falhas.

### Principal risco
Vulnerabilidade de segurança na renderização dinâmica de dados (XSS) e dificuldade de manutenção de regras complexas de preços em arquivos HTML, o que pode levar a faturamentos errados nas propostas comerciais.

### Principal oportunidade
O tempo de carregamento inicial excelente da plataforma permite criar uma experiência fluida e "instantânea" para os consultores se o gerenciamento de estado local (Undo/Redo, Autosave) for aprimorado com bom feedback de UI.

### Tela mais crítica
`proposta_atlas_plano_item.html` (concentra as regras de negócio de precificação complexa, falhas de componentização e maior complexidade de UX).

### Fluxo mais crítico
A geração da versão de impressão (PDF) e a inserção dinâmica de múltiplos produtos.

### Componente mais problemático
As "Tabelas Dinâmicas de Precificação" (construídas integralmente por strings de texto direto no DOM com lógicas injetadas).

### Quick win de maior impacto
Substituir as `div` clicáveis por `<button>` e adicionar indicador visual simples na barra inferior para o "Autosave", eliminando barreiras de acessibilidade e de UX instantaneamente.

### Mudança estrutural mais importante
Extração da lógica de apresentação, estilos e negócios do `proposta_atlas_plano_item.html` para uma arquitetura orientada a módulos JavaScript e CSS externo padronizado.

### Primeira ação recomendada
Implementar o desmembramento do arquivo monolítico (separar JS, CSS e HTML) e aplicar os Design Tokens (`variables.css`) globalmente.

### Resultado esperado em 30 dias
Base de código refatorada e unificada; uma identidade visual mais madura, consistente e sem repetição de regras CSS; usabilidade de inputs e sanfonas melhorada por meio de acessibilidade nativa.

### Resultado esperado em 90 dias
Interface com fluxo de adição de produtos robusto (livre de XSS), tabelas totalmente adaptativas para uso móvel e experiência confiável de precificação em tempo real sem causar sobrecarga no navegador (INP estável).

### Nível de confiança da análise
Alto. O código e arquitetura apresentados são enxutos o suficiente para permitir um mapeamento preciso dos pontos fracos estruturais, visuais e de interação ponta a ponta.
