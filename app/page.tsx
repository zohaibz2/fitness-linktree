import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FF6F3C] flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-6xl font-black tracking-tight text-white">
          FitTree.
        </h1>
        <p className="text-lg font-medium text-white/90 leading-relaxed">
          Custom training plans with one shared link. <br />
          Track every rep, every set, live.
        </p>
        <div className="pt-4">
          <Link 
            href="/signup" 
            className="inline-block bg-white text-[#111827] font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}
