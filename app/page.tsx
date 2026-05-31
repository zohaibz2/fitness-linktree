import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. Wavy Topographic Background Lines (Pure SVG Code) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute w-[140%] h-[140%] min-w-[1000px] min-h-[1000px] text-white/20 stroke-current fill-none stroke-[1.5]"
        >
          {/* Innermost wavy ring */}
          <path d="M500,380 C570,370 610,410 620,490 C630,570 560,610 490,620 C410,630 370,560 380,480 C390,410 440,390 500,380 Z" />
          
          {/* Middle-inner wavy ring */}
          <path d="M500,280 C630,260 700,340 720,490 C740,630 620,710 480,720 C340,730 270,610 290,470 C310,340 380,300 500,280 Z" />
          
          {/* Middle wavy ring */}
          <path d="M500,180 C690,150 800,260 820,490 C840,710 690,820 480,830 C260,840 160,680 190,460 C220,250 320,200 500,180 Z" />
          
          {/* Outer-middle wavy ring */}
          <path d="M500,80 C760,40 910,180 930,490 C950,790 770,930 470,940 C170,950 50,750 90,450 C120,160 250,110 500,80 Z" />
          
          {/* Outermost wavy ring */}
          <path d="M500,-20 C830,-70 1020,100 1040,490 C1060,870 840,1040 460,1050 C90,1060 -60,820 -10,440 C30,70 180,-20 500,-20 Z" />
        </svg>
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
