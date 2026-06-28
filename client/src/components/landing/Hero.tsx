import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-8 lg:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            Built for Universiti Kebangsaan Malaysia Community
          </div>

          {/* Headline */}
          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Share startup ideas.</span>
            <br />
            {/* gradient text */}
            <span className="bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent">
              Build the future.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            UKMStartUp is where student founders pitch ideas, get instant AI
            feedback, and connect with the industry mentors who can turn a
            concept into a company.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 w-full px-7 text-base text-white transition-opacity hover:opacity-90 sm:w-auto"
              style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
              asChild
            >
              <Link to="/signup">
                Get started — it&apos;s free
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full border-border bg-transparent px-7 text-base font-semibold text-foreground hover:bg-secondary hover:text-foreground sm:w-auto"
              asChild
            >
              <Link to="/login">Log in</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Free for all UKM students with a valid student email.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero