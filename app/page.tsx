import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. Corrected Background Layout: Exactly 8 Waves Framing an Empty Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute w-[150%] h-[150%] min-w-[1200px] min-h-[1200px] text-white/20 stroke-current fill-none stroke-[1.5]"
        >
          {/* WAVE 1: Innermost boundary - framing the outside of the text block with slight bottom overlapping */}
          <path d="M500,280 C680,280 710,340 700,500 C690,640 600,680 480,700 C340,720 280,630 300,490 C320,340 360,280 500,280 Z" />
          
          {/* WAVE 2: Mingles slightly at the bottom with Wave 1 */}
          <path d="M510,250 C710,240 740,310 730,510 C720,680 580,670 460,715 C320,770 250,600 270,460 C290,310 340,260 510,250 Z" />
          
          {/* WAVE 3: Mingles slightly at the bottom left with Wave 2 */}
          <path d="M490,210 C740,190 780,270 770,510 C760,720 630,730 490,750 C330,770 210,650 230,420 C250,230 290,220 490,210 Z" />
          
          {/* WAVE 4: Final inner group boundary layer */}
          <path d="M500,170 C780,140 820,230 810,510 C800,760 670,800 500,810 C310,820 170,690 190,380 C210,160 260,190 500,170 Z" />
          
          {/* WAVE 5: Independent outer ripple */}
          <path d="M500,110 C830,70 880,180 870,520 C860,820 720,870 500,880 C260,890 110,750 140,330 C160,90 220,130 500,110 Z" />
          
          {/* WAVE 6: Independent outer ripple */}
          <path d="M500,50 C880,0 940,120 930,520 C920,880 770,930 500,940 C210,950 50,810 80,280 C100,20 170,80 500,50 Z" />
          
          {/* WAVE 7: Independent outer ripple */}
          <path d="M500,-10 C930,-60 1000,60 990,520 C980,940 820,990 500,1000 C160,1010 -10,870 20,230 C40,-50 120,30 500,-10 Z" />
          
          {/* WAVE 8: Outermost ring */}
          <path d="M500,-70 C990,-130 1060,0 1050,520 C1040,1000 870,1050 500,1060 C110,1070 -70,930 -40,180 C-20,-120 70,-20 500,-70 Z" />
        </svg>
      </div>

      {/* 2. Main Content Layer (Perfectly clean background directly behind it) */}
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
