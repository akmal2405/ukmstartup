import { Lightbulb, Sparkles, Building2, type LucideIcon } from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Lightbulb,
    title: "Share Ideas",
    description:
      "Post your startup concept in minutes, gather upvotes, and refine it with feedback from fellow UKM founders and builders.",
  },
  {
    icon: Sparkles,
    title: "Get AI Feedback",
    description:
      "Instant, structured analysis of your pitch market fit, risks, and next steps powered by AI trained on real venture playbooks.",
  },
  {
    icon: Building2,
    title: "Connect with Industry",
    description:
      "Get matched with mentors, founders, and investors from our partner network who can open doors and accelerate your launch.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything you need to go from idea to launch
        </h2>
        <p className="mx-auto mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Three simple steps to take your idea further than a group chat ever could.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl bg-card p-8 ring-1 ring-border transition-shadow hover:shadow-lg"
          >
            {/* Gradient icon background */}
            <div
              className="flex size-12 items-center justify-center rounded-xl text-white"
              style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            >
              <feature.icon className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features