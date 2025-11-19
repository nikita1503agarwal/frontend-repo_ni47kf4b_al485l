import { useEffect, useMemo, useState } from "react";
import { Dice1, Dice2, Dice3, PlayingCard, RotateCw } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

function usePlayer() {
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("player");
    if (saved) setPlayer(JSON.parse(saved));
  }, []);
  return [player, setPlayer];
}

export default function Games() {
  const [player, setPlayer] = usePlayer();
  const [tab, setTab] = useState("roulette");

  if (!player) {
    return (
      <div className="text-yellow-200/80 text-center py-10">Crea tu jugador para comenzar.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-yellow-500/20 bg-slate-800/60 p-4">
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setTab("roulette")} className={`px-3 py-2 rounded-lg ${tab==='roulette'?'bg-yellow-400 text-black':'bg-slate-900/60 text-yellow-200'}`}>Ruleta</button>
        <button onClick={()=>setTab("slots")} className={`px-3 py-2 rounded-lg ${tab==='slots'?'bg-yellow-400 text-black':'bg-slate-900/60 text-yellow-200'}`}>Tragamonedas</button>
        <button onClick={()=>setTab("blackjack")} className={`px-3 py-2 rounded-lg ${tab==='blackjack'?'bg-yellow-400 text-black':'bg-slate-900/60 text-yellow-200'}`}>Blackjack</button>
      </div>
      {tab==='roulette' && <Roulette onUpdatePlayer={setPlayer} />}
      {tab==='slots' && <Slots onUpdatePlayer={setPlayer} />}
      {tab==='blackjack' && <Blackjack onUpdatePlayer={setPlayer} />}
    </div>
  );
}

function BalanceUpdater({ balance, onUpdatePlayer }){
  useEffect(()=>{
    const player = JSON.parse(localStorage.getItem('player'));
    if (player) {
      player.balance = balance;
      localStorage.setItem('player', JSON.stringify(player));
      onUpdatePlayer(player);
    }
  }, [balance]);
  return null;
}

function Roulette({ onUpdatePlayer }){
  const [amount, setAmount] = useState(10);
  const [betType, setBetType] = useState("red");
  const [value, setValue] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function play(){
    setLoading(true);
    const player = JSON.parse(localStorage.getItem('player'));
    const res = await fetch(`${API}/bet/roulette`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ player_id: player.id, amount: Number(amount), bet_type: betType, value: betType==='number'? Number(value): null })});
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-yellow-200">Cantidad</label>
          <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100 w-28" />
        </div>
        <div>
          <label className="block text-xs text-yellow-200">Tipo</label>
          <select value={betType} onChange={(e)=>setBetType(e.target.value)} className="rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100">
            <option value="red">Rojo</option>
            <option value="black">Negro</option>
            <option value="number">Número</option>
          </select>
        </div>
        {betType==='number' && (
          <div>
            <label className="block text-xs text-yellow-200">Número (0-36)</label>
            <input type="number" value={value} onChange={(e)=>setValue(e.target.value)} className="rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100 w-24" />
          </div>
        )}
        <button disabled={loading} onClick={play} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2 disabled:opacity-50">Jugar</button>
      </div>
      {result && (
        <div className="rounded-lg bg-slate-900/60 border border-yellow-400/10 p-3 text-yellow-100">
          <p>Resultado: {result.result} ({result.color})</p>
          <p>Ganancia: {result.payout}</p>
          <p>Saldo: {result.balance}</p>
          <BalanceUpdater balance={result.balance} onUpdatePlayer={onUpdatePlayer} />
        </div>
      )}
    </div>
  );
}

function Slots({ onUpdatePlayer }){
  const [amount, setAmount] = useState(5);
  const [spin, setSpin] = useState(null);
  const [loading, setLoading] = useState(false);

  async function play(){
    setLoading(true);
    const player = JSON.parse(localStorage.getItem('player'));
    const res = await fetch(`${API}/bet/slots`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ player_id: player.id, amount: Number(amount) })});
    const data = await res.json();
    setSpin(data);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-xs text-yellow-200">Cantidad</label>
          <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100 w-28" />
        </div>
        <button disabled={loading} onClick={play} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2 disabled:opacity-50">Girar</button>
      </div>
      {spin && (
        <div className="rounded-lg bg-slate-900/60 border border-yellow-400/10 p-3 text-yellow-100 text-center">
          <div className="text-4xl">{spin.reels?.join(' ')}</div>
          <p className="mt-1">Ganancia: {spin.payout}</p>
          <p>Saldo: {spin.balance}</p>
          <BalanceUpdater balance={spin.balance} onUpdatePlayer={onUpdatePlayer} />
        </div>
      )}
    </div>
  );
}

function Blackjack({ onUpdatePlayer }){
  const [amount, setAmount] = useState(20);
  const [session, setSession] = useState(null);
  const [outcome, setOutcome] = useState(null);

  async function start(){
    const player = JSON.parse(localStorage.getItem('player'));
    const res = await fetch(`${API}/blackjack/start`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ player_id: player.id, amount: Number(amount) })});
    const data = await res.json();
    if (data.status === 'finished') {
      setOutcome(data);
      setSession({ session_id: data.session_id });
      onUpdatePlayer({ ...player, balance: data.balance });
      localStorage.setItem('player', JSON.stringify({ ...player, balance: data.balance }));
    } else {
      setSession(data);
    }
  }
  async function hit(){
    const res = await fetch(`${API}/blackjack/hit`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session.session_id })});
    const data = await res.json();
    if (data.status === 'playing') setSession(data); else { setOutcome(data); updateBalance(data.balance); }
  }
  async function stand(){
    const res = await fetch(`${API}/blackjack/stand`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: session.session_id })});
    const data = await res.json();
    setOutcome(data);
    updateBalance(data.balance);
  }

  function updateBalance(bal){
    const player = JSON.parse(localStorage.getItem('player'));
    player.balance = bal;
    localStorage.setItem('player', JSON.stringify(player));
    onUpdatePlayer(player);
  }

  function reset(){
    setSession(null); setOutcome(null);
  }

  return (
    <div className="space-y-3">
      {!session && (
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-xs text-yellow-200">Apuesta</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100 w-28" />
          </div>
          <button onClick={start} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2">Repartir</button>
        </div>
      )}
      {session && !outcome && (
        <div className="space-y-2 text-yellow-100">
          <div>
            <div className="text-sm text-yellow-200">Mano del crupier</div>
            <div className="text-2xl">{session.dealer_hand?.join(' ')}</div>
          </div>
          <div>
            <div className="text-sm text-yellow-200">Tu mano</div>
            <div className="text-2xl">{session.player_hand?.join(' ')}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={hit} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2">Pedir</button>
            <button onClick={stand} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2">Plantarse</button>
          </div>
        </div>
      )}
      {outcome && (
        <div className="space-y-2 text-yellow-100">
          <div className="text-sm text-yellow-200">Resultado</div>
          <div className="text-2xl">{outcome.result} (Tú {outcome.p_val} vs Crupier {outcome.d_val})</div>
          <div className="text-sm">Saldo: {outcome.balance}</div>
          <button onClick={reset} className="mt-2 rounded-lg bg-slate-900/70 border border-yellow-400/20 text-yellow-200 px-3 py-2">Jugar de nuevo</button>
        </div>
      )}
    </div>
  );
}
