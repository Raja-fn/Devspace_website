import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CommunitySection from "./components/CommunitySection";
import ChallengeSection from "./components/ChallengeSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export const metadata = {
  title: "DevSpace - Engineering Social Platform",
  description: "Connect with elite engineers, solve challenges, earn certifications, and grow your Aura. The premium engineering ecosystem.",
};

export default function HomePage() {
  return (
    <>
      {/* Global cursor glow — fixed, behind everything */}
      <CursorGlow />

      <Navbar />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.022] noise"
      />

      <main className="relative z-10 min-h-screen bg-black text-white">
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <ChallengeSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
