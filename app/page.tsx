import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. High-Distortion Wavy Topographic Background Lines (Pure SVG Code) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute w-[160%] h-[160%] min-w-[1200px] min-h-[1200px] text-white/15 stroke-current fill-none stroke-[1.25]"
        >
          {/* Wave 1 - Innermost (Highly Distorted) */}
          <path d="M500,430 C560,390 590,460 550,510 C510,560 430,530 420,480 C410,430 440,470 500,430 Z" />
          
          {/* Wave 2 */}
          <path d="M500,380 C610,320 640,430 610,530 C580,630 460,610 410,560 C360,510 390,440 500,380 Z" />
          
          {/* Wave 3 */}
          <path d="M500,330 C650,260 710,400 660,560 C610,720 480,680 390,630 C300,580 340,400 500,330 Z" />
          
          {/* Wave 4 */}
          <path d="M500,280 C710,190 770,360 720,600 C670,840 510,760 380,700 C250,640 280,370 500,280 Z" />
          
          {/* Wave 5 - Middle */}
          <path d="M500,220 C760,110 840,320 780,640 C720,960 540,840 360,770 C180,700 220,330 500,220 Z" />
          
          {/* Wave 6 */}
          <path d="M500,160 C810,40 910,270 840,680 C770,1090 560,920 340,840 C120,760 160,290 500,160 Z" />
          
          {/* Wave 7 */}
          <path d="M500,100 C870,-30 970,220 890,720 C810,1220 590,1000 320,910 C50,820 100,250 500,100 Z" />
          
          {/* Wave 8 */}
          <path d="M500,40 C930,-100 1040,170 950,760 C860,1350 610,1080 290,980 C-30,880 40,210 500,40 Z" />
          
          {/* Wave 9 */}
          <path d="M500,-20 C990,-170 1110,120 1010,800 C910,1480 640,1160 260,1050 C-120,940 -20,170 500,-20 Z" />
          
          {/* Wave 10 - Outermost */}
          <path d="M500,-80 C1050,-240 1170,70 1070,840 C970,1610 660,1240 230,1120 C-200,1000 -80,130 500,-80 Z" />
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
