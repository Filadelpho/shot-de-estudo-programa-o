import { useState, useEffect } from 'react';
import { CATEGORIES } from './data/topics';

const DURACOES = { estudo: 60, discurso: 60 };
const CORES_CONFETE = ['#ffff00', '#ffffff', '#ff2e3e'];
const FRASES_FESTA = ['oba!', 'mandou bem!', 'aí sim!', 'shot completo!', 'sequência viva!', 'isso aí!'];
const API_URL = 'http://localhost:3000/api';

function App() {
  const [catId, setCatId] = useState(CATEGORIES[0].id);
  const [tela, setTela] = useState('inicio'); // inicio | tema | estudo | discurso
  const [topic, setTopic] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [showFesta, setShowFesta] = useState(false);
  const [fraseFesta, setFraseFesta] = useState('oba!');

  const [remaining, setRemaining] = useState(DURACOES.estudo);
  const [modoPomodoro, setModoPomodoro] = useState(false);
  const [pomodoro, setPomodoro] = useState({ foco: 25, pausaCurta: 5, pausaLonga: 15, ciclos: 4 });
  const [cicloAtual, setCicloAtual] = useState(1);
  const [tempoEstudo, setTempoEstudo] = useState(5);
  const [tempoDiscurso, setTempoDiscurso] = useState(2);
  const [totalDuracao, setTotalDuracao] = useState(60);  const [paused, setPaused] = useState(false);
  const [somLigado, setSomLigado] = useState (true)
  const [carregando, setCarregando] = useState(true); 
  const [erroConexao, setErroConexao] = useState(null);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState({ streak: 0, shotsToday: 0 });

  const currentCat = CATEGORIES.find((c) => c.id === catId);
  function nivelStreak(dias) { if (dias >= 14) return { emoji: '🥇', nome: 'Ouro' }; if (dias >= 7) return { emoji: '🥈', nome: 'Prata' }; if (dias >= 3) return { emoji: '🥉', nome: 'Bronze' }; return null; } const nivel = nivelStreak(streak.streak); 
  const [exemploAtual, setExemploAtual] = useState(currentCat.topics[0]);

    // ---------- exemplos girando ----------
  useEffect(() => {
    setExemploAtual(currentCat.topics[0]);
    if (tela !== 'inicio') return;
    const intervalo = setInterval(() => {
      setExemploAtual((atual) => {
        const pool = currentCat.topics.filter((t) => t !== atual);
        return pool[Math.floor(Math.random() * pool.length)];
      });
    }, 1800);
    return () => clearInterval(intervalo);
  }, [tela, catId]);

 // ---------- carregar streak e histórico do backend ----------
useEffect(() => {
  Promise.all([
    fetch(`${API_URL}/streak`).then((res) => res.json()),
    fetch(`${API_URL}/history`).then((res) => res.json()),
  ])
    .then(([streakData, historyRows]) => {
      setStreak({ streak: streakData.count, shotsToday: streakData.shots_today });
      setHistory(historyRows.map((r) => ({ topic: r.topic, cat: r.category })));
      setErroConexao(null);
    })
    .catch((err) => {
      console.error('erro ao carregar dados iniciais', err);
      setErroConexao('Não foi possível conectar ao servidor. Confira se o backend está rodando.');
    })
    .finally(() => setCarregando(false));
}, []);

function registrarShotConcluido() {
  fetch(`${API_URL}/shots`, { method: 'POST' })
    .then((res) => res.json())
    .then((data) =>
      setStreak({ streak: data.count, shotsToday: data.shots_today })
    )
    .catch((err) => {
      console.error('erro ao registrar shot', err);
      setErroConexao('Não foi possível salvar seu progresso no servidor.');
    });
}

// ---------- atalhos de teclado ---------- 
   useEffect(() => { function handleKeyDown(e) { const tag = e.target.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA') return; if (e.code === 'Space') { e.preventDefault(); if (tela === 'inicio') sortear(); } else if (e.key === 'c' || e.key === 'C') { setShowConfig((v) => !v); } else if (e.key === 'Escape') { setShowConfig(false); setShowConfirma(false); } } window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [tela, catId]);

// ---------- sorteio ----------
function sortear() {
  const pool = currentCat.topics;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  setTopic(chosen);
  setTela('tema');

  fetch(`${API_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: chosen, category: currentCat.label }),
  })
    .then(() => fetch(`${API_URL}/history`))
    .then((res) => res.json())
    .then((rows) =>
      setHistory(rows.map((r) => ({ topic: r.topic, cat: r.category })))
    )
    .catch((err) => {
      console.error('erro ao salvar historico', err);
      setErroConexao('Não foi possível salvar o tema no servidor.');
    });
}
 // ---------- timer ----------
 function iniciarEstudo() {
  setCicloAtual(1);
  const duracao = modoPomodoro ? pomodoro.foco * 60 : tempoEstudo * 60;
  setTotalDuracao(duracao);
  setRemaining(duracao);
  setPaused(false);
  setTela('estudo');
}

  // contagem regressiva, um segundo de cada vez
  useEffect(() => {
    if (!['estudo', 'pausa', 'discurso'].includes(tela)) return;
    if (paused) return;
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [tela, paused, remaining]);

// decide o que acontece quando o tempo zera
useEffect(() => {
  if (remaining > 0) return;
  tocarBeep();
  if (tela === 'estudo') {
    if (modoPomodoro) {
      const duracaoPausa =
        cicloAtual < pomodoro.ciclos
          ? pomodoro.pausaCurta
          : pomodoro.pausaLonga;
      setRemaining(duracaoPausa * 60);
      setTotalDuracao(duracaoPausa * 60);
      setTela('pausa');
    } else {
      setShowConfirma(true);
    }
  } else if (tela === 'pausa') {
    if (cicloAtual < pomodoro.ciclos) {
      setCicloAtual((c) => c + 1);
      setRemaining(pomodoro.foco * 60);
      setTotalDuracao(pomodoro.foco * 60);
      setTela('estudo');
    } else {
      setShowConfirma(true);
    }
  } else if (tela === 'discurso') {
    concluir();
  }
   function irParaInicio() { setTela('inicio'); setTopic(null); setShowConfirma(false); }
}, [remaining]);

function irParaDiscurso() {
  setShowConfirma(false);
  setRemaining(tempoDiscurso * 60);
  setTotalDuracao(tempoDiscurso * 60);
  setPaused(false);
  setTela('discurso');
}

function concluir() {
  const frase = FRASES_FESTA[Math.floor(Math.random() * FRASES_FESTA.length)];
  setFraseFesta(frase);
  registrarShotConcluido();
  setShowFesta(true);
  setTimeout(() => {
    setShowFesta(false);
    setTela('inicio');
    setTopic(null);
  }, 2200);
}

function irParaInicio() {
  setTela('inicio');
  setTopic(null);
  setShowConfirma(false);
}

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  function tocarBeep() {
  if (!somLigado) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.error('erro ao tocar som', e);dei
  }
}

return (
  <div className="palco" data-tela={tela}>
    {carregando && (
      <div className="carregando-overlay">
        <p>carregando…</p>
      </div>
    )}

    <button className="logo" onClick={irParaInicio} aria-label="voltar ao início">
      <span></span><span></span><span></span><span></span>
    </button>
    <div className="canto-superior-direito">
      <button
        className="btn-som"
        onClick={() => setSomLigado((s) => !s)}
        aria-label={somLigado ? 'desativar som' : 'ativar som'}
      >
        {somLigado ? '🔊' : '🔇'}
      </button>
      <span className="streak-badge">
        {nivel ? nivel.emoji : '🔥'} {streak.streak} dias
        {streak.shotsToday > 0 ? ` · ${streak.shotsToday} hoje` : ''}
      </span>
    </div>

    {erroConexao && (
      <div className="erro-toast">
        <span>⚠️ {erroConexao}</span>
        <button onClick={() => setErroConexao(null)}>✕</button>
      </div>
    )}

{tela === 'inicio' && (
  <div className="tela-conteudo" key={tela}>
    <h1>Estudando um tema aleatoria de programação</h1>
    <ul className="passos">
      <li><span className="passo-num">1</span>sorteie um tema</li>
      <li><span className="passo-num">2</span>dê um shot de estudo</li>
      <li><span className="passo-num">3</span>explique o tema para alguém</li>
    </ul>
    <div className="acao">
      <button className="pill pill--principal" onClick={sortear}>sortear tema</button>
      <button className="engrenagem" onClick={() => setShowConfig(true)} aria-label="configurações">⚙</button>
    </div>
    {streak.shotsToday === 0 && (
      <p className="meta-diaria">faça seu shot de hoje 👊</p>
    )}
    <div className="exemplos">
      <p className="exemplos-lead">pode cair coisa tipo</p>
      <div className="exemplos-lista">
        <span key={exemploAtual} className="exemplo-item">{exemploAtual}</span>
      </div>
    </div>
  </div>
)}

{tela === 'tema' && (
  <div className="tela-conteudo" key={tela}>
    <p className="tag-cat">{currentCat.label.toLowerCase()}</p>
    <h1 className="tema-texto">{topic}</h1>
    <div className="acao">
      <button className="pill pill--principal" onClick={iniciarEstudo}>iniciar timer</button>
      <button className="pill" onClick={sortear}>sortear de novo</button>
      <button className="engrenagem" onClick={() => setShowConfig(true)} aria-label="configurações">⚙</button>
    </div>
  </div>
)}

{tela === 'estudo' && (
  <div className="tela-conteudo" key={tela}>
    <p className="rotulo">estudando</p>
    <p className="tema-secundario">{topic}</p>
    {modoPomodoro && <p className="cycle-note">ciclo {cicloAtual} de {pomodoro.ciclos}</p>}
    <div className="barra-progresso">
      <div
        className="barra-progresso-preenchimento"
        style={{ width: `${(remaining / totalDuracao) * 100}%` }}
      ></div>
    </div>
    <div className={`relogio ${paused ? 'is-pausado' : ''}`}>{fmt(remaining)}</div>
    <div className="acao">
      <button className="pill pill--principal" onClick={() => setShowConfirma(true)}>discurso</button>
      <button className="pill" onClick={() => setPaused((p) => !p)}>{paused ? 'retomar' : 'pausar'}</button>
    </div>
  </div>
)}

{tela === 'pausa' && (
  <div className="tela-conteudo" key={tela}>
    <p className="rotulo">{cicloAtual < pomodoro.ciclos ? 'pausa curta' : 'pausa longa'}</p>
    <p className="cycle-note">ciclo {cicloAtual} de {pomodoro.ciclos}</p>
    <div className="barra-progresso">
      <div
        className="barra-progresso-preenchimento"
        style={{ width: `${(remaining / totalDuracao) * 100}%` }}
      ></div>
    </div>
    <div className={`relogio ${paused ? 'is-pausado' : ''}`}>{fmt(remaining)}</div>
    <div className="acao">
      <button className="pill pill--principal" onClick={() => setRemaining(0)}>pular pausa</button>
      <button className="pill" onClick={() => setPaused((p) => !p)}>{paused ? 'retomar' : 'pausar'}</button>
    </div>
  </div>
)}

{tela === 'discurso' && (
  <div className="tela-conteudo" key={tela}>
    <p className="rotulo">discurso</p>
    <h2 className="tema-secundario">{topic}</h2>
    <div className="barra-progresso">
      <div
        className="barra-progresso-preenchimento"
        style={{ width: `${(remaining / totalDuracao) * 100}%` }}
      ></div>
    </div>
    <div className="relogio">{fmt(remaining)}</div>
    <div className="acao">
      <button className="pill pill--principal" onClick={concluir}>consegui!</button>
      <button className="pill" onClick={() => { setTela('inicio'); setTopic(null); }}>recomeçar</button>
    </div>
  </div>
)}

      {showConfirma && (
        <div className="overlay">
          <div className="overlay-caixa">
            <p className="overlay-titulo">pronto para explicar o tema?</p>
            <div className="acao" style={{ marginBottom: 0 }}>
              <button className="pill" onClick={() => setShowConfirma(false)}>ainda não</button>
              <button className="pill pill--principal" onClick={irParaDiscurso}>bora!</button>
            </div>
          </div>
        </div>
      )}

      {showConfig && (
        <div className="overlay">
          <div className="overlay-caixa overlay-config">
            <button className="overlay-fechar" onClick={() => setShowConfig(false)}>✕</button>
            <div className="config-bloco">
              <h3>categoria</h3>
              <div className="config-opcoes">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className={`opcao-pill ${catId === c.id ? 'is-marcada' : ''}`}
                    onClick={() => setCatId(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="config-bloco">
              <div className="config-bloco">
  <h3>modo do timer</h3>
  <div className="config-opcoes">
    <button
      className={`opcao-pill ${!modoPomodoro ? 'is-marcada' : ''}`}
      onClick={() => setModoPomodoro(false)}
    >
      normal
    </button>
    <button
      className={`opcao-pill ${modoPomodoro ? 'is-marcada' : ''}`}
      onClick={() => setModoPomodoro(true)}
    >
      pomodoro
    </button>
  </div>
</div>

{!modoPomodoro && (
  <>
    <div className="config-bloco">
      <h3>tempo de estudo</h3>
      <div className="config-opcoes">
        {[3, 5, 10, 15, 20].map((min) => (
          <button
            key={min}
            className={`opcao-pill ${tempoEstudo === min ? 'is-marcada' : ''}`}
            onClick={() => setTempoEstudo(min)}
          >
            {min} min
          </button>
        ))}
      </div>
    </div>

    <div className="config-bloco">
      <h3>tempo de discurso</h3>
      <div className="config-opcoes">
        {[1, 2, 3, 5].map((min) => (
          <button
            key={min}
            className={`opcao-pill ${tempoDiscurso === min ? 'is-marcada' : ''}`}
            onClick={() => setTempoDiscurso(min)}
          >
            {min} min
          </button>
        ))}
      </div>
    </div>
  </>
)}

{modoPomodoro && (
  <div className="config-bloco">
    <h3>tempos do pomodoro (minutos)</h3>
    <div className="config-grid">
      <div>
        <label>foco</label>
        <input
          type="number"
          min="1"
          max="120"
          value={pomodoro.foco}
          onChange={(e) =>
            setPomodoro((p) => ({ ...p, foco: Number(e.target.value) || 1 }))
          }
        />
      </div>
      <div>
        <label>pausa curta</label>
        <input
          type="number"
          min="1"
          max="60"
          value={pomodoro.pausaCurta}
          onChange={(e) =>
            setPomodoro((p) => ({ ...p, pausaCurta: Number(e.target.value) || 1 }))
          }
        />
      </div>
      <div>
        <label>pausa longa</label>
        <input
          type="number"
          min="1"
          max="90"
          value={pomodoro.pausaLonga}
          onChange={(e) =>
            setPomodoro((p) => ({ ...p, pausaLonga: Number(e.target.value) || 1 }))
          }
        />
      </div>
      <div>
        <label>ciclos até pausa longa</label>
        <input
          type="number"
          min="1"
          max="12"
          value={pomodoro.ciclos}
          onChange={(e) =>
            setPomodoro((p) => ({ ...p, ciclos: Number(e.target.value) || 1 }))
          }
        />
      </div>
    </div>
  </div>
)}
              <h3>últimos temas da sessão</h3>
              {history.length === 0 && <p style={{ opacity: 0.6, fontFamily: 'var(--font-mono)', fontSize: 12 }}>nenhum tema sorteado ainda.</p>}
              <ul className="history-list">
                {history.map((h, i) => (
                  <li key={i}><span>{h.topic}</span><span>{h.cat}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showFesta && (
        <div className="festa">
          <p className="festa-grito">oba!</p>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="confete"
              style={{
                left: `${Math.random() * 100}%`,
                background: CORES_CONFETE[i % CORES_CONFETE.length],
                animationDuration: `${1.4 + Math.random()}s`,
                animationDelay: `${Math.random() * 0.4}s`,
              }}
            ></span>
          ))}
        </div>
      )}

      <div className="assinatura">
        feito por
        <a className="fILADELPHO" href="https://https://www.instagram.com/devzada_/" target="_blank" rel="noopener noreferrer">📷 @devzada</a>
      </div>
      <button className="sugerir">👋 sugira um tema</button>
      <p className="atalhos">SPACE sortear · C configurar</p>
    </div>
  );
}

export default App;