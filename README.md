# portfolio-dev

Portfólio pessoal de **Matheus Filipe da Silva Gomes** — Engenheiro de Computação.

Bilíngue (pt-BR / en), tema escuro, tipografia display sobre grid de 12 colunas escrito à
mão em CSS. Sem framework de UI, sem biblioteca de componentes, sem Tailwind.

🔗 https://mathgoms02.github.io/portfolio-dev/

---

## Stack

| Camada      | Escolha                                                        |
| ----------- | -------------------------------------------------------------- |
| Build       | Vite 8                                                          |
| UI          | React 19 + TypeScript (strict)                                  |
| Estilo      | CSS Modules + design tokens em `src/styles/tokens.css`          |
| Scroll      | [Lenis](https://github.com/darkroomengineering/lenis)           |
| Animação    | CSS puro + `IntersectionObserver` — nenhuma lib de animação      |
| Fundo       | Campo de limalha magnética em Canvas 2D                          |
| Dados vivos | API pública do GitHub, com snapshot local como fallback          |

O bundle não carrega nenhuma biblioteca de animação: as transições são transições e
`@keyframes` de CSS, disparadas por um atributo `data-shown` que um `IntersectionObserver`
liga quando o elemento entra na viewport. Isso mantém o custo por elemento em zero
JavaScript por frame.

### As três peças mais pesadas de visual

- **Retrato em ASCII** (`components/sections/AsciiPortrait.tsx`) — a foto é amostrada numa
  grade de caracteres, passa por unsharp mask e normalização por percentil (senão a camisa
  branca consome a rampa inteira e o rosto some) e é desenhada uma única vez em dois
  canvases: um em tinta, para a entrada, e um em âmbar, revelado por uma máscara radial que
  segue o ponteiro. Mover o mouse custa duas escritas de CSS, não um redesenho.
- **Cortina de navegação** (`lib/TransitionProvider.tsx`) — o rail, o header e a paleta de
  comandos saltam de seção atrás de sete lâminas verticais. O salto acontece coberto, então
  atravessar oito mil pixels lê como um corte, não como um borrão.
- **Limalha magnética** (`components/chrome/Backdrop.tsx`) — cerca de quatrocentos traços de
  um pixel que giram para apontar ao ponteiro, forte perto dele e quase nada nos cantos. O
  alvo de cada traço é uma mistura entre a direção do cursor e a deriva própria dele, com
  peso caindo pelo inverso do quadrado da distância — é isso que dá o gradiente de ordem
  perto e caos longe, e que mantém o campo girando sozinho quando o mouse está parado.

  O ponteiro muda **orientação e matiz**, nunca a luminância do fundo: um traço de um pixel
  não soma nada mensurável sob um parágrafo, então o contraste do texto é o mesmo em qualquer
  posição do cursor. Os traços são agrupados em 42 buckets de cor e opacidade e desenhados
  com `Path2D`, o que custa 0,5 ms por frame (3% do orçamento de 60fps) em vez de quatrocentas
  chamadas de `stroke` com `strokeStyle` diferente. Desligado inteiro em toque e em
  `prefers-reduced-motion`.

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + build de produção em dist/
npm run preview    # serve o dist/ no mesmo path do Pages
npm run lint
```

## Dados

Todo o conteúdo editorial fica em `src/data/`, tipado e bilíngue — nenhum texto é escrito
direto no JSX:

| Arquivo                | Conteúdo                                             |
| ---------------------- | ---------------------------------------------------- |
| `profile.ts`           | identidade, contatos, resumo, métricas, formação      |
| `experience.ts`        | cargos, conquistas medidas, eventos, cursos           |
| `projects.ts`          | 7 projetos em destaque + o "laboratório"              |
| `stack.ts`             | ferramentas agrupadas, com nível de uso               |
| `sections.ts`          | registro das seções (índice, rail, command palette)   |
| `github-snapshot.ts`   | **gerado** — não editar à mão                         |

Cada campo bilíngue tem o tipo `L<T> = Record<'pt' | 'en', T>` e é resolvido pelo hook
`useLocale().t(...)`, então adicionar um idioma é adicionar uma chave.

### Números do GitHub

A página busca contribuições, repositórios e datas de push direto da API pública do
GitHub no navegador e guarda o resultado em `localStorage` por 6 horas. Se a API estiver
fora, bloqueada ou com rate limit, o snapshot local assume — a seção nunca fica vazia e
nunca mostra número inventado. O rótulo `ao vivo` / `em cache` diz de onde veio o dado.

Para atualizar o snapshot (precisa do `gh` autenticado):

```bash
npm run sync:github
```

## Estrutura

```
src/
├── assets/         retrato processado (webp + variante em halftone + LQIP)
├── components/
│   ├── chrome/     boot, cursor, grain, grid, header, rail, command palette
│   ├── sections/   as oito seções da página
│   └── ui/         Reveal, ScrambleText, SectionHead, Marquee, Magnetic
├── data/           conteúdo tipado e bilíngue
├── i18n/           contexto de idioma + strings de interface
├── lib/            hooks (scroll, scramble, in-view, count-up, GitHub)
└── styles/         tokens + reset global
```

## Acessibilidade e movimento

- `prefers-reduced-motion` desliga o Lenis, o boot, o scramble e toda animação de entrada;
  o conteúdo aparece direto, nunca escondido atrás de uma animação que não vai rodar.
- O cursor customizado só existe em ponteiro fino; em toque o cursor nativo permanece.
- Navegação completa por teclado: `Tab`, `⌘/Ctrl + K` ou `/` abre a paleta de comandos,
  `Esc` fecha overlays, e há link "pular para o conteúdo".
- Texto animado carrega o valor final em `aria-label`, então leitores de tela nunca leem
  o ruído do scramble.

## Deploy

Push na `main` dispara `.github/workflows/deploy.yml`, que builda e publica no GitHub
Pages. O `base` do Vite está fixado em `/portfolio-dev/` — se o repositório for renomeado,
ajuste `vite.config.ts` junto.

Em **Settings → Pages**, a origem precisa estar como **GitHub Actions**.

## Licença

Código sob MIT. O conteúdo, o currículo e a fotografia são pessoais — não reutilize.
