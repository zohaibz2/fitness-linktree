import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. High-Distortion Topographic Background Lines with Intersecting Center Waves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute w-[160%] h-[160%] min-w-[1200px] min-h-[1200px] text-white/15 stroke-current fill-none stroke-[1.25]"
        >
          {/* Wave 1 - Smallest Center (Crosses over Wave 2 and 3) */}
          <path d="M500,410 C590,370 600,480 540,540 C480,600 400,520 410,450 C420,380 410,450 500,410 Z" />
          
          {/* Wave 2 - Distorted Center (Intersects deeply with Wave 1 and 3) */}
          <path d="M470,440 C580,330 650,420 590,510 C530,600 420,630 380,520 C340,410 360,550 470,440 Z" />
          
          {/* Wave 3 - Intermediate Center (Weaves completely through Waves 2 and 4) */}
          <path d="M530,360 C630,310 720,440 640,570 C560,700 440,580 390,660 C340,740 430,410 530,360 Z" />
          
          {/* Wave 4 - Outer Center Bound (Crosses into Wave 3's territory) */}
          <path d="M460,340 C720,240 740,390 710,610 C680,830 460,710 360,740 C260,770 200,440 460,340 Z" />
          
          {/* Wave 5 - Middle Wall */}
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
