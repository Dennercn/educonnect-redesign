# Redesign do EduConnect: processo e decisões

Este documento registra as cinco etapas da atividade: análise da interface anterior, planejamento, desenvolvimento, responsividade e interações, e comparação entre o antes e o depois.

> **Sobre o "antes":** o "antes" é o **projeto original fornecido pelo professor**. As capturas em [`screenshots/antes/`](screenshots/antes) foram geradas rodando esse projeto sem nenhuma alteração, e o código dele está em [`antes/`](antes). Antes do redesign existiu também uma versão intermediária, com tema escuro e confirmações adicionados ao original. Ela fica registrada em [`versao-intermediaria/`](versao-intermediaria), mas não é usada na comparação.

---

## Etapa 1: análise da interface original

A análise combinou leitura do código com testes automatizados no navegador (Chrome), nas larguras de 360, 390, 768, 1024 e 1440 px. Cada problema abaixo foi **reproduzido**, não apenas deduzido do código.

### Problemas encontrados

| # | Área | Problema (verificado) | Impacto para o aluno |
|---|---|---|---|
| 1 | Técnico | Em uma instalação limpa, `npm run build` **falha com 522 erros de TypeScript**: o `package.json` não declara `@types/react` e `@types/react-dom`. Todo o sistema fica em um único `App.tsx` de 441 linhas | Não é possível gerar a versão de produção; manutenção difícil e componentes repetidos |
| 2 | Feedback falso: sair | "Sair do sistema" só mostra o toast "Sessão encerrada com sucesso." O aluno **continua logado** e vendo o menu e os dados | A mensagem afirma algo que não aconteceu; em um computador compartilhado, o aluno acha que saiu |
| 3 | Feedback falso: matrícula | A tela promete "Você poderá revisar tudo antes de confirmar" e "A confirmação final será exibida na próxima etapa", mas "Continuar matrícula" **finaliza na hora** com "Pré-matrícula realizada com 2 nova(s) disciplina(s)." Não há revisão nem comprovante | O aluno não confere a escolha e não tem como provar que se matriculou |
| 4 | Feedback falso: perfil | Salvar com **nome vazio e telefone "abc"** mostra "Perfil atualizado com sucesso!". Ao recarregar, as alterações somem. "Alterar foto" só exibe "Seletor de foto aberto." | Dados inválidos são aceitos e o aluno acha que salvou algo que se perdeu |
| 5 | Informação | Indicadores fixos no código (média 8,7, "6 disciplinas · 24 créditos", frequência 94%). Notas "Aprovado" em um semestre em andamento. O seletor de semestre **não altera nada**: em 2025.2, o Dashboard e as Notas mostram exatamente o mesmo conteúdo | O aluno não pode confiar nos números nem consultar semestres anteriores |
| 6 | Notas | Só a nota final de cada disciplina: sem N1/N2/trabalho, sem frequência, sem busca e sem explicar o cálculo da média | A pergunta mais comum ("quanto preciso tirar?") fica sem resposta |
| 7 | Disciplinas | Não há grade semanal. O "⋯" de cada cartão parece um botão, mas é decorativo | Difícil planejar a semana; elemento que parece clicável e não faz nada |
| 8 | Matrícula | Não verifica conflito de horário, pré-requisito, vagas ou limite de créditos. A soma de créditos começa em 24 fixos | Seria possível montar uma grade impossível |
| 9 | Navegação (celular) | A barra inferior tem só 4 itens (**sem Perfil e sem Sair**), além de um menu lateral duplicado. O painel de notificações tem largura fixa de 320 px e **sai pela esquerda da tela** em 390 px. Esc não fecha o painel e "Marcar lidas" apenas o fecha. No desktop, o botão "X" de fechar o menu lateral aparece sem função | Perfil e saída escondidos no celular; controles quebrados ou inúteis |
| 10 | Acessibilidade | **13 textos** só no Dashboard usam `slate-400` sobre branco (**2,56:1**, abaixo do mínimo de 4,5:1). Os toasts não são anunciados (sem `aria-live`). Não há `aria-current` no menu nem link para pular ao conteúdo | Leitura difícil para baixa visão; leitor de tela não informa o resultado das ações |
| 11 | Visual | O CSS define o fundo da página como **vermelho** (`#f32105`), coberto pelo conteúdo, mas visível na rolagem elástica do celular. A barra de rolagem azul (`#046ff1`) fica fora da paleta índigo. Não há tema escuro | Identidade visual inconsistente |
| 12 | Navegação | Não há rotas: atualizar a página sempre volta ao Dashboard e o botão "voltar" sai do sistema | Comportamento diferente do esperado na web |

