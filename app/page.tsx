import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. Background Ripple Effect (Pure CSS - No Images Needed!) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        {/* Outer Ripple 5 */}
        <div className="absolute w-[900px] h-[900px] border border-white/10 rounded-full animate-pulse opacity-40"></div>
        {/* Outer Ripple 4 */}
        <div className="absolute w-[750px] h-[750px] border border-white/15 rounded-full opacity-60"></div>
        {/* Middle Ripple 3 */}
        <div className="absolute w-[600px] h-[600px] border border-white/20 rounded-full opacity-70"></div>
        {/* Inner Ripple 2 */}
        <div className="absolute w-[450px] h-[450px] border border-white/25 rounded-full opacity-80"></div>
        {/* Innermost Ripple 1 */}
        <div className="absolute w-[300px] h-[300px] border border-white/30 rounded-full opacity-90"></div>
      </div>

      {/* 2. Main Content Layer */}
      <div className="relative z-10 max-w-md text-center space-y-6">
        <h1 className="text-6xl font-extrabold tracking-tight text-white font-sans">
          FitTree.
        </h1>
        <p className="text-lg font-medium text-white/95 leading-relaxed font-sans px-2">
          Custom training plans with one shared link. <br />
          Track every rep, every set, live.
        </p>
        <div className="pt-4">
          <Link 
            href="/signup/trainer" 
            className="inline-block bg-white text-[#111827] font-bold text-base px-10 py-4 rounded-full shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            Get started
          </Link>
        </div>
      </div>

    </main>
  );
}
