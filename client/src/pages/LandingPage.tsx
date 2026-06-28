import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { StatsBar } from "@/components/landing/StatsBar"
import { CtaSection } from "@/components/landing/CtaSection"
import { SiteHeader } from "@/components/landing/SiteHeader"
import { SiteFooter } from "@/components/landing/SiteFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <StatsBar />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
