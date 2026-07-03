const stats = [
  { value: "2,400+", label: "Targeted Student founders" },
  { value: "1,800+", label: "Targeted Ideas shared" },
  { value: "120+", label: "Targeted Industry mentors" },
]

export function StatsBar() {
  return (
    <section id="stats" className="border-y bg-accent/40">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-y-10 px-6 py-16 sm:grid-cols-3 sm:gap-x-6 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            {/* Gradient number */}
            <div
              className="text-4xl font-bold tracking-tight bg-clip-text text-transparent sm:text-5xl"
              style={{ backgroundImage: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            >
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground sm:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsBar