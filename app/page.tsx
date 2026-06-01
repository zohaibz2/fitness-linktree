import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FF6B35] flex items-center justify-center">
      {/* Background Contours */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
        >
          {/* Outer */}
          <path d="M-200,450 C-120,80 200,-120 650,-50 C950,0 1150,-120 1450,0 C1750,120 1850,420 1750,760 C1650,1080 1300,1050 900,980 C450,900 100,980 -120,800 C-300,650 -260,520 -200,450 Z" />

          {/* 2 */}
          <path d="M-80,450 C0,130 260,-40 650,20 C920,60 1120,-40 1380,70 C1630,180 1700,430 1620,710 C1540,960 1240,930 900,880 C520,820 200,900 20,760 C-120,650 -140,530 -80,450 Z" />

          {/* 3 */}
          <path d="M50,450 C120,180 340,60 650,100 C900,130 1080,80 1320,170 C1540,260 1600,450 1540,670 C1480,890 1230,860 930,820 C600,780 310,820 140,710 C10,620 -10,530 50,450 Z" />

          {/* 4 */}
          <path d="M180,450 C240,250 410,160 650,180 C860,200 1030,170 1250,250 C1440,320 1500,470 1450,630 C1400,810 1190,790 940,760 C660,720 420,740 270,650 C170,580 150,520 180,450 Z" />

          {/* 5 */}
          <path d="M310,450 C350,320 470,260 650,260 C820,260 970,250 1170,320 C1340,380 1380,500 1340,610 C1300,740 1130,720 940,690 C720,650 520,660 400,590 C320,540 300,500 310,450 Z" />

          {/* 6 */}
          <path d="M380,450 C420,360 510,320 650,330 C790,340 920,330 1080,390 C1210,440 1240,520 1210,590 C1180,690 1060,680 930,650 C760,620 620,620 510,560 C430,520 400,490 380,450 Z" />

          {/* 7 */}
          <path d="M450,450 C480,390 550,370 650,380 C760,390 860,390 980,430 C1080,470 1100,530 1080,580 C1060,650 970,640 880,620 C760,600 650,600 570,550 C500,510 470,490 450,450 Z" />

          {/* Inner */}
          <path d="M510,450 C530,420 580,410 650,415 C730,420 800,420 890,450 C960,470 980,520 970,560 C960,610 900,610 840,600 C760,590 690,590 630,560 C570,530 530,500 510,450 Z" />
        </g>
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-white font-extrabold text-7xl tracking-tight">
          FitTree.
        </h1>

        <p className="mt-8 text-white text-2xl font-medium leading-snug">
          Custom training plans with one shared link.
          <br />
          Track every rep, every set, live.
        </p>

        <Link
          href="/signup/trainer"
          className="
            mt-10
            bg-[#F1F1F1]
            text-[#16104A]
            font-bold
            text-xl
            px-16
            py-5
            rounded-full
            shadow-[0_8px_12px_rgba(0,0,0,0.18)]
            transition-all
            hover:scale-105
          "
        >
          Get started
        </Link>
      </div>
    </main>
  );
}
