import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FF6B35] flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      
      {/* 1. Dense Wavy Topographic Background Lines (Pure SVG Code) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute w-[150%] h-[150%] min-w-[1100px] min-h-[1100px] text-white/15 stroke-current fill-none stroke-[1.25]"
        >
          {/* Wave 1 - Innermost */}
          <path d="M500,420 C540,415 565,435 570,480 C575,530 540,550 500,555 C450,560 425,520 430,475 C435,430 460,425 500,420 Z" />
          
          {/* Wave 2 */}
          <path d="M500,370 C565,355 610,390 615,485 C620,570 560,600 495,610 C420,620 375,565 385,480 C395,405 435,385 500,370 Z" />
          
          {/* Wave 3 */}
          <path d="M500,320 C595,300 660,350 670,490 C680,615 590,655 490,670 C390,685 320,595, 335,480 C350,375 400,340 500,320 Z" />
          
          {/* Wave 4 */}
          <path d="M500,270 C630,250 710,310 725,490 C740,655 615,715 480,730 C345,745 265,620 285,475 C305,340 370,290 500,270 Z" />
          
          {/* Wave 5 - Middle */}
          <path d="M500,210 C665,185 765,265 780,495 C795,705 650,775 475,790 C300,805 210,655 235,470 C260,300 335,235 500,210 Z" />
          
          {/* Wave 6 */}
          <path d="M500,150 C710,120 820,215 840,495 C860,760 690,845 470,860 C250,875 150,700 180,465 C210,250 290,180 500,150 Z" />
          
          {/* Wave 7 */}
          <path d="M500,90 C755,55 880,165 900,495 C920,810 730,910 460,930 C190,950 90,740 125,455 C160,195 245,125 500,90 Z" />
          
          {/* Wave 8 */}
          <path d="M500,30 C805,-10 940,110 965,495 C990,870 770,980 450,1000 C130,1020 30,785 70,445 C110,130 200,70 500,30 Z" />
          
          {/* Wave 9 */}
          <path d="M500,-30 C855,-75 1000,55 1025,495 C1050,925 810,1050 440,1070 C70,1090 -30,830 15,435 C60,65 155,15 500,-30 Z" />
          
          {/* Wave 10 - Outermost */}
          <path d="M500,-90 C910,-140 1060,-10 1085,495 C1110,985 850,1120 430,1140 C10,1160 -90,875 -40,425 C10,0 110,-40 500,-90 Z" />
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