**Ponto positivo do original:** layout em cartões, paleta índigo e ícones Lucide já davam uma boa base. O redesign manteve a ideia, mas corrigiu o comportamento, a hierarquia e a consistência.

---

## Etapa 2: planejamento

### Princípios

1. **Responder às perguntas do aluno**, não só exibir dados: "Qual é a minha próxima aula?", "Quanto preciso tirar na N2?", "Essa disciplina choca com outra?"
2. **Explicar cada bloqueio**: nenhum botão ou opção fica desabilitado sem dizer o motivo.
3. **Uma fonte de verdade**: indicadores calculados a partir dos dados (média ponderada por crédito, situação, créditos), nunca fixos no código.
4. **Mobile first**: cada tela foi pensada primeiro para 360 px.

### Design system

**Cores** (definidas como tokens em [`tailwind.config.js`](../tailwind.config.js)):

| Papel | Token | Hex | Uso |
|---|---|---|---|
| Marca | `brand-600` | `#4f46e5` | Ações primárias, item ativo, destaques |
| Marca (escuro) | `brand-300/400` | `#a5b4fc` / `#818cf8` | Texto e destaques no tema escuro |
| Apoio | `accent-500` | `#14b8a6` | Gradientes do avatar e da tela de login (decorativo) |
| Neutros | `slate-50 … 950` | — | Fundo, superfícies, textos e bordas |
| Status: aprovado | `emerald` | — | Sempre com ícone ✓ e o texto "Aprovado" |
| Status: atenção | `amber` | — | Recuperação, abaixo da média, últimas vagas |
| Status: reprovado/erro | `rose` | — | Reprovação, erro de validação, sair |
| Status: em andamento | `sky` | — | "Cursando" |

As cores de status são **reservadas**: não aparecem como decoração, então cada uma tem sempre o mesmo significado.

**Tipografia**: *Plus Jakarta Sans* (600–800) nos títulos e números de destaque, para dar personalidade; *Inter* (400–700) nos textos de interface, pela ótima leitura em tamanhos pequenos. Os números usam `tabular-nums`, para que as notas fiquem alinhadas na tabela.

| Nível | Tamanho / peso |
|---|---|
| Título da página | 24–30 px · 800 |
| Título de cartão | 16 px · 700 |
| Corpo | 14–16 px · 400 |
| Rótulo / legenda | 12 px · 500–600 |

**Forma e espaço**: espaçamento em múltiplos de 4 px; cantos de 12 px (campos e botões) e 16 px (cartões); duas sombras (`card` e `raised`); áreas de toque de pelo menos 40 px no desktop e 48 px no celular.

**Componentes** ([`src/components/ui`](../src/components/ui)): `Button` (primary, secondary, ghost, subtle, danger; tamanhos sm/md/lg; estado de *loading*), `IconButton` (com contador), `Badge` e `SituationBadge`, `Field` (rótulo, dica, erro e ícone), `Dialog`, `Card`, `PageHeader`, `ProgressBar` (com marcador de meta), `Segmented`, `SearchInput`, `EmptyState`, `Avatar` e `Toast`.

### Wireframes (estrutura das telas)

