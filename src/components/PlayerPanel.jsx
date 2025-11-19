import { useEffect, useState } from "react";
import { User, Coins } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function PlayerPanel() {
  const [player, setPlayer] = useState(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPlayer() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/player/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      localStorage.setItem("player", JSON.stringify(data));
      setPlayer(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("player");
    if (saved) setPlayer(JSON.parse(saved));
  }, []);

  if (!player) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-slate-800/60 p-4">
        <div className="flex items-center gap-2 text-yellow-200 mb-2"><User className="h-5 w-5" /> Tu jugador</div>
        <div className="flex gap-2">
          <input value={nickname} onChange={(e)=>setNickname(e.target.value)} placeholder="Apodo" className="flex-1 rounded-lg bg-slate-900/80 border border-yellow-400/20 px-3 py-2 text-yellow-100 placeholder:text-yellow-100/40" />
          <button disabled={!nickname || loading} onClick={createPlayer} className="rounded-lg bg-yellow-400 text-black font-semibold px-4 py-2 disabled:opacity-50">Crear</button>
        </div>
        <p className="text-xs text-yellow-100/60 mt-2">Comienzas con 1000 fichas.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-yellow-500/20 bg-slate-800/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-200"><User className="h-5 w-5" /> {player.nickname}</div>
        <div className="flex items-center gap-1 text-yellow-300 font-semibold"><Coins className="h-5 w-5" /> {player.balance?.toFixed?.(2)}</div>
      </div>
    </div>
  );
}
