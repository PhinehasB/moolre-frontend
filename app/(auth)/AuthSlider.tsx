"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Salary card component for Slide 1
function SalaryCard() {
  return (
    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white w-72 shadow-xl">
      {/* Row: name + amount */}
      <div className="flex items-center justify-between text-sm font-medium mb-3">
        <span className="text-white/80">Kwame&apos;s salary this month</span>
        <span className="font-semibold">GHS 5,000</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/20 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: "70%",
            background: "linear-gradient(90deg, var(--color-spendable) 0%, var(--color-amber-400) 100%)",
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div>
          <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
            <span className="size-2 rounded-full bg-spendable" />
            Spendable
          </div>
          <p className="font-semibold">GHS 3,500</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
            <span className="size-2 rounded-full bg-amber-400" />
            Safe wallet
          </div>
          <p className="font-semibold">GHS 1,500</p>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    type: "gradient",
    tag: "SALARY, ALREADY SORTED",
    title: (
      <>
        Pay your team.
        <br />
        Their bills sort
        <br />
        themselves.
      </>
    ),
  },
  {
    type: "image",
    image: "/assets/slide_office.png",
    tag: "MOVE MONEY WITH TOTAL CONFIDENCE",
    title: "Secure, compliant, and reliable financial infrastructure for modern teams.",
  },
  {
    type: "image",
    image: "/assets/slide_atm.png",
    tag: "POWERING THE FUTURE OF DIGITAL PAYMENTS.",
    title: "Connecting digital wallets to real-world, everyday human utility.",
  },
  {
    type: "image",
    image: "/assets/slide_building.png",
    tag: "PAY YOUR TEAM IN ONE CLICK.",
    title: "We handle the complexity so you can focus on building",
  },
];

export default function AuthSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden select-none">
      {/* Slide Backgrounds with Cross-Fade */}
      {SLIDES.map((slide, index) => {
        if (slide.type === "gradient") {
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
                }`}
              style={{
                background:
                  "linear-gradient(160deg, var(--color-green-600) 0%, var(--color-green-400) 40%, var(--color-amber-600) 100%)",
              }}
            >
              {/* Subtle radial glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(255,255,255,0.06) 0%, transparent 70%)",
                }}
              />
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
                }`}
            >
              <Image
                src={slide.image || ""}
                alt="Auth background"
                fill
                sizes="50vw"
                priority={index === 1}
                className="object-cover"
              />
              {/* Gradients / Overlays for images */}
              <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 pointer-events-none" />
            </div>
          );
        }
      })}

      {/* Logo */}
      <div className="relative z-20">
        <Image
          src="/assets/logo.png"
          alt="Klare by Moolre"
          width={100}
          height={32}
          style={{ width: "100px", height: "auto" }}
          className="object-contain brightness-200 invert"
          priority
        />
      </div>

      {/* Content Container (flex-1 pushes children down, layout alignments configured per slide) */}
      <div className="relative z-20 flex-1 flex flex-col mt-8">
        {SLIDES.map((slide, index) => {
          const isGradient = slide.type === "gradient";
          return (
            <div
              key={index}
              className={`w-full transition-all duration-700 ease-in-out ${index === currentIndex
                ? "opacity-100 translate-y-0 relative"
                : "opacity-0 translate-y-4 absolute inset-x-0 -bottom-12 pointer-events-none"
                } ${isGradient
                  ? "my-auto self-start text-left max-w-xl"
                  : "mt-auto self-end ml-auto text-left max-w-[85%] lg:max-w-[70%] pb-4"
                }`}
            >
              <div>
                <p
                  className={`text-xs font-semibold tracking-[0.18em] uppercase mb-3 ${slide.type === "gradient" ? "text-white/60" : "text-white/75"
                    }`}
                >
                  {slide.tag}
                </p>
                <h1
                  className={`text-white tracking-tight ${slide.type === "gradient"
                    ? "text-3xl sm:text-4xl font-bold leading-snug"
                    : "text-2xl font-medium leading-[1.25]"
                    }`}
                >
                  {slide.title}
                </h1>
              </div>

              {/* SalaryCard for gradient slide */}
              {slide.type === "gradient" && (
                <div className="mt-8">
                  <SalaryCard />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="absolute bottom-16 left-12 z-20 text-white/40 text-xs">Powered by Moolre</p>
    </div>
  );
}