```
DESKTOP (≥1024 px)                                SMARTPHONE (<768 px)
┌──────────┬─────────────────────────────────┐    ┌────────────────────┐
│ ▣ Logo   │ Área do aluno / Início   ☾ 🔔 JS│    │ ▣          ☾ 🔔 JS │
│          ├─────────────────────────────────┤    ├────────────────────┤
│ ▸ Início │ ┌───────────────────┬─────────┐ │    │ Boa noite, João!   │
│   Notas  │ │ Boa noite, João!  │ Próxima │ │    │ ┌────────────────┐ │
│   Discip.│ │ resumo do período │  aula   │ │    │ │ Próxima aula   │ │
│   Matríc.│ └───────────────────┴─────────┘ │    │ └────────────────┘ │
│   Perfil │ [!] Matrícula aberta  [Fazer →] │    │ [!] Matrícula      │
│          │ [Média][Freq.][Créd.][Atenção]  │    │ [Média ][Freq.  ]  │
│          │ ┌Desempenho────────┐┌Prazos──┐  │    │ [Créd. ][Atenção]  │
│ [Matríc. │ │ ████████│░░ 9,3  ││03 NOV  │  │    │ Desempenho...      │
│  2027.1] │ │ ██████  │░░ 6,8  ││10 NOV  │  │    │ Prazos...          │
│ ⎋ Sair   │ └──────────────────┘└────────┘  │    ├────────────────────┤
└──────────┴─────────────────────────────────┘    │ ⌂   🎓   📖  📋  👤 │
TABLET (768–1023 px): menu lateral só com ícones   └────────────────────┘

MATRÍCULA: etapas  ① Escolher ─── ② Revisar ─── ③ Comprovante
┌ Busca  [Todos|Seg|Ter|...] ─────────────┐ ┌ Resumo ───────────┐
│ ☑ Computação em Nuvem            4 cr   │ │ Créditos  15/24   │
│ 🔒 Desenv. Mobile                4 cr   │ │ ███████│░░░░░     │
│    ⚠ Conflito de horário com C. Nuvem   │ │ • C. Nuvem    🗑  │
│ ☐ Gestão de Projetos             3 cr   │ │ [Revisar →]       │
└─────────────────────────────────────────┘ └───────────────────┘
No celular, o resumo vira uma barra fixa acima da navegação inferior.
```

---

## Etapa 3: desenvolvimento

- **Arquitetura**: o arquivo único foi dividido em `pages/`, `components/layout`, `components/ui`, `context/`, `hooks/` e `lib/`. As regras acadêmicas ficam em [`lib/academic.ts`](../src/lib/academic.ts) (média ponderada N1 40% · N2 40% · Trabalho 20%, situação, meta para a N2, sobreposição de horários).
- **Estado global** em `AppContext` (perfil, matrícula, notificações, tema, sessão), persistido com o hook `useLocalStorage`.
- **Rotas por hash** (`useHashRoute`): cada tela tem URL própria, o botão "voltar" funciona e o título da aba muda junto.
- **Tema escuro** feito com variantes `dark:` em cada componente, sem `!important`, e aplicado antes da renderização para evitar o "piscar" do tema errado.
- **Build e tipos**: `npm run build` (com `tsc` em modo `strict`) passa sem erros.

---

## Etapa 4: responsividade e interações

### Pontos de quebra

| Largura | Navegação | Conteúdo |
|---|---|---|
| < 768 px (smartphone) | Barra inferior com 5 itens e logo + ações no cabeçalho | 1–2 colunas; notas em cartões expansíveis; diálogos sobem de baixo (*bottom sheet*); barras fixas de ação |
| 768–1023 px (tablet) | Menu lateral só com ícones (80 px) | 2 colunas; notas em tabela |
| ≥ 1024 px (desktop) | Menu lateral completo (288 px) com chamada para a matrícula | 3–4 colunas; resumo da matrícula fixo na lateral |

Verificação automatizada: nenhuma tela tem rolagem horizontal em **360, 390, 768, 1024 e 1440 px**, e o console do navegador não registra erros.

### Microinterações e feedback

| Ação | Feedback |
|---|---|
| Trocar de tela | Conteúdo entra com *fade + slide* (400 ms); foco vai para o título |
| Passar o mouse em cartões e atalhos | Elevação (`-translate-y-0.5`) e sombra; a seta do atalho desliza |
| Pressionar botão | Leve redução de escala (`active:scale-[.98]`) |
| Barras de progresso | Crescem a partir da esquerda ao aparecer |
| Selecionar disciplina | A caixa de seleção aumenta e o cartão ganha borda e fundo da cor da marca; o resumo e a barra de créditos atualizam em tempo real |
| Opção bloqueada | Cadeado, opacidade reduzida e motivo por escrito (conflito, pré-requisito, lotada, limite) |
| Enviar formulário / confirmar | Botão com *spinner* e texto "Salvando..." / "Confirmando...", desabilitado para evitar clique duplo |
| Sucesso, erro ou informação | Toast com ícone; o cancelamento da matrícula oferece **Desfazer** |
| Erro de campo | Borda vermelha, ícone e mensagem abaixo do campo; o foco vai para o primeiro campo inválido |
| Alterar dados do perfil | Barra flutuante "Alterações não salvas" com Descartar/Salvar |
| Confirmar matrícula | Etapas ficam verdes, ícone de sucesso aparece com animação e o protocolo é exibido |
| Sistema com "reduzir movimento" ativo | Todas as animações são praticamente desativadas |

