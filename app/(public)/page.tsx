import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Founder from "@/components/Founder";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-950 selection:bg-blue-100 selection:text-blue-900 dark:bg-black dark:text-zinc-50 font-sans antialiased">
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <About />
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
