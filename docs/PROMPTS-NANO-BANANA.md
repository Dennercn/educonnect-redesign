# Imagens com o Nano Banana (Google Gemini)

O carrossel da tela **Início** e a tela de **login** já estão programados para exibir imagens. Enquanto os arquivos não existem, aparece um fundo em gradiente com ícone. Basta gerar as imagens e salvá-las com os nomes abaixo para elas aparecerem automaticamente, sem mexer no código.

## Como gerar

1. Acesse o Gemini (gemini.google.com) ou o Google AI Studio (aistudio.google.com) e escolha o modelo de imagem **Nano Banana**.
2. Cole um prompt da lista abaixo. Todos têm o mesmo estilo, para as imagens combinarem entre si.
3. Baixe a imagem e salve na pasta indicada, com o **nome exato**.
4. Recarregue a página do sistema (**Ctrl + Shift + R**).

| Arquivo | Onde aparece | Formato |
|---|---|---|
| `public/images/carrossel/01-matricula.png` | Carrossel, slide 1 | Horizontal 16:9 (ex.: 1600 × 900) |
| `public/images/carrossel/02-monitoria.png` | Carrossel, slide 2 | Horizontal 16:9 |
| `public/images/carrossel/03-semana-academica.png` | Carrossel, slide 3 | Horizontal 16:9 |
| `public/images/carrossel/04-biblioteca.png` | Carrossel, slide 4 | Horizontal 16:9 |
| `public/images/login.png` | Metade esquerda da tela de login (desktop) | Vertical 4:5 (ex.: 1200 × 1500) |

> **Dica:** o texto do carrossel fica sobre o **lado esquerdo** da imagem, com uma película escura por cima para garantir a leitura. Por isso os prompts pedem o assunto principal no **lado direito** e nenhum texto escrito na imagem.

## Estilo comum (já incluído em cada prompt)

> ilustração 3D suave estilo isométrico, cores índigo (#4f46e5) e verde-água (#14b8a6) com tons neutros claros, iluminação suave de estúdio, visual moderno e limpo, sem texto, sem letras, sem logotipos

## Prompts

### 1. Matrícula: `01-matricula.png`

```
Ilustração 3D suave estilo isométrico de uma mesa de estudos com um notebook aberto mostrando uma grade de horários colorida, um calendário de mesa e um checklist com marcações de concluído, composição com o assunto principal no lado direito e o lado esquerdo com fundo simples e escuro em degradê índigo, cores índigo (#4f46e5) e verde-água (#14b8a6) com tons neutros, iluminação suave de estúdio, visual moderno e limpo, sem texto, sem letras, sem logotipos, formato 16:9
```

### 2. Monitoria: `02-monitoria.png`

```
Ilustração 3D suave estilo isométrico de dois estudantes universitários estilizados estudando juntos em uma mesa de laboratório de informática, um explicando um diagrama de árvore e estrutura de dados em um quadro, composição com o assunto principal no lado direito e o lado esquerdo com fundo simples e escuro em degradê verde-água, cores índigo (#4f46e5) e verde-água (#14b8a6), iluminação suave, visual moderno e acolhedor, sem texto, sem letras, sem logotipos, formato 16:9
```

### 3. Semana Acadêmica de Tecnologia: `03-semana-academica.png`

```
Ilustração 3D suave estilo isométrico de um auditório universitário moderno com um palco, um telão com gráficos abstratos e pequenas pessoas estilizadas na plateia, luzes de evento em tons violeta e magenta, composição com o assunto principal no lado direito e o lado esquerdo com fundo escuro em degradê violeta, visual vibrante, moderno e limpo, sem texto, sem letras, sem logotipos, formato 16:9
```

### 4. Biblioteca digital: `04-biblioteca.png`

```
Ilustração 3D suave estilo isométrico de um tablet e um smartphone flutuando com livros digitais saindo da tela, prateleiras de livros estilizadas ao fundo e pequenas estrelas de luz, composição com o assunto principal no lado direito e o lado esquerdo com fundo simples e escuro em degradê azul, cores azul-céu, índigo (#4f46e5) e verde-água (#14b8a6), iluminação noturna suave, visual moderno e limpo, sem texto, sem letras, sem logotipos, formato 16:9
```

### 5. Tela de login: `login.png`

```
Ilustração 3D suave estilo isométrico, em formato vertical, de um campus universitário moderno ao entardecer com prédios de vidro, árvores, estudantes estilizados caminhando com mochilas e linhas de conexão luminosas ligando os prédios como uma rede, céu em degradê índigo (#4f46e5) para verde-água (#14b8a6), parte inferior da imagem mais escura e simples para receber texto por cima, visual moderno e limpo, sem texto, sem letras, sem logotipos, formato vertical 4:5
```

## Cuidados

- **Não use** pessoas reais, marcas, logotipos de faculdades reais nem texto dentro da imagem (a IA costuma errar letras).
- Se a imagem ficar muito clara do lado esquerdo, peça um ajuste: *"deixe o lado esquerdo mais escuro e vazio"*.
- Arquivos muito grandes deixam a página lenta. Se passar de ~500 KB, comprima em [squoosh.app](https://squoosh.app) (pode manter o `.png` ou trocar para `.webp`; se trocar, ajuste a extensão em `src/data/mock.ts`).
- Mencione na entrega que as imagens foram **geradas com IA (Nano Banana / Google Gemini)**.

## Logotipo

O logotipo novo (livro aberto com três pontos conectados, em gradiente índigo → verde-água) foi desenhado em **SVG** ([`src/components/layout/Logo.tsx`](../src/components/layout/Logo.tsx) e [`public/favicon.svg`](../public/favicon.svg)). Ele fica nítido em qualquer tamanho e tem versão para fundo escuro. Se mesmo assim quiser uma variação feita no Nano Banana para comparar, use:

```
Logotipo minimalista para um portal acadêmico chamado EduConnect: um livro aberto branco com três pontos conectados por linhas acima dele, formando uma rede, dentro de um quadrado de cantos arredondados com degradê de índigo (#4f46e5) para verde-água (#0d9488), design plano vetorial, fundo branco, sem texto
```
