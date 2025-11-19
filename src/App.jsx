import { useRef } from "react";
import Hero from "./components/Hero";
import PlayerPanel from "./components/PlayerPanel";
import Games from "./components/Games";

function App() {
  const gamesRef = useRef(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-yellow-50">
      <div className="relative">
        <Hero onStart={() => gamesRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
      <main ref={gamesRef} className="relative z-10 mx-auto max-w-6xl px-6 pb-20 space-y-6">
        <PlayerPanel />
        <Games />
      </main>
      <footer className="text-center text-xs text-yellow-200/60 py-6">Juego con fines de entretenimiento. Juega responsablemente.</footer>
    </div>
  );
}

export default App
