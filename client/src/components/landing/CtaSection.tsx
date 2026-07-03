import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div
        className="overflow-hidden rounded-3xl px-6 py-20 text-center sm:px-16"
        style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
      >
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your next big idea deserves more than a notes app
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-white/85">
          Join thousands of UKM students turning ideas into startups. Sign up
          today with your student email.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* White button with gradient text */}
          <Button
            size="lg"
            className="h-12 bg-white px-8 text-base font-semibold transition-opacity hover:bg-white hover:opacity-90"
            asChild
          >
            <Link to="/signup">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
              >
                Create your account
              </span>
              <ArrowRight className="size-4 text-[#9B59D0]" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CtaSection