import { SceneRoot } from "@/components/canvas/SceneRoot";
import { StageTracker } from "@/components/providers/StageTracker";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Highlights } from "@/components/sections/Highlights";
import { Artists } from "@/components/sections/Artists";
import { Work } from "@/components/sections/Work";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";

/**
 * Single-page experience. Sections carry `data-stage` indices (0–7) that the
 * persistent 3D scene follows — keep their order in sync with STAGES in
 * lib/store.ts and KEYFRAMES in components/canvas/keyframes.ts.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <SceneRoot />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Highlights />
        <Artists />
        <Work />
        <Booking />
        <Contact />
      </main>
      <Footer />
      {/* Must render after the sections so their pins exist before it measures. */}
      <StageTracker />
      <Cursor />
    </>
  );
}