---

## Etapa 5: comparação antes e depois

### Dashboard

| Antes | Depois |
|---|---|
| ![](screenshots/antes/desktop-dashboard.png) | ![](screenshots/depois/desktop-02-dashboard.png) |

**O que mudou:** a mensagem genérica ("Você está indo muito bem") deu lugar à **próxima aula** real e ao número de disciplinas que precisam de atenção. Os indicadores agora são calculados e clicáveis, e o "Resumo das notas", que repetia a tela de Notas, virou um **gráfico de desempenho** com a linha de corte 7,0. Com isso, o aluno identifica de imediato onde está em risco. A matrícula aparece como aviso contextual com contagem regressiva e some depois de confirmada.

### Notas

| Antes | Depois |
|---|---|
| ![](screenshots/antes/desktop-notas.png) | ![](screenshots/depois/desktop-03-notas.png) |

**O que mudou:** a tabela mostra N1, N2, trabalho, média, frequência e situação (com ícone). Os filtros exibem contagens e o seletor de semestre **carrega dados reais** de outro período. O detalhe expansível mostra a composição da média e a **meta para a N2**, e a regra de cálculo fica explicada no rodapé.

### Disciplinas

| Antes | Depois: cartões | Depois: grade semanal |
|---|---|---|
| ![](screenshots/antes/desktop-disciplinas.png) | ![](screenshots/depois/desktop-04-disciplinas.png) | ![](screenshots/depois/desktop-05-grade-semanal.png) |

**O que mudou:** a nova **grade semanal** destaca o dia de hoje e os cartões mostram "Aula hoje". O ícone "⋯", que não fazia nada, deu lugar a um botão "Ver detalhes" que funciona, com contato do professor. A frequência baixa aparece destacada.

### Matrícula

| Antes: seleção | Antes: "Continuar" já finaliza | Depois: escolha | Depois: revisão | Depois: comprovante |
|---|---|---|---|---|
| ![](screenshots/antes/desktop-matricula.png) | ![](screenshots/antes/desktop-matricula-continuar.png) | ![](screenshots/depois/desktop-06-matricula-selecao.png) | ![](screenshots/depois/desktop-07-matricula-revisao.png) | ![](screenshots/depois/desktop-08-matricula-comprovante.png) |

**O que mudou:** no original, a tela prometia uma revisão que não existia: "Continuar matrícula" finalizava na hora, só com um toast. Agora o processo virou um passo a passo com indicador de etapas. O sistema **impede grades impossíveis** (conflito, pré-requisito, lotação, limite de créditos) e explica cada bloqueio. A revisão mostra a semana resultante e pede o aceite das regras. O comprovante tem protocolo e permite alterar ou cancelar, com Desfazer.

### Perfil

| Antes | Antes: nome vazio e telefone "abc" salvos "com sucesso" | Depois: erro no campo certo |
|---|---|---|
| ![](screenshots/antes/desktop-perfil.png) | ![](screenshots/antes/desktop-perfil-salvar-invalido.png) | ![](screenshots/depois/desktop-09-perfil-validacao.png) |

**O que mudou:** o original aceitava qualquer valor, dizia "Perfil atualizado com sucesso!" e perdia tudo ao recarregar. Agora as alterações são validadas e ficam salvas. Os dados estão agrupados em seções (pessoais, contato, endereço, segurança). Os campos que só a secretaria altera ficam bloqueados com explicação e há suporte a **nome social**. Os erros aparecem por campo e o celular e o CEP têm máscara. A barra de alterações não salvas evita perder edições.

### Smartphone

