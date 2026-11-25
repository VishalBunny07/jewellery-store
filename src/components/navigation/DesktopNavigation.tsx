
import Link from "next/link";

const navigationItems = [
  { name: "New In", href: "/collections/new-arrivals" },
  { name: "Rings", href: "/categories/rings" },
  { name: "Earrings", href: "/categories/earrings" },
  { name: "Necklaces", href: "/categories/necklaces" },
  { name: "Bracelets", href: "/categories/bracelets" },
  { name: "Mangalsutra", href: "/categories/mangalsutra" },
  { name: "Gifting", href: "/collections/gifts" },
  { name: "Collections", href: "/collections" },
];

export default function DesktopNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden border-t border-border bg-background lg:block"
    >
      <div className="section-container">
        <ul className="flex items-center justify-center gap-8 py-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="relative text-[12px] font-medium tracking-wide text-foreground transition-colors duration-200 hover:text-primary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
