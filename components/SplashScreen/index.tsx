"use client";
import { useEffect, useState } from "react";

const SplashScreen = ({ isVisible }: { isVisible: boolean }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow the Tailwind exit transition to finish
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[5000] bg-primary-500 flex flex-col gap-10 items-center justify-center transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
    >
      {/* Background */}
      <div className="w-screen h-screen absolute inset-0 bg-primary-700" />

      {/* Radial glow behind logo */}
      <div className="absolute rounded-full bg-white/15 blur-3xl animate-glow-pulse" />

      {/* Logo */}
      <div className="animate-logo-pop">
        <img
          src="/assets/icons/logo/logo.svg"
          alt="logo"
          className="grayscale brightness-[400] size-[10rem] relative z-10"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
