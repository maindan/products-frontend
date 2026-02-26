"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Controle de Produção", href: "/producao" },
  { label: "Produtos", href: "/produtos" },
  { label: "Materiais", href: "/materiais" },
]

type NavLinksProps = {
  pathname: string
  mobile?: boolean
}

function NavLinks({ pathname, mobile = false }: NavLinksProps) {
  return (
    <nav
      className={cn(
        "flex gap-6",
        mobile && "flex-col gap-4 mt-8"
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary"
                : "text-muted-foreground",
                mobile && "text-lg"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-10">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          Product Manager
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks pathname={pathname} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64 px-4 pt-2">
              <NavLinks pathname={pathname} mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}