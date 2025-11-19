import { Play, Star, Shield } from "lucide-react";

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-yellow-300 mb-6">
          <Star className="h-4 w-4" />
          <span className="text-sm">Casino Royale Pro</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_35px_rgba(250,204,21,0.35)]">
          Vive la emoción del casino en línea
        </h1>
        <p className="mt-4 text-lg text-yellow-100/80 max-w-2xl mx-auto">
          Ruleta, Tragamonedas y Blackjack con fichas virtuales. Crea tu jugador y empieza a jugar.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={onStart} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-3 transition shadow-lg">
            <Play className="h-5 w-5" /> Empezar a jugar
          </button>
          <div className="flex items-center gap-2 text-yellow-200/70">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Juego responsable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
