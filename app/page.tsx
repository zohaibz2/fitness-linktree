"use client";

import Link from "next/link";
import { useState } from "react";

// Exact wavy line paths from the design (public/svg-paths/Path*.svg). Each path
// lives in its own coordinate space and is roughly centered within its own
// viewBox, so rendering each in a center-anchored SVG keeps them concentric.
// vx/vy shift the viewBox origin to reposition a path within its centered box
// (so the inner rings overlap/cross instead of nesting). Shape, scale, stroke
// are untouched. Outer rings omit them and stay perfectly concentric.
const RINGS: { w: number; h: number; d: string; vx?: number; vy?: number }[] = [
  {
    w: 640,
    h: 653,
    d: "M368.697 634.761C320.739 640.779 263.264 661.834 217.485 646.446C171.707 631.057 113.091 607.9 78.5109 574.17C43.9307 540.44 31.9269 473.678 15.4071 428.283C-1.11256 382.888 -0.995785 348.803 3.8134 300.735C8.62259 252.667 28.959 194.126 54.1455 152.905C79.332 111.685 119.312 88.9729 159.887 62.7635C200.462 36.5542 246.814 20.4396 294.742 14.4328C342.669 8.42598 377.499 -7.98344 423.286 7.40217C469.072 22.7878 507.051 38.1383 541.63 71.8683C576.208 105.598 614.255 159.497 630.774 204.893C647.292 250.29 631.487 288.493 626.684 336.554C621.881 384.616 622.974 430.662 597.765 471.906C572.555 513.15 507.751 592.708 467.262 618.83C426.772 644.952 416.655 628.743 368.697 634.761H368.697Z",
    vx: -90,
    vy: -70,
  },
  {
    w: 640,
    h: 653,
    d: "M368.697 634.761C320.739 640.779 263.264 661.834 217.485 646.446C171.707 631.057 113.091 607.9 78.5109 574.17C43.9307 540.44 31.9269 473.678 15.4071 428.283C-1.11256 382.888 -0.995785 348.803 3.8134 300.735C8.62259 252.667 28.959 194.126 54.1455 152.905C79.332 111.685 119.312 88.9729 159.887 62.7635C200.462 36.5542 246.814 20.4396 294.742 14.4328C342.669 8.42598 377.499 -7.98344 423.286 7.40217C469.072 22.7878 507.051 38.1383 541.63 71.8683C576.208 105.598 614.255 159.497 630.774 204.893C647.292 250.29 631.487 288.493 626.684 336.554C621.881 384.616 622.974 430.662 597.765 471.906C572.555 513.15 507.751 592.708 467.262 618.83C426.772 644.952 416.655 628.743 368.697 634.761Z",
    vx: 90,
    vy: 70,
  },
  {
    w: 732,
    h: 781,
    d: "M542.571 706.87C492.682 732.459 438.384 778.215 382.379 779.606C326.374 780.996 253.294 779.012 202.219 755.967C151.145 732.921 111.576 664.91 75.5608 621.982C39.5457 579.054 26.1518 541.854 12.3257 487.55C-1.50039 433.246 -2.55576 361.364 8.54651 306.438C19.6488 251.511 54.2187 210.891 88.0501 166.222C121.882 121.553 166.015 85.5948 215.875 60.0299C265.735 34.465 297.192 2.75777 353.205 1.3609C409.218 -0.0359648 456.706 1.62695 507.779 24.6737C558.851 47.7205 621.705 91.3757 657.72 134.305C693.734 177.235 691.661 225.149 705.491 279.444C719.321 333.739 738.779 383.497 727.661 438.458C716.543 493.419 677.464 605.855 643.691 650.395C609.918 694.934 592.46 681.281 542.571 706.87Z",
    vx: -110,
    vy: 90,
  },
  {
    w: 848,
    h: 922,
    d: "M744.354 731.648C700.124 779.338 659.089 850.759 598.592 874.497C538.095 898.235 457.648 925.07 392.832 920.215C328.017 915.36 257.905 856.925 201.618 824.423C145.331 791.92 115.974 756.685 79.3607 702.977C42.7474 649.269 13.082 571.334 3.39492 507.056C-6.29211 442.779 15.2767 384.784 34.4344 322.669C53.5922 260.553 87.4355 203.846 131.644 156.195C175.852 108.544 197.563 61.5 258.065 37.7519C318.568 14.0037 370.992 -3.02657 435.805 1.83027C500.619 6.68714 586.451 29.3331 642.738 61.838C699.025 94.3428 715.772 147.394 752.386 201.09C789.001 254.787 829.949 301.305 839.633 365.626C849.317 429.947 851.321 568.013 832.176 629.964C813.03 691.915 788.584 683.959 744.354 731.648Z",
    vx: 120,
    vy: -100,
  },
  {
    w: 995,
    h: 982,
    d: "M937.671 640.575C908.376 710.108 891.978 804.243 835.451 854.123C778.924 904.003 701.877 965.175 629.3 985.601C556.723 1006.03 457.117 970.151 382.868 957.056C308.619 943.962 262.641 917.202 201.425 873.186C140.209 829.17 76.9562 755.988 40.8984 689.767C4.84065 623.545 5.34529 551.77 1.58718 476.46C-2.17094 401.15 12.2242 325.907 41.5101 256.424C70.796 186.941 75.7998 127.047 132.329 77.1531C188.859 27.2597 239.247 -12.1054 311.824 -32.5288C384.4 -52.9522 486.944 -62.3243 561.194 -49.227C635.445 -36.1297 674.745 15.0532 735.957 59.0565C797.169 103.06 860.258 137.518 896.33 203.789C932.401 270.059 989.356 419.762 993.062 494.888C996.769 570.014 966.966 571.042 937.671 640.575Z",
  },
  {
    w: 1150,
    h: 982,
    d: "M1131.01 482.32C1126.66 569.738 1146.13 678.856 1104.3 755.657C1062.47 832.458 1002.75 929.709 931.745 980.773C860.735 1031.84 737.929 1032.25 651.8 1047.44C565.67 1062.63 504.937 1051.7 420.748 1028.01C336.559 1004.32 238.58 949.65 173.006 891.773C107.431 833.896 79.5085 755.458 45.5368 674.858C11.5652 594.257 -2.59173 506.528 1.76765 419.168C6.127 331.808 -12.1786 264.535 29.6487 187.719C71.4759 110.902 110.786 47.9986 181.795 -3.06147C252.805 -54.1216 360.864 -105.026 446.996 -120.211C533.127 -135.397 596.27 -95.1991 680.45 -71.522C764.63 -47.8449 847.069 -35.3171 912.678 22.6078C978.287 80.5328 1099.76 221.116 1133.6 301.536C1167.44 381.956 1135.36 394.902 1131.01 482.32Z",
  },
  {
    w: 1404,
    h: 982,
    d: "M1321.34 265.848C1351.28 362.863 1415.79 474.081 1400.66 574.395C1385.53 674.709 1359.01 804.413 1301.86 888.25C1244.72 972.088 1111.02 1021.27 1023.16 1072C935.299 1122.73 864.763 1134.92 763.596 1142.5C662.429 1150.09 533.938 1129.37 439.5 1092.3C345.062 1055.23 283.509 980.808 214.505 906.43C145.501 832.052 95.2671 742.04 65.3638 645.085C35.4605 548.129 -11.1803 482.062 3.94047 381.732C19.0613 281.402 36.9571 197.236 94.1054 113.403C151.254 29.5687 248.849 -68.7965 336.713 -119.525C424.576 -170.254 509.351 -151.492 610.503 -159.085C711.655 -166.677 806.487 -185.733 900.982 -148.625C995.477 -111.518 1183.65 -6.47417 1252.44 67.759C1321.24 141.992 1291.4 168.832 1321.34 265.848Z",
  },
  {
    w: 1512,
    h: 982,
    d: "M1343.6 6.86737C1414.72 100.739 1529.16 196.376 1552.46 311.726C1575.76 427.076 1598.31 578.98 1569.28 693.042C1540.24 807.103 1414.01 913.765 1338.37 1003.93C1262.72 1094.09 1190.67 1135.36 1083.4 1183.77C976.132 1232.18 827.853 1260.58 710.206 1257.64C592.559 1254.71 495.941 1198.01 391.218 1144.31C286.495 1090.62 196.031 1012.43 124.973 918.614C53.9155 824.793 -23.1336 771.284 -46.4517 655.92C-69.7697 540.556 -83.6504 441.712 -54.6127 327.653C-25.575 213.595 41.7876 67.647 117.438 -22.5132C193.089 -112.673 292.94 -125.859 400.188 -174.272C507.437 -222.685 603.249 -281.085 720.973 -278.131C838.697 -275.177 1085.49 -235.341 1189.92 -181.72C1294.35 -128.099 1272.48 -87.0047 1343.6 6.86737Z",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleWaitlist() {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage("You're on the list! We'll be in touch.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(String(err));
    }
  }

  return (
    <div className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-[#FE6E3E]">
      {/* Background: exact wavy paths from the design, concentric & centered */}
      {RINGS.map((ring, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width={ring.w}
          height={ring.h}
          viewBox={`${ring.vx ?? 0} ${ring.vy ?? 0} ${ring.w} ${ring.h}`}
          fill="none"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        >
          <path
            d={ring.d}
            fill="none"
            stroke="white"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
        </svg>
      ))}

      {/* Centered hero content */}
      <div className="relative z-10 px-6 text-center">
        <h1 className="font-display text-6xl font-bold text-white sm:text-7xl">
          FitTree.
        </h1>
        <p className="mt-6 font-sans text-lg font-normal text-white">
          Custom training plans with one shared link.
          <br />
          Track every rep, every set, live.
        </p>

        {/* Waitlist input */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full px-6 py-4 font-sans text-[#0A0A0A] shadow-lg outline-none sm:w-72"
          />
          <button
            onClick={handleWaitlist}
            disabled={status === "loading"}
            className="rounded-full bg-white px-8 py-4 font-sans font-semibold text-[#0A0A0A] shadow-lg transition hover:bg-zinc-100 disabled:opacity-60"
          >
            {status === "loading" ? "Joining..." : "Join Waitlist"}
          </button>
        </div>

        {/* Feedback message */}
        {message && (
          <p className={`mt-3 font-sans text-sm font-medium ${status === "success" ? "text-white" : "text-red-200"}`}>
            {message}
          </p>
        )}

        {/* Hidden Get Started button — restore later by removing 'hidden' */}
        <div className="mt-8 hidden">
          <Link
            href="/signup/trainer"
            className="inline-block rounded-full bg-white px-12 py-4 font-sans font-semibold text-[#0A0A0A] shadow-lg transition hover:bg-zinc-100"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
