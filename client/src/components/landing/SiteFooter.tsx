import { Link } from "react-router-dom"
import { Lightbulb } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t ">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="flex size-8 items-center justify-center rounded-lg text-white"
            style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
          >
            <Lightbulb className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            UKM
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            >
              StartUp
            </span>
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © 2026 UKMStartUp. A student initiative at Universiti Kebangsaan Malaysia.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter