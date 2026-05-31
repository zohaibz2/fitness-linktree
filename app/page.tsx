import Link from "next/link";
import Image from "next/image";

// Replace 'background_ripple.png' with the actual filename the Agent provides
import rippleBackground from "./background_ripple.png"; 

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      {/* 1. This layer contains the exact, centered concentric ripple background graphic. */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <Image
          src={rippleBackground}
          alt="Concentric ripple lines on a vibrant orange background"
          priority
          layout="fill"
          objectFit="cover" // Ensures it covers the screen
          objectPosition="center"
          className="opacity-100" // Make sure graphic is visible
        />
      </div>

      {/* 2. This layer contains all your centered text and the button. */}
      <div className="relative z-10 max-w-lg text-center space-y-7">
        {/* Exact main font, size, and boldness */}
        <h1 className="text-7xl font-extrabold tracking-tighter text-white">
          FitTree.
        </h1>

        {/* exact sub-font, centered across two lines */}
        <p className="text-xl font-medium text-white/95 leading-snug">
          Custom training plans with one shared link. <br />
          Track every rep, every set, live.
        </p>

        {/* exact button style, with correct signup link */}
        <div className="pt-6">
          <Link 
            href="/signup/trainer" // This path is now correct
            className="inline-block bg-white text-[#111827] font-bold text-lg px-12 py-5 rounded-full shadow-2xl transition-all transform hover:scale-105 hover:bg-white/90"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}
