# shot-de-estudo

Um jogo de estudo rápido pra quem estuda programação: sorteia um tema, cronometra um shot de estudo, e te obriga a explicar o que aprendeu em voz alta pra alguém — porque é aí que você descobre se entendeu de verdade ou só decorou.

Inspirado no formato "shot de marketing" do [@scoobelu](https://www.instagram.com/scoobelu/) ([yagobelu.com](https://yagobelu.com/shot-de-marketing/)), reconstruído do zero como projeto de faculdade (ADS), com stack própria, banco de dados de verdade e 9 áreas de programação pra sortear.

## Como funciona

O fluxo é sempre o mesmo, em 3 passos:

1. **Sorteia um tema** — de uma das 9 categorias: Front-End, Back-End, Mobile, Jogos, IA & Machine Learning, Engenharia de Software, Banco de Dados, DevOps ou Cibersegurança.
2. **Dá um shot de estudo** — cronometrado, no tempo que você escolher (ou no modo Pomodoro, com ciclos de foco e pausa configuráveis).
3. **Explica o tema pra alguém**, em voz alta, também cronometrado.

Cada shot completo conta pro seu **streak** (que sobe de nível — bronze, prata, ouro — conforme os dias seguidos de uso) e fica registrado no histórico da sessão.

## Stack

- **Front-end**: React + Vite
- **Back-end**: Node.js + Express
- **Banco de dados**: SQLite (`better-sqlite3`)
- **Deploy**: Vercel (front-end) + Render (back-end)

## Como rodar localmente

1. Clone o repositório:
   ```
   git clone https://github.com/Filadelpho/shot-de-estudo-programa-o.git
   ```
2. Instale e rode o back-end:
   ```
   cd backend
   npm install
   npm run dev
   ```
3. Em outro terminal, instale e rode o front-end:
   ```
   cd frontend
   npm install
   npm run dev
   ```
4. Abre `http://localhost:5173` no navegador.

> Por padrão, o front-end já aponta pro back-end publicado no Render. Pra testar contra o back-end local, troca a constante `API_URL` em `frontend/src/App.jsx` para `http://localhost:3000/api`.

## No ar

- **Front-end**: https://shot-de-estudo-programa-o.vercel.app
- **Back-end (API)**: https://shot-de-estudo-api-programa.onrender.com

> O back-end roda no plano gratuito do Render, que "dorme" depois de um tempo sem uso — a primeira requisição depois de um tempo parado pode levar de 30 a 60 segundos pra responder.

## A ideia do projeto

Esse projeto nasceu de uma faculdade de Análise e Desenvolvimento de Sistemas e virou desculpa pra estudar a stack completa na prática: front-end, back-end, banco de dados e deploy de verdade — não só teoria.

A escolha do formato "sortear tema → estudar → explicar" não é acaso: explicar um assunto em voz alta é um dos jeitos mais eficazes de testar se você realmente entendeu algo — se trava explicando, é sinal de que ainda falta estudar. O app existe pra criar esse hábito, um shot de cada vez.

---

feito por **Filadelpho**