| Antes: Dashboard | Antes: notificações saindo da tela | Depois: Dashboard | Depois: Notas | Depois: Matrícula |
|---|---|---|---|---|
| ![](screenshots/antes/mobile-dashboard.png) | ![](screenshots/antes/mobile-notificacoes.png) | ![](screenshots/depois/mobile-01-dashboard.png) | ![](screenshots/depois/mobile-02-notas.png) | ![](screenshots/depois/mobile-04-matricula.png) |

**O que mudou:** a barra inferior agora tem os **5 destinos**, incluindo Perfil, e indica o item ativo. O menu lateral duplicado foi removido. O painel de notificações ocupa a largura da tela no celular, em vez de sair pela borda. As notas viram cartões expansíveis e a matrícula tem um resumo fixo com o botão "Revisar" sempre ao alcance do polegar.

### Navegação e saída

| Antes: "Sair" (continua logado) | Depois: confirmação | Depois: login | Depois: notificações (celular) | Depois: tema escuro |
|---|---|---|---|---|
| ![](screenshots/antes/desktop-sair.png) | ![](screenshots/depois/desktop-10-sair.png) | ![](screenshots/depois/desktop-01-login.png) | ![](screenshots/depois/mobile-06-notificacoes.png) | ![](screenshots/depois/desktop-11-dashboard-escuro.png) |

**O que mudou:** no original, "Sair" mostrava "Sessão encerrada com sucesso." com o aluno ainda logado. Agora sair pede confirmação clara ("Continuar conectado" / "Sair") e leva a uma **tela de login** real. As notificações têm contador, marcam como lidas ao abrir e levam à tela relacionada. O tema escuro foi desenhado como paleta própria, e não como inversão das cores.

---

## 4. Acessibilidade

Contraste medido com a fórmula WCAG 2.1 (mínimo AA: 4,5:1 para texto normal):

| Combinação | Contraste | Uso |
|---|---|---|
| `slate-400` sobre branco (**original**) | 2,56:1 ❌ | 13 textos auxiliares só no Dashboard original |
| `slate-500` sobre branco | 4,76:1 ✅ | Legendas e textos auxiliares (novo mínimo) |
| `slate-600` sobre branco | 7,58:1 ✅ | Descrições |
| `slate-900` sobre `slate-50` | 17,06:1 ✅ | Texto principal |
| Branco sobre `brand-600` | 6,29:1 ✅ | Botão primário (claro e escuro) |
| `brand-700` sobre `brand-50` | 7,07:1 ✅ | Item ativo do menu, badges |
| `emerald-800` / `amber-800` / `rose-800` / `sky-800` sobre o fundo `-50` | 6,84–7,30:1 ✅ | Etiquetas de situação |
| `brand-100` sobre `brand-600` | 5,10:1 ✅ | Textos do bloco de boas-vindas |
| `slate-100` sobre `slate-950` | 18,41:1 ✅ | Texto no tema escuro |

Outras medidas: foco visível em todos os elementos interativos, link "Pular para o conteúdo", diálogos com foco preso, Esc e retorno de foco, `aria-current`, `aria-invalid` + `aria-describedby`, `role="progressbar"` e `role="switch"`, tabela com `caption`/`scope`, toasts anunciados (`aria-live`), status sempre com ícone + texto, `prefers-reduced-motion` e `lang="pt-BR"`.

---

## 5. Principais decisões de design (resumo)

1. **Indicadores que respondem perguntas** (próxima aula, meta para a N2, dias até o fim da matrícula), porque o aluno entra no portal para resolver algo, e não para olhar números soltos.
2. **Navegação adaptada a cada dispositivo** (barra inferior, menu só com ícones, menu completo), sem duplicar menus. A barra inferior fica na zona do polegar e cobre todas as áreas.
3. **Bloqueios sempre explicados** na matrícula e no perfil. Um botão desabilitado sem explicação gera chamados à secretaria.
4. **Cores com significado fixo**: o índigo indica ação e navegação, e as cores de status nunca são usadas como enfeite. Assim, verde, âmbar e vermelho sempre querem dizer a mesma coisa.
5. **Fluxo em etapas com revisão e comprovante** na matrícula, porque é uma ação importante e difícil de desfazer: o aluno precisa conferir antes e ter um protocolo depois.
6. **Componentes próprios e tokens centralizados**: qualquer ajuste de cor, raio ou sombra vale para o sistema inteiro, o que garante a consistência pedida no enunciado.
