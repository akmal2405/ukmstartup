import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

const navItems = [
  { label: "How it works", href: "#features" },
  { label: "Community", href: "#stats" },
  { label: "Join Us", href: "#cta" },
]

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">

          <span className="text-xl font-bold tracking-tight text-foreground">
            UKM<span className="bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent">StartUp</span>
          </span>
        </Link>

        {/* Nav links - hidden on mobile */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button
            className="text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            asChild
          >
            <Link to="/signup">Register</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader